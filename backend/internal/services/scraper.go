package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"
)

type ScrapeResult struct {
	ProfilePictureURL string `json:"profilePictureUrl"`
	FollowerCount     int64  `json:"followerCount"`
	FollowingCount    int64  `json:"followingCount,omitempty"`
	LikesCount        int64  `json:"likesCount,omitempty"`
	Bio               string `json:"bio,omitempty"`
	DisplayName       string `json:"displayName"`
	Success           bool   `json:"success"`
	Error             string `json:"error,omitempty"`
}

var httpClient = &http.Client{
	Timeout: 20 * time.Second,
	CheckRedirect: func(req *http.Request, via []*http.Request) error {
		if len(via) >= 8 {
			return fmt.Errorf("too many redirects")
		}
		return nil
	},
}

var chromeUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
var mobileUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"

func ScrapeSocial(platform, handle string) *ScrapeResult {
	handle = strings.TrimPrefix(handle, "@")
	handle = strings.TrimSpace(handle)

	switch strings.ToLower(platform) {
	case "youtube":
		return scrapeYouTube(handle)
	case "tiktok":
		return scrapeTikTok(handle)
	case "instagram":
		return scrapeInstagram(handle)
	case "x", "twitter":
		return scrapeTwitter(handle)
	case "facebook":
		return scrapeFacebook(handle)
	case "threads":
		return scrapeThreads(handle)
	default:
		return &ScrapeResult{Success: false, Error: "unsupported platform: " + platform}
	}
}

func doHTTPGet(url string, extraHeaders map[string]string) ([]byte, int, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, 0, err
	}
	req.Header.Set("User-Agent", chromeUA)
	req.Header.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8")
	req.Header.Set("Accept-Language", "en-US,en;q=0.9,id;q=0.8")
	// Do NOT set Accept-Encoding manually — Go's transport auto-decompresses gzip/deflate.
	// Manually setting it disables auto-decompression, causing us to read raw compressed bytes.
	req.Header.Set("Cache-Control", "no-cache")
	req.Header.Set("Sec-Fetch-Dest", "document")
	req.Header.Set("Sec-Fetch-Mode", "navigate")
	req.Header.Set("Sec-Fetch-Site", "none")
	req.Header.Set("Sec-Fetch-User", "?1")
	req.Header.Set("Upgrade-Insecure-Requests", "1")
	for k, v := range extraHeaders {
		req.Header.Set(k, v)
	}
	resp, err := httpClient.Do(req)
	if err != nil {
		return nil, 0, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, resp.StatusCode, err
	}
	return body, resp.StatusCode, nil
}

// --- YouTube ---

func scrapeYouTube(handle string) *ScrapeResult {
	// Method 1: oEmbed API (reliable for name + pic)
	oembedResult := scrapeYouTubeOEmbed(handle)

	// Method 2: HTML page scraping for follower count
	htmlResult := scrapeYouTubeHTML(handle)

	// Merge results: oembed for name/pic, html for followers
	result := &ScrapeResult{
		Success: oembedResult.Success || htmlResult.Success,
	}

	if oembedResult.Success {
		result.DisplayName = oembedResult.DisplayName
		result.ProfilePictureURL = oembedResult.ProfilePictureURL
	}
	if htmlResult.Success {
		if result.ProfilePictureURL == "" {
			result.ProfilePictureURL = htmlResult.ProfilePictureURL
		}
		if result.DisplayName == "" || result.DisplayName == handle {
			result.DisplayName = htmlResult.DisplayName
		}
		result.FollowerCount = htmlResult.FollowerCount
	}

	if result.DisplayName == "" {
		result.DisplayName = handle
	}

	if !result.Success {
		result.Error = "could not fetch YouTube data"
	}

	return result
}

func scrapeYouTubeOEmbed(handle string) *ScrapeResult {
	url := fmt.Sprintf("https://www.youtube.com/oembed?url=https://www.youtube.com/@%s&format=json", handle)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return &ScrapeResult{Success: false}
	}
	req.Header.Set("User-Agent", chromeUA)
	resp, err := httpClient.Do(req)
	if err != nil || resp.StatusCode != 200 {
		return &ScrapeResult{Success: false}
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)

	var oembed struct {
		Title   string `json:"title"`
		IconURL string `json:"icon_url"`
	}
	if err := json.Unmarshal(body, &oembed); err != nil {
		return &ScrapeResult{Success: false}
	}

	picURL := oembed.IconURL
	if strings.HasPrefix(picURL, "//") {
		picURL = "https:" + picURL
	}

	return &ScrapeResult{
		ProfilePictureURL: picURL,
		DisplayName:       oembed.Title,
		Success:           true,
	}
}

