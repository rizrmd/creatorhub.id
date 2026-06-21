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
	DisplayName       string `json:"displayName"`
	Success           bool   `json:"success"`
	Error             string `json:"error,omitempty"`
}

var httpClient = &http.Client{
	Timeout: 15 * time.Second,
	CheckRedirect: func(req *http.Request, via []*http.Request) error {
		if len(via) >= 5 {
			return fmt.Errorf("too many redirects")
		}
		return nil
	},
}

var defaultHeaders = map[string]string{
	"Accept":          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
	"Accept-Language": "en-US,en;q=0.9",
	"Cache-Control":   "no-cache",
}

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
	for k, v := range defaultHeaders {
		req.Header.Set(k, v)
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36")
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
	url := fmt.Sprintf("https://www.youtube.com/@%s", handle)
	body, status, err := doHTTPGet(url, nil)
	if err != nil {
		return &ScrapeResult{Success: false, Error: err.Error()}
	}
	if status != 200 {
		return &ScrapeResult{Success: false, Error: fmt.Sprintf("HTTP %d", status)}
	}

	html := string(body)

	// Extract profile picture from og:image meta tag
	picURL := extractMetaContent(html, "og:image")

	// Extract subscriber count from meta description or page content
	var followers int64

	// Try meta description first: "Subscribe to X subscribers"
	desc := extractMetaContent(html, "description")
	if desc != "" {
		re := regexp.MustCompile(`(\d[\d,]*\.?\d*[KMBkmb]?)\s*subscrib`)
		if m := re.FindStringSubmatch(desc); len(m) > 1 {
			followers = parseFollowerCount(m[1])
		}
	}

	// Try page content: "X subscribers"
	if followers == 0 {
		re := regexp.MustCompile(`"subscriberCountText":\s*\{[^}]*"simpleText":\s*"([\d,.KMBkmb ]+)"`)
		if m := re.FindStringSubmatch(html); len(m) > 1 {
			followers = parseFollowerCount(strings.TrimSpace(m[1]))
		}
	}

	// Try another pattern
	if followers == 0 {
		re := regexp.MustCompile(`"subscriberCount":\s*"?(\d+)"?`)
		if m := re.FindStringSubmatch(html); len(m) > 1 {
			followers, _ = strconv.ParseInt(m[1], 10, 64)
		}
	}

	name := extractMetaContent(html, "og:title")
	if name == "" {
		name = handle
	}

	return &ScrapeResult{
		ProfilePictureURL: picURL,
		FollowerCount:     followers,
		DisplayName:       name,
		Success:           true,
	}
}

// --- TikTok ---

func scrapeTikTok(handle string) *ScrapeResult {
	url := fmt.Sprintf("https://www.tiktok.com/@%s", handle)
	body, status, err := doHTTPGet(url, map[string]string{
		"Referer": "https://www.tiktok.com/",
	})
	if err != nil {
		return &ScrapeResult{Success: false, Error: err.Error()}
	}
	if status != 200 {
		return &ScrapeResult{Success: false, Error: fmt.Sprintf("HTTP %d", status)}
	}

	html := string(body)

	// Try to extract SIGI_STATE JSON
	re := regexp.MustCompile(`<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>(.*?)</script>`)
	if m := re.FindStringSubmatch(html); len(m) > 1 {
		return parseTikTokJSON(m[1], handle)
	}

	// Try SIGI_STATE
	re = regexp.MustCompile(`<script id="SIGI_STATE"[^>]*>(.*?)</script>`)
	if m := re.FindStringSubmatch(html); len(m) > 1 {
		return parseTikTokJSON(m[1], handle)
	}

	// Fallback: try meta tags
	picURL := extractMetaContent(html, "og:image")
	name := extractMetaContent(html, "og:title")
	if name == "" {
		name = handle
	}

	return &ScrapeResult{
		ProfilePictureURL: picURL,
		FollowerCount:     0,
		DisplayName:       name,
		Success:           picURL != "",
		Error:             func() string { if picURL == "" { return "could not extract profile data" }; return "" }(),
	}
}

