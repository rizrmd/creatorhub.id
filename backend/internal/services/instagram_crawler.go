package services

import (
	"encoding/json"
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"time"

	"creatorhub/backend/internal/models"
)

var igHeaders = map[string]string{
	"X-IG-App-ID":     "936619743392459",
	"X-Requested-With": "XMLHttpRequest",
}

func CrawlInstagramPosts(account string) (*models.InstagramScrapeResponse, error) {
	// Method 1: Try Instagram API
	result, err := crawlInstagramAPI(account)
	if err == nil && result.Success && len(result.Data) > 0 {
		return result, nil
	}

	// Method 2: Fallback to HTML scraping
	return crawlInstagramHTML(account)
}

func crawlInstagramAPI(account string) (*models.InstagramScrapeResponse, error) {
	profileURL := fmt.Sprintf("https://i.instagram.com/api/v1/users/web_profile_info/?username=%s", account)
	body, status, err := doHTTPGet(profileURL, igHeaders)
	if err != nil {
		return &models.InstagramScrapeResponse{Success: false, Error: err.Error()}, nil
	}
	if status == 401 || status == 403 {
		return crawlInstagramHTML(account)
	}
	if status != 200 {
		return &models.InstagramScrapeResponse{Success: false, Error: fmt.Sprintf("HTTP %d", status)}, nil
	}

	var resp struct {
		Data struct {
			User struct {
				Full_name    string `json:"full_name"`
				Biography    string `json:"biography"`
				Profile_pic_url string `json:"profile_pic_url"`
				Edge_followed_by struct{ Count int64 } `json:"edge_followed_by"`
				Edge_follow      struct{ Count int64 } `json:"edge_follow"`
				Edge_owner_to_timeline_media struct {
					Count    int `json:"count"`
					PageInfo struct {
						HasNextPage bool   `json:"has_next_page"`
						EndCursor   string `json:"end_cursor"`
					} `json:"page_info"`
					Edges []igMediaEdge `json:"edges"`
				} `json:"edge_owner_to_timeline_media"`
			} `json:"user"`
		} `json:"data"`
	}

	if err := json.Unmarshal(body, &resp); err != nil {
		return &models.InstagramScrapeResponse{Success: false, Error: "failed to parse response"}, nil
	}

	user := resp.Data.User
	if user.Profile_pic_url == "" {
		return &models.InstagramScrapeResponse{Success: false, Error: "user not found or private"}, nil
	}

	posts := extractIGPosts(account, resp.Data.User.Edge_owner_to_timeline_media.Edges)

	result := &models.InstagramScrapeResponse{
		Success:     true,
		Account:     account,
		DisplayName: user.Full_name,
		Bio:         user.Biography,
		Followers:   user.Edge_followed_by.Count,
		Following:   user.Edge_follow.Count,
		Posts:       user.Edge_owner_to_timeline_media.Count,
		ProfilePic:  user.Profile_pic_url,
		Data:        posts,
	}

	// Paginate
	pageInfo := resp.Data.User.Edge_owner_to_timeline_media.PageInfo
	endCursor := pageInfo.EndCursor

	for pageInfo.HasNextPage && endCursor != "" {
		time.Sleep(800 * time.Millisecond)

		scrollURL := fmt.Sprintf("https://i.instagram.com/api/v1/users/web_profile_info/?username=%s&max_id=%s", account, endCursor)
		scrollBody, scrollStatus, scrollErr := doHTTPGet(scrollURL, igHeaders)
		if scrollErr != nil || scrollStatus != 200 {
			break
		}

		var scrollResp struct {
			Data struct {
				User struct {
					Edge_owner_to_timeline_media struct {
						PageInfo struct {
							HasNextPage bool   `json:"has_next_page"`
							EndCursor   string `json:"end_cursor"`
						} `json:"page_info"`
						Edges []igMediaEdge `json:"edges"`
					} `json:"edge_owner_to_timeline_media"`
				} `json:"user"`
			} `json:"data"`
		}

		if err := json.Unmarshal(scrollBody, &scrollResp); err != nil {
			break
		}

		timeline := scrollResp.Data.User.Edge_owner_to_timeline_media
		pageInfo = timeline.PageInfo
		endCursor = pageInfo.EndCursor

		posts = append(posts, extractIGPosts(account, timeline.Edges)...)
	}

	result.Data = posts
	return result, nil
}