func scrapeYouTubeHTML(handle string) *ScrapeResult {
	url := fmt.Sprintf("https://www.youtube.com/@%s", handle)
	body, status, err := doHTTPGet(url, map[string]string{
		"Referer": "https://www.youtube.com/",
	})
	if err != nil {
		return &ScrapeResult{Success: false, Error: err.Error()}
	}
	if status != 200 {
		return &ScrapeResult{Success: false, Error: fmt.Sprintf("HTTP %d", status)}
	}

	html := string(body)

	picURL := extractMetaContent(html, "og:image")
	name := extractMetaContent(html, "og:title")
	if name == "" {
		name = handle
	}

	bio := extractMetaContent(html, "description")

	var followers int64

	// Pattern 1: meta description "Subscribe to X subscribers"
	if bio != "" {
		re := regexp.MustCompile(`([\d,]+\.?\d*[KMB]?)\s*subscrib`)
		if m := re.FindStringSubmatch(bio); len(m) > 1 {
			followers = parseFollowerCount(m[1])
		}
	}

	// Pattern 2: subscriberCountText simpleText
	if followers == 0 {
		patterns := []string{
			`"subscriberCountText":\s*\{[^}]*"simpleText":\s*"([\d,.KMBkmb ]+)"`,
			`"subscriberCount":\s*"?(\d+)"?`,
			`"subscriberCountText":\{"accessibility":\{"accessibilityData":\{"label":"([\d,.KMBkmb ]+)"`,
			`([\d,.]+[KMBkmb])\s*subscribers`,
			`"subscriberCountText":\s*\{"runs":\[\{"text":"([\d,.KMBkmb ]+)"`,
		}
		for _, pat := range patterns {
			re := regexp.MustCompile(pat)
			if m := re.FindStringSubmatch(html); len(m) > 1 {
				followers = parseFollowerCount(strings.TrimSpace(m[1]))
				if followers > 0 {
					break
				}
			}
		}
	}

	return &ScrapeResult{
		ProfilePictureURL: picURL,
		FollowerCount:     followers,
		Bio:               bio,
		DisplayName:       name,
		Success:           true,
	}
}

// --- TikTok ---

func scrapeTikTok(handle string) *ScrapeResult {
	// Method 1: oEmbed API (reliable)
	oembedResult := scrapeTikTokOEmbed(handle)
	if oembedResult.Success && oembedResult.FollowerCount > 0 {
		return oembedResult
	}

	// Method 2: TikTok web API
	apiResult := scrapeTikTokAPI(handle)
	if apiResult.Success && apiResult.FollowerCount > 0 {
		return apiResult
	}

	// Method 3: HTML page scraping
	htmlResult := scrapeTikTokHTML(handle)

	// Merge best results
	result := &ScrapeResult{Success: oembedResult.Success || apiResult.Success || htmlResult.Success}

	if apiResult.Success {
		result.DisplayName = apiResult.DisplayName
		result.ProfilePictureURL = apiResult.ProfilePictureURL
		result.FollowerCount = apiResult.FollowerCount
	}
	if oembedResult.Success {
		if result.DisplayName == "" || result.DisplayName == handle {
			result.DisplayName = oembedResult.DisplayName
		}
		if result.ProfilePictureURL == "" {
			result.ProfilePictureURL = oembedResult.ProfilePictureURL
		}
	}
	if htmlResult.Success {
		if result.ProfilePictureURL == "" {
			result.ProfilePictureURL = htmlResult.ProfilePictureURL
		}
		if result.FollowerCount == 0 {
			result.FollowerCount = htmlResult.FollowerCount
		}
		if result.DisplayName == "" || result.DisplayName == handle {
			result.DisplayName = htmlResult.DisplayName
		}
	}

	if result.DisplayName == "" {
		result.DisplayName = handle
	}

	if !result.Success {
		result.Error = "could not fetch TikTok data"
	}

	return result
}