func parseTikTokJSON(jsonStr string, handle string) *ScrapeResult {
	var data map[string]interface{}
	if err := json.Unmarshal([]byte(jsonStr), &data); err != nil {
		return &ScrapeResult{Success: false, Error: "failed to parse TikTok data"}
	}

	// Navigate the JSON structure to find user info
	// Universal data format: __DEFAULT_SCOPE__ -> webapp.user-detail -> userInfo
	if defaultScope, ok := data["__DEFAULT_SCOPE__"].(map[string]interface{}); ok {
		if userDetail, ok := defaultScope["webapp.user-detail"].(map[string]interface{}); ok {
			if userInfo, ok := userDetail["userInfo"].(map[string]interface{}); ok {
				return extractTikTokUser(userInfo, handle)
			}
		}
	}

	// SIGI_STATE format: UserModule -> users -> uniqueId
	if userModule, ok := data["UserModule"].(map[string]interface{}); ok {
		if users, ok := userModule["users"].(map[string]interface{}); ok {
			if userData, ok := users[handle].(map[string]interface{}); ok {
				return extractTikTokUser(userData, handle)
			}
		}
	}

	return &ScrapeResult{Success: false, Error: "could not find user data in TikTok response"}
}

func extractTikTokUser(userInfo map[string]interface{}, handle string) *ScrapeResult {
	result := &ScrapeResult{Success: true, DisplayName: handle}

	if user, ok := userInfo["user"].(map[string]interface{}); ok {
		if avatar, ok := user["avatarLarger"].(string); ok {
			result.ProfilePictureURL = avatar
		} else if avatar, ok := user["avatarMedium"].(string); ok {
			result.ProfilePictureURL = avatar
		}
		if nickname, ok := user["nickname"].(string); ok && nickname != "" {
			result.DisplayName = nickname
		}
	}

	if stats, ok := userInfo["stats"].(map[string]interface{}); ok {
		if followerCount, ok := stats["followerCount"].(float64); ok {
			result.FollowerCount = int64(followerCount)
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
		"X-IG-App-ID": "936619743392459",
		"X-Requested-With": "XMLHttpRequest",
		"Referer":          fmt.Sprintf("https://www.instagram.com/%s/", handle),
	})
	if err != nil {
		return &ScrapeResult{Success: false, Error: err.Error()}
	}
	if status == 401 || status == 403 {
		return &ScrapeResult{Success: false, Error: "Instagram blocked the request (login required or rate limited)"}
	}
	if status != 200 {
		return &ScrapeResult{Success: false, Error: fmt.Sprintf("HTTP %d", status)}
	}

	var resp struct {
		Data struct {
			User struct {
				Full_name  string `json:"full_name"`
				Profile_pic_url_hd string `json:"profile_pic_url_hd"`
				Profile_pic_url    string `json:"profile_pic_url"`
				Edge_followed_by struct {
					Count int64 `json:"count"`
				} `json:"edge_followed_by"`
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
		DisplayName:       name,
		Success:           true,
	}
}

// --- Twitter/X ---

func scrapeTwitter(handle string) *ScrapeResult {
	// Try nitter instances first
	nitterInstances := []string{
		"https://nitter.privacydev.net",
		"https://nitter.poast.org",
		"https://nitter.woodland.cafe",
	}

	for _, instance := range nitterInstances {
		result := scrapeTwitterFromNitter(instance, handle)
		if result.Success {
			return result
		}
	}

	// Fallback: try syndication endpoint
	result := scrapeTwitterSyndication(handle)
	if result.Success {
		return result
	}

	return &ScrapeResult{
		Success: false,
		Error:   "could not fetch Twitter/X data (all methods failed)",
	}
}

func scrapeTwitterFromNitter(instance, handle string) *ScrapeResult {
	url := fmt.Sprintf("%s/%s", instance, handle)
	body, status, err := doHTTPGet(url, nil)
	if err != nil || status != 200 {
		return &ScrapeResult{Success: false}
	}

	html := string(body)

	// Extract profile picture
	picURL := ""
	re := regexp.MustCompile(`class="avatar-large"[^>]*src="([^"]+)"`)
	if m := re.FindStringSubmatch(html); len(m) > 1 {
		picURL = m[1]
		if !strings.HasPrefix(picURL, "http") {
			picURL = instance + picURL
		}
	}

	// Extract follower count
	var followers int64
	re = regexp.MustCompile(`class="profile-stat[^"]*"[^>]*>\s*<[^>]*>(\d[\d,]*\.?\d*[KMBkmb]?)\s*<[^>]*>\s*Followers`)
	if m := re.FindStringSubmatch(html); len(m) > 1 {
		followers = parseFollowerCount(m[1])
	}

	// Alternative follower pattern
	if followers == 0 {
		re = regexp.MustCompile(`(\d[\d,]*\.?\d*[KMBkmb]?)\s*Followers`)
		if m := re.FindStringSubmatch(html); len(m) > 1 {
			followers = parseFollowerCount(m[1])
		}
	}

	// Extract display name
	name := handle
	re = regexp.MustCompile(`class="profile-card-fullname"[^>]*>([^<]+)`)
	if m := re.FindStringSubmatch(html); len(m) > 1 {
		name = strings.TrimSpace(m[1])
	}

	if picURL == "" {
		return &ScrapeResult{Success: false}
	}

	return &ScrapeResult{
		ProfilePictureURL: picURL,
		FollowerCount:     followers,
		DisplayName:       name,
		Success:           true,
	}
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

	// Extract profile picture from meta or img tags
	picURL := ""
	re := regexp.MustCompile(`src="(https?://pbs\.twimg\.com/profile_images/[^"]+)"`)
	if m := re.FindStringSubmatch(html); len(m) > 1 {
		picURL = m[1]
	}

	// Extract follower count
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

	if picURL == "" {
		return &ScrapeResult{Success: false}
	}

	return &ScrapeResult{
		ProfilePictureURL: picURL,
		FollowerCount:     followers,
		DisplayName:       name,
		Success:           true,
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

	// Facebook follower count is harder to extract from HTML
	var followers int64
	re := regexp.MustCompile(`"follower_count":\s*(\d+)`)
	if m := re.FindStringSubmatch(html); len(m) > 1 {
		followers, _ = strconv.ParseInt(m[1], 10, 64)
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

	// Try to extract follower count from page content
	var followers int64
	re := regexp.MustCompile(`"follower_count":\s*(\d+)`)
	if m := re.FindStringSubmatch(html); len(m) > 1 {
		followers, _ = strconv.ParseInt(m[1], 10, 64)
	}

	// Alternative: "X followers" text
	if followers == 0 {
		re = regexp.MustCompile(`(\d[\d,]*\.?\d*[KMBkmb]?)\s*followers`)
		if m := re.FindStringSubmatch(html); len(m) > 1 {
			followers = parseFollowerCount(m[1])
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
	re := regexp.MustCompile(fmt.Sprintf(`<meta[^>]+property="%s"[^>]+content="([^"]*)"`, property))
	if m := re.FindStringSubmatch(html); len(m) > 1 {
		return m[1]
	}
	re = regexp.MustCompile(fmt.Sprintf(`<meta[^>]+content="([^"]*)"[^>]+property="%s"`, property))
	if m := re.FindStringSubmatch(html); len(m) > 1 {
		return m[1]
	}
	// Also try name attribute
	re = regexp.MustCompile(fmt.Sprintf(`<meta[^>]+name="%s"[^>]+content="([^"]*)"`, property))
	if m := re.FindStringSubmatch(html); len(m) > 1 {
		return m[1]
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
