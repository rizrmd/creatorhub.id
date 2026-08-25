package services

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
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
	// Do NOT set Accept-Encoding manually â€” Go's transport auto-decompresses gzip/deflate.
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
	body, err := io.ReadAll(io.LimitReader(resp.Body, 10<<20))
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
	body, _ := io.ReadAll(io.LimitReader(resp.Body, 10<<20))

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

// scrapeTikTok uses TikHub ONLY. NEVER fall back to tiktok.com scraping
// (oEmbed / web API / HTML / Playwright) â€” TikTok blocks datacenter IPs,
// which is exactly what caused the "photo disappeared" bugs before.
// LESSON RECORDED IN CLAUDE.md: never not use TikHub for TikTok.
func scrapeTikTok(handle string) *ScrapeResult {
	apiKey := os.Getenv("TIKHUB_API_KEY")
	if apiKey == "" {
		return &ScrapeResult{Success: false, Error: "TIKHUB_API_KEY not configured"}
	}

	result := scrapeTikTokTikHub(handle, apiKey)
	if !result.Success {
		return &ScrapeResult{Success: false, Error: result.Error}
	}
	return result
}

func scrapeTikTokTikHub(handle, apiKey string) *ScrapeResult {
	url := fmt.Sprintf("https://api.tikhub.io/api/v1/tiktok/web/fetch_user_profile?uniqueId=%s", handle)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return &ScrapeResult{Success: false}
	}
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Accept", "application/json")

	resp, err := httpClient.Do(req)
	if err != nil || resp.StatusCode != 200 {
		return &ScrapeResult{Success: false}
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(io.LimitReader(resp.Body, 10<<20))

	var tikhubResp struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
		Data    struct {
			StatusCode int `json:"statusCode"`
			StatusMsg  string `json:"statusMsg"`
			UserInfo   struct {
				User struct {
					Nickname     string `json:"nickname"`
					AvatarLarger string `json:"avatarLarger"`
					Signature    string `json:"signature"`
					UniqueID     string `json:"uniqueId"`
				} `json:"user"`
				Stats struct {
					FollowerCount  int64 `json:"followerCount"`
					FollowingCount int64 `json:"followingCount"`
					HeartCount     int64 `json:"heartCount"`
					VideoCount     int64 `json:"videoCount"`
				} `json:"stats"`
			} `json:"userInfo"`
		} `json:"data"`
	}

	if err := json.Unmarshal(body, &tikhubResp); err != nil {
		return &ScrapeResult{Success: false, Error: "failed to parse TikHub response"}
	}
	if tikhubResp.Code != 200 && tikhubResp.Code != 0 {
		return &ScrapeResult{Success: false, Error: fmt.Sprintf("TikHub error code %d: %s", tikhubResp.Code, tikhubResp.Message)}
	}
	// TikTok inner status: 0 = OK. Else (e.g. 10221) = TikTok rejected the
	// profile request at TikHub's upstream â€” surface it, don't silently fail.
	if tikhubResp.Data.StatusCode != 0 && tikhubResp.Data.StatusCode != 200 {
		msg := tikhubResp.Data.StatusMsg
		if msg == "" {
			msg = fmt.Sprintf("TikTok upstream status %d", tikhubResp.Data.StatusCode)
		}
		return &ScrapeResult{Success: false, Error: msg}
	}

	user := tikhubResp.Data.UserInfo
	picURL := user.User.AvatarLarger
	if strings.HasPrefix(picURL, "//") {
		picURL = "https:" + picURL
	}

	name := user.User.Nickname
	if name == "" {
		name = handle
	}

	return &ScrapeResult{
		ProfilePictureURL: picURL,
		FollowerCount:     user.Stats.FollowerCount,
		FollowingCount:    user.Stats.FollowingCount,
		LikesCount:        user.Stats.HeartCount,
		Bio:               user.User.Signature,
		DisplayName:       name,
		Success:           picURL != "" || user.Stats.FollowerCount > 0,
	}
}


// --- Instagram ---

func scrapeInstagram(handle string) *ScrapeResult {
	// Primary: instatouch (drawrowfly) with our IG session cookie — passes IG's
	// login-wall checks. When INSTAGRAM_SESSION is unset or the tool fails,
	// fall back to the anonymous API -> HTML chain.
	if r := scrapeInstagramInstaTouch(handle); r != nil {
		return r
	}

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

// scrapeInstagramInstaTouch fetches user metadata via the bundled instatouch
// (drawrowfly/instagram-scraper) Node tool. Returns nil when the tool is not
// usable (no session / not installed / failed) so the caller can fall back.
func scrapeInstagramInstaTouch(handle string) *ScrapeResult {
	session := strings.TrimSpace(os.Getenv("INSTAGRAM_SESSION"))
	if session == "" {
		return nil
	}
	dir := os.Getenv("IGTOOL_DIR")
	if dir == "" {
		dir = "/app/igtool"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 45*time.Second)
	defer cancel()
	cmd := exec.CommandContext(ctx, "node", "igmeta.cjs", handle)
	cmd.Dir = dir
	cmd.Env = append(os.Environ(), "INSTAGRAM_SESSION="+session)

	out, err := cmd.Output()
	if err != nil {
		return nil
	}

	var payload struct {
		Error             string `json:"error"`
		UserName          string `json:"username"`
		FullName          string `json:"full_name"`
		Biography         string `json:"biography"`
		ProfilePicURLHD   string `json:"profile_pic_url_hd"`
		ProfilePicURL     string `json:"profile_pic_url"`
		EdgeFollowedBy    struct {
			Count int64 `json:"count"`
		} `json:"edge_followed_by"`
		EdgeFollow struct {
			Count int64 `json:"count"`
		} `json:"edge_follow"`
	}
	if err := json.Unmarshal(out, &payload); err != nil {
		return nil
	}
	if payload.Error != "" || payload.ProfilePicURLHD == "" && payload.ProfilePicURL == "" {
		return nil
	}

	picURL := payload.ProfilePicURLHD
	if picURL == "" {
		picURL = payload.ProfilePicURL
	}
	name := payload.FullName
	if name == "" {
		name = handle
	}

	return &ScrapeResult{
		ProfilePictureURL: picURL,
		FollowerCount:     payload.EdgeFollowedBy.Count,
		FollowingCount:    payload.EdgeFollow.Count,
		Bio:               payload.Biography,
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
	// Try JSON format first: "followers_count":240400886
	re = regexp.MustCompile(`"followers_count":\s*(\d+)`)
	if m := re.FindStringSubmatch(html); len(m) > 1 {
		followers, _ = strconv.ParseInt(m[1], 10, 64)
	}
	// Fallback: text format "240M Followers"
	if followers == 0 {
		re = regexp.MustCompile(`([\d,.]+[KMBkmb]?)\s*Followers`)
		if m := re.FindStringSubmatch(html); len(m) > 1 {
			followers = parseFollowerCount(m[1])
		}
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