func scrapeTikTokOEmbed(handle string) *ScrapeResult {
	tiktokURL := fmt.Sprintf("https://www.tiktok.com/@%s", handle)
	url := fmt.Sprintf("https://www.tiktok.com/oembed?url=%s", tiktokURL)
	body, status, err := doHTTPGet(url, map[string]string{
		"Referer": "https://www.tiktok.com/",
	})
	if err != nil || status != 200 {
		return &ScrapeResult{Success: false}
	}

	var oembed struct {
		Title       string `json:"title"`
		AuthorName  string `json:"author_name"`
		AuthorURL   string `json:"author_url"`
		ThumbnailURL string `json:"thumbnail_url"`
	}
	if err := json.Unmarshal(body, &oembed); err != nil {
		return &ScrapeResult{Success: false}
	}

	picURL := oembed.ThumbnailURL
	if strings.HasPrefix(picURL, "//") {
		picURL = "https:" + picURL
	}

	name := oembed.AuthorName
	if name == "" {
		name = handle
	}

	return &ScrapeResult{
		ProfilePictureURL: picURL,
		DisplayName:       name,
		Success:           picURL != "",
	}
}

func scrapeTikTokAPI(handle string) *ScrapeResult {
	url := fmt.Sprintf("https://www.tiktok.com/api/user/detail/?uniqueId=%s", handle)
	body, status, err := doHTTPGet(url, map[string]string{
		"Referer":          fmt.Sprintf("https://www.tiktok.com/@%s", handle),
		"Accept":           "application/json, text/plain, */*",
	})
	if err != nil || status != 200 {
		return &ScrapeResult{Success: false}
	}

	var resp struct {
		UserInfo struct {
			User struct {
				Nickname   string `json:"nickname"`
				AvatarLarger string `json:"avatarLarger"`
			} `json:"user"`
			Stats struct {
				FollowerCount int64 `json:"followerCount"`
			} `json:"stats"`
		} `json:"userInfo"`
	}
	if err := json.Unmarshal(body, &resp); err != nil {
		return &ScrapeResult{Success: false}
	}

	picURL := resp.UserInfo.User.AvatarLarger
	if strings.HasPrefix(picURL, "//") {
		picURL = "https:" + picURL
	}

	name := resp.UserInfo.User.Nickname
	if name == "" {
		name = handle
	}

	return &ScrapeResult{
		ProfilePictureURL: picURL,
		FollowerCount:     resp.UserInfo.Stats.FollowerCount,
		DisplayName:       name,
		Success:           picURL != "" || resp.UserInfo.Stats.FollowerCount > 0,
	}
}

func scrapeTikTokHTML(handle string) *ScrapeResult {
	url := fmt.Sprintf("https://www.tiktok.com/@%s", handle)
	body, status, err := doHTTPGet(url, map[string]string{
		"Referer": "https://www.tiktok.com/",
	})
	if err != nil || status != 200 {
		return &ScrapeResult{Success: false}
	}

	html := string(body)

	// Extract data via regex from raw HTML — avoids JSON duplicate key issues
	result := &ScrapeResult{DisplayName: handle}

	// Profile picture: "avatarLarger":"https://..."
	if m := regexp.MustCompile(`"avatarLarger":\s*"([^"]+)"`).FindStringSubmatch(html); len(m) > 1 {
		result.ProfilePictureURL = m[1]
	}

	// Display name: "nickname":"..."
	if m := regexp.MustCompile(`"nickname":\s*"([^"]+)"`).FindStringSubmatch(html); len(m) > 1 {
		result.DisplayName = m[1]
	}

	// Followers
	if m := regexp.MustCompile(`"followerCount":\s*(\d+)`).FindStringSubmatch(html); len(m) > 1 {
		result.FollowerCount, _ = strconv.ParseInt(m[1], 10, 64)
	}

	// Following
	if m := regexp.MustCompile(`"followingCount":\s*(\d+)`).FindStringSubmatch(html); len(m) > 1 {
		result.FollowingCount, _ = strconv.ParseInt(m[1], 10, 64)
	}

	// Likes (heartCount)
	if m := regexp.MustCompile(`"heartCount":\s*(\d+)`).FindStringSubmatch(html); len(m) > 1 {
		result.LikesCount, _ = strconv.ParseInt(m[1], 10, 64)
	} else if m := regexp.MustCompile(`"heart":\s*(\d+)`).FindStringSubmatch(html); len(m) > 1 {
		result.LikesCount, _ = strconv.ParseInt(m[1], 10, 64)
	}

	// Bio: "signature":"..."
	if m := regexp.MustCompile(`"signature":\s*"([^"]*)"`).FindStringSubmatch(html); len(m) > 1 {
		result.Bio = strings.ReplaceAll(m[1], `\n`, "\n")
	}

	result.Success = result.ProfilePictureURL != "" || result.FollowerCount > 0
	if !result.Success {
		result.Error = "could not extract profile data"
	}

	return result
}