func crawlInstagramHTML(account string) (*models.InstagramScrapeResponse, error) {
	htmlURL := fmt.Sprintf("https://www.instagram.com/%s/", account)
	body, status, err := doHTTPGet(htmlURL, map[string]string{
		"Referer": "https://www.instagram.com/",
	})
	if err != nil {
		return &models.InstagramScrapeResponse{Success: false, Error: err.Error()}, nil
	}
	if status != 200 {
		return &models.InstagramScrapeResponse{Success: false, Error: fmt.Sprintf("HTTP %d", status)}, nil
	}

	html := string(body)

	// Extract profile data from HTML
	displayName := extractBetween(html, `<meta property="og:title" content="`, `"`)
	bio := extractBetween(html, `<meta property="og:description" content="`, `"`)
	profilePic := extractBetween(html, `<meta property="og:image" content="`, `"`)

	// Try to find follower count from meta tags or JSON-LD
	followers := extractNumberFromPattern(html, `"edge_followed_by":\{"count":(\d+)\}`)

	// Extract posts from embedded JSON
	posts := extractPostsFromHTML(account, html)

	result := &models.InstagramScrapeResponse{
		Success:     true,
		Account:     account,
		DisplayName: displayName,
		Bio:         bio,
		Followers:   followers,
		Posts:       len(posts),
		ProfilePic:  profilePic,
		Data:        posts,
	}

	return result, nil
}

type igMediaEdge struct {
	Node struct {
		Shortcode      string `json:"shortcode"`
		IsVideo        bool   `json:"is_video"`
		VideoViewCount int64  `json:"video_view_count"`
		DisplayURL     string `json:"display_url"`
		TakenAt        int64  `json:"taken_at"`
		EdgeLikedBy    struct{ Count int64 } `json:"edge_liked_by"`
		EdgeMediaToComment struct{ Count int64 } `json:"edge_media_to_comment"`
		EdgeMediaToCaption struct {
			Edges []struct {
				Node struct{ Text string } `json:"node"`
			} `json:"edges"`
		} `json:"edge_media_to_caption"`
	} `json:"node"`
}

func extractIGPosts(account string, edges []igMediaEdge) []models.InstagramPost {
	var posts []models.InstagramPost
	for _, e := range edges {
		n := e.Node
		postedAt := time.Unix(n.TakenAt, 0)
		caption := ""
		if len(n.EdgeMediaToCaption.Edges) > 0 {
			caption = n.EdgeMediaToCaption.Edges[0].Node.Text
		}
		posts = append(posts, models.InstagramPost{
			Shortcode: n.Shortcode,
			Account:   account,
			Caption:   caption,
			MediaURL:  n.DisplayURL,
			Views:     int(n.VideoViewCount),
			Likes:     int(n.EdgeLikedBy.Count),
			Comments:  int(n.EdgeMediaToComment.Count),
			IsVideo:   n.IsVideo,
			PostedAt:  &postedAt,
		})
	}
	return posts
}

func extractPostsFromHTML(account string, html string) []models.InstagramPost {
	var posts []models.InstagramPost

	// Try to find post shortcodes from HTML links
_shortcodeRe := regexp.MustCompile(`/p/([A-Za-z0-9_-]+)/`)
	matches := _shortcodeRe.FindAllStringSubmatch(html, -1)

	seen := make(map[string]bool)
	for _, m := range matches {
		shortcode := m[1]
		if seen[shortcode] {
			continue
		}
		seen[shortcode] = true

		posts = append(posts, models.InstagramPost{
			Shortcode: shortcode,
			Account:   account,
		})
	}

	return posts
}

func extractBetween(s, start, end string) string {
	i := strings.Index(s, start)
	if i == -1 {
		return ""
	}
	i += len(start)
	j := strings.Index(s[i:], end)
	if j == -1 {
		return ""
	}
	return s[i : i+j]
}

func extractNumberFromPattern(s, pattern string) int64 {
	re := regexp.MustCompile(pattern)
	matches := re.FindStringSubmatch(s)
	if len(matches) < 2 {
		return 0
	}
	n, _ := strconv.ParseInt(matches[1], 10, 64)
	return n
}