func parseTikTokJSON(jsonStr string, handle string) *ScrapeResult {
	var data map[string]interface{}
	if err := json.Unmarshal([]byte(jsonStr), &data); err != nil {
		return &ScrapeResult{Success: false, Error: "failed to parse TikTok data"}
	}

	// Universal data format
	if defaultScope, ok := data["__DEFAULT_SCOPE__"].(map[string]interface{}); ok {
		if userDetail, ok := defaultScope["webapp.user-detail"].(map[string]interface{}); ok {
			if userInfo, ok := userDetail["userInfo"].(map[string]interface{}); ok {
				return extractTikTokUser(userInfo, handle)
			}
		}
	}

	// SIGI_STATE format
	if userModule, ok := data["UserModule"].(map[string]interface{}); ok {
		if users, ok := userModule["users"].(map[string]interface{}); ok {
			if userData, ok := users[handle].(map[string]interface{}); ok {
				return extractTikTokUser(userData, handle)
			}
		}
	}

	return &ScrapeResult{Success: false, Error: "could not find user data"}
}

func extractTikTokUser(userInfo map[string]interface{}, handle string) *ScrapeResult {
	result := &ScrapeResult{Success: true, DisplayName: handle}

	if user, ok := userInfo["user"].(map[string]interface{}); ok {
		for _, key := range []string{"avatarLarger", "avatarMedium", "avatarThumb"} {
			if val, exists := user[key]; exists {
				if avatar, ok := val.(string); ok && avatar != "" {
					result.ProfilePictureURL = avatar
					break
				}
			}
		}
		if nickname, ok := user["nickname"].(string); ok && nickname != "" {
			result.DisplayName = nickname
		}
	}

	if stats, ok := userInfo["stats"].(map[string]interface{}); ok {
		if fc, ok := stats["followerCount"].(float64); ok {
			result.FollowerCount = int64(fc)
		}
	}

	if result.ProfilePictureURL == "" {
		result.Success = false
		result.Error = "could not extract profile picture"
	}

	return result
}

// --- Instagram ---

func scrapeInstagram(handle string) *ScrapeResult {
	url := fmt.Sprintf("https://i.instagram.com/api/v1/users/web_profile_info/?username=%s", handle)
	body, status, err := doHTTPGet(url, map[string]string{
		"X-IG-App-ID":     "936619743392459",
		"X-Requested-With": "XMLHttpRequest",
		"Referer":          fmt.Sprintf("https://www.instagram.com/%s/", handle),
	})
	if err != nil {
		return &ScrapeResult{Success: false, Error: err.Error()}
	}
	if status == 401 || status == 403 {
		// Try alternative method
		return scrapeInstagramHTML(handle)
	}
	if status != 200 {
		return &ScrapeResult{Success: false, Error: fmt.Sprintf("HTTP %d", status)}
	}

	var resp struct {
		Data struct {
			User struct {
				Full_name        string `json:"full_name"`
				Biography        string `json:"biography"`
				Profile_pic_url_hd string `json:"profile_pic_url_hd"`
				Profile_pic_url  string `json:"profile_pic_url"`
				Edge_followed_by struct {
					Count int64 `json:"count"`
				} `json:"edge_followed_by"`
				Edge_follow      struct {
					Count int64 `json:"count"`
				} `json:"edge_follow"`
			} `json:"user"`
		} `json:"data"`
	}

	if err := json.Unmarshal(body, &resp); err != nil {
		return &ScrapeResult{Success: false, Error: "failed to parse Instagram response"}
	}

	user := resp.Data.User
	if user.Profile_pic_url_hd == "" && user.Profile_pic_url == "" {
		return &ScrapeResult{Success: false, Error: "user not found or private account"}
	}

	picURL := user.Profile_pic_url_hd
	if picURL == "" {
		picURL = user.Profile_pic_url
	}

	name := user.Full_name
	if name == "" {
		name = handle
	}

	return &ScrapeResult{
		ProfilePictureURL: picURL,
		FollowerCount:     user.Edge_followed_by.Count,
		FollowingCount:    user.Edge_follow.Count,
		Bio:               user.Biography,
		DisplayName:       name,
		Success:           true,
	}
}

func scrapeInstagramHTML(handle string) *ScrapeResult {
	url := fmt.Sprintf("https://www.instagram.com/%s/", handle)
	body, status, err := doHTTPGet(url, map[string]string{
		"Referer": "https://www.instagram.com/",
	})
	if err != nil || status != 200 {
		return &ScrapeResult{Success: false, Error: "Instagram blocked the request"}
	}

	html := string(body)
	picURL := extractMetaContent(html, "og:image")
	name := extractMetaContent(html, "og:title")
	if name == "" {
		name = handle
	}

	bio := extractMetaContent(html, "description")

	var followers int64
	re := regexp.MustCompile(`"edge_followed_by":\{"count":\s*(\d+)`)
	if m := re.FindStringSubmatch(html); len(m) > 1 {
		followers, _ = strconv.ParseInt(m[1], 10, 64)
	}

	var following int64
	re = regexp.MustCompile(`"edge_follow":\{"count":\s*(\d+)`)
	if m := re.FindStringSubmatch(html); len(m) > 1 {
		following, _ = strconv.ParseInt(m[1], 10, 64)
	}

	return &ScrapeResult{
		ProfilePictureURL: picURL,
		FollowerCount:     followers,
		FollowingCount:    following,
		Bio:               bio,
		DisplayName:       name,
		Success:           picURL != "",
	}
}

// --- Twitter/X ---

func scrapeTwitter(handle string) *ScrapeResult {
	// Method 1: syndication endpoint
	result := scrapeTwitterSyndication(handle)
	if result.Success && result.FollowerCount > 0 {
		return result
	}

	// Method 2: Fallback to HTML
	htmlResult := scrapeTwitterHTML(handle)

	// Merge
	final := &ScrapeResult{Success: result.Success || htmlResult.Success}
	if result.Success {
		final.DisplayName = result.DisplayName
		final.ProfilePictureURL = result.ProfilePictureURL
		final.FollowerCount = result.FollowerCount
	}
	if htmlResult.Success {
		if final.ProfilePictureURL == "" {
			final.ProfilePictureURL = htmlResult.ProfilePictureURL
		}
		if final.FollowerCount == 0 {
			final.FollowerCount = htmlResult.FollowerCount
		}
		if final.DisplayName == "" || final.DisplayName == handle {
			final.DisplayName = htmlResult.DisplayName
		}
	}

	if final.DisplayName == "" {
		final.DisplayName = handle
	}

	if !final.Success {
		final.Error = "could not fetch Twitter/X data"
	}

	return final
}

func scrapeTwitterSyndication(handle string) *ScrapeResult {
	url := fmt.Sprintf("https://syndication.twitter.com/srv/timeline-profile/screen-name/%s", handle)
	body, status, err := doHTTPGet(url, map[string]string{
		"Referer": "https://platform.twitter.com/",
	})
	if err != nil || status != 200 {
		return &ScrapeResult{Success: false}
	}

	html := string(body)

	picURL := ""
	re := regexp.MustCompile(`src="(https?://pbs\.twimg\.com/profile_images/[^"]+)"`)
	if m := re.FindStringSubmatch(html); len(m) > 1 {
		picURL = m[1]
	}

	var followers int64
	re = regexp.MustCompile(`(\d[\d,]*\.?\d*[KMBkmb]?)\s*Followers`)
	if m := re.FindStringSubmatch(html); len(m) > 1 {
		followers = parseFollowerCount(m[1])
	}

	name := handle
	re = regexp.MustCompile(`class="[^"]*fullname[^"]*"[^>]*>([^<]+)`)
	if m := re.FindStringSubmatch(html); len(m) > 1 {
		name = strings.TrimSpace(m[1])
	}

	return &ScrapeResult{
		ProfilePictureURL: picURL,
		FollowerCount:     followers,
		DisplayName:       name,
		Success:           picURL != "",
	}
}

func scrapeTwitterHTML(handle string) *ScrapeResult {
	url := fmt.Sprintf("https://x.com/%s", handle)
	body, status, err := doHTTPGet(url, map[string]string{
		"Referer": "https://x.com/",
	})
	if err != nil || status != 200 {
		return &ScrapeResult{Success: false}
	}

	html := string(body)

	picURL := extractMetaContent(html, "og:image")
	name := extractMetaContent(html, "og:title")
	if name == "" {
		name = handle
	}

	var followers int64
	followerPatterns := []string{
		`"followers_count":\s*(\d+)`,
		`"Followers"</span>[^<]*<[^>]*>([\d,.]+[KMBkmb]?)`,
		`([\d,.]+[KMBkmb]?)\s*Followers`,
	}
	for _, pat := range followerPatterns {
		re := regexp.MustCompile(pat)
		if m := re.FindStringSubmatch(html); len(m) > 1 {
			followers = parseFollowerCount(strings.TrimSpace(m[1]))
			if followers > 0 {
				break
			}
		}
	}

	return &ScrapeResult{
		ProfilePictureURL: picURL,
		FollowerCount:     followers,
		DisplayName:       name,
		Success:           picURL != "",
	}
}

// --- Facebook ---

func scrapeFacebook(handle string) *ScrapeResult {
	url := fmt.Sprintf("https://m.facebook.com/%s", handle)
	body, status, err := doHTTPGet(url, nil)
	if err != nil {
		return &ScrapeResult{Success: false, Error: err.Error()}
	}
	if status != 200 {
		return &ScrapeResult{Success: false, Error: fmt.Sprintf("HTTP %d", status)}
	}

	html := string(body)

	picURL := extractMetaContent(html, "og:image")
	name := extractMetaContent(html, "og:title")
	if name == "" {
		name = handle
	}

	var followers int64
	followerPatterns := []string{
		`"follower_count":\s*(\d+)`,
		`([\d,.]+[KMBkmb]?)\s*followers`,
		`"count":\s*(\d+)[^}]*"label":\s*"Followers"`,
	}
	for _, pat := range followerPatterns {
		re := regexp.MustCompile(pat)
		if m := re.FindStringSubmatch(html); len(m) > 1 {
			followers = parseFollowerCount(strings.TrimSpace(m[1]))
			if followers > 0 {
				break
			}
		}
	}

	if picURL == "" {
		return &ScrapeResult{Success: false, Error: "could not extract profile data"}
	}

	return &ScrapeResult{
		ProfilePictureURL: picURL,
		FollowerCount:     followers,
		DisplayName:       name,
		Success:           true,
	}
}

// --- Threads ---

func scrapeThreads(handle string) *ScrapeResult {
	url := fmt.Sprintf("https://www.threads.net/@%s", handle)
	body, status, err := doHTTPGet(url, nil)
	if err != nil {
		return &ScrapeResult{Success: false, Error: err.Error()}
	}
	if status != 200 {
		return &ScrapeResult{Success: false, Error: fmt.Sprintf("HTTP %d", status)}
	}

	html := string(body)

	picURL := extractMetaContent(html, "og:image")
	name := extractMetaContent(html, "og:title")
	if name == "" {
		name = handle
	}

	var followers int64
	followerPatterns := []string{
		`"follower_count":\s*(\d+)`,
		`([\d,.]+[KMBkmb]?)\s*followers`,
	}
	for _, pat := range followerPatterns {
		re := regexp.MustCompile(pat)
		if m := re.FindStringSubmatch(html); len(m) > 1 {
			followers = parseFollowerCount(strings.TrimSpace(m[1]))
			if followers > 0 {
				break
			}
		}
	}

	if picURL == "" {
		return &ScrapeResult{Success: false, Error: "could not extract profile data"}
	}

	return &ScrapeResult{
		ProfilePictureURL: picURL,
		FollowerCount:     followers,
		DisplayName:       name,
		Success:           true,
	}
}

// --- Helpers ---

func extractMetaContent(html, property string) string {
	patterns := []string{
		fmt.Sprintf(`<meta[^>]+property="%s"[^>]+content="([^"]*)"`, property),
		fmt.Sprintf(`<meta[^>]+content="([^"]*)"[^>]+property="%s"`, property),
		fmt.Sprintf(`<meta[^>]+name="%s"[^>]+content="([^"]*)"`, property),
		fmt.Sprintf(`<meta[^>]+content="([^"]*)"[^>]+name="%s"`, property),
	}
	for _, pat := range patterns {
		re := regexp.MustCompile(pat)
		if m := re.FindStringSubmatch(html); len(m) > 1 {
			return m[1]
		}
	}
	return ""
}

func parseFollowerCount(s string) int64 {
	s = strings.ReplaceAll(s, ",", "")
	s = strings.TrimSpace(s)

	multiplier := int64(1)
	if strings.HasSuffix(s, "K") || strings.HasSuffix(s, "k") {
		multiplier = 1000
		s = s[:len(s)-1]
	} else if strings.HasSuffix(s, "M") || strings.HasSuffix(s, "m") {
		multiplier = 1000000
		s = s[:len(s)-1]
	} else if strings.HasSuffix(s, "B") || strings.HasSuffix(s, "b") {
		multiplier = 1000000000
		s = s[:len(s)-1]
	}

	f, err := strconv.ParseFloat(s, 64)
	if err != nil {
		return 0
	}
	return int64(f * float64(multiplier))
}
