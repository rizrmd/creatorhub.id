package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math"
	"net/http"
	"net/url"
	"os"
	"path"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

type AllstarsItem struct {
	Link        string      `json:"link"`
	Name        string      `json:"name"`
	Platform    string      `json:"platform"`
	Gender      string      `json:"gender"`
	City        string      `json:"city"`
	EnRate      interface{} `json:"en_rate"`
	Exposure    interface{} `json:"exposure"`
	Avatar      string      `json:"avatar"`
	AllstarsVIP bool        `json:"allstars_vip"`
}

type AllstarsResponse struct {
	Data       []AllstarsItem `json:"data"`
	Total      int            `json:"total"`
	Pagination string         `json:"paginationHtml"`
}

type AllstarsRegion struct {
	ID   string
	Name string
}

var allstarsRegions = []AllstarsRegion{
	{"11", "Aceh"},
	{"12", "Sumatra Utara"},
	{"13", "Sumatra Barat"},
	{"14", "Riau"},
	{"15", "Jambi"},
	{"16", "Sumatra Selatan"},
	{"17", "Bengkulu"},
	{"18", "Lampung"},
	{"19", "Kepulauan Bangka Belitung"},
	{"21", "Kepulauan Riau"},
	{"31", "DKI Jakarta"},
	{"32", "Jawa Barat"},
	{"33", "Jawa Tengah"},
	{"34", "DI Yogyakarta"},
	{"35", "Jawa Timur"},
	{"36", "Banten"},
	{"51", "Bali"},
	{"52", "Nusa Tenggara Barat"},
	{"53", "Nusa Tenggara Timur"},
	{"61", "Kalimantan Barat"},
	{"62", "Kalimantan Tengah"},
	{"63", "Kalimantan Selatan"},
	{"64", "Kalimantan Timur"},
	{"65", "Kalimantan Utara"},
	{"71", "Sulawesi Utara"},
	{"72", "Sulawesi Tengah"},
	{"73", "Sulawesi Selatan"},
	{"74", "Sulawesi Tenggara"},
	{"75", "Gorontalo"},
	{"76", "Sulawesi Barat"},
	{"81", "Maluku"},
	{"82", "Maluku Utara"},
	{"91", "Papua Barat"},
	{"94", "Papua"},
}

var chromeUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

var httpClient = &http.Client{
	Timeout: 20 * time.Second,
	CheckRedirect: func(req *http.Request, via []*http.Request) error {
		if len(via) >= 5 {
			return fmt.Errorf("too many redirects")
		}
		return nil
	},
}

func main() {
	log.SetOutput(os.Stdout)
	_ = godotenv.Load()

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@localhost:5432/creatorhub?sslmode=disable"
	}

	regions := selectedRegions()

	avatarDir := strings.TrimSpace(os.Getenv("AVATAR_DIR"))
	publicAvatarBase := strings.TrimSpace(os.Getenv("AVATAR_PUBLIC_BASE"))
	if avatarDir != "" {
		os.MkdirAll(avatarDir, 0755)
	}

	maxPages := 50
	if v := os.Getenv("MAX_PAGES"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n >= 0 {
			maxPages = n
		}
	}

	log.Printf("Connecting to database...")
	db, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(context.Background()); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}
	log.Println("Database connected.")

	totalScraped := 0
	totalInserted := 0

	for _, region := range regions {
		log.Printf("Scraping allstars.id influencers for region %s (%s, max pages: %s)...", region.ID, region.Name, maxPagesLabel(maxPages))
		influencers, err := scrapeAllPages(region.ID, maxPages)
		if err != nil {
			log.Fatalf("Failed to scrape region %s: %v", region.ID, err)
		}
		log.Printf("Scraped %d influencers from allstars.id region %s", len(influencers), region.ID)

		if avatarDir != "" {
			log.Printf("Downloading %d profile photos...", len(influencers))
			downloadAllPhotos(influencers, avatarDir)
		} else {
			log.Printf("Skipping local photo downloads; using allstars.id avatar URLs.")
		}

		inserted := 0
		for _, inf := range influencers {
			if inf.Name == "" || inf.Name == "-" {
				continue
			}
			if inf.Link == "" || inf.Platform == "" {
				continue
			}

			_, err := insertCreator(context.Background(), db, inf, publicAvatarBase, region.Name)
			if err != nil {
				log.Printf("Error inserting %s: %v", inf.Name, err)
				continue
			}
			inserted++
		}

		totalScraped += len(influencers)
		totalInserted += inserted
		log.Printf("Region %s done: inserted/updated %d creators", region.ID, inserted)
		time.Sleep(500 * time.Millisecond)
	}

	log.Printf("Done! scraped %d records, inserted/updated %d creators", totalScraped, totalInserted)
}

func scrapeAllPages(regionID string, maxPages int) ([]AllstarsItem, error) {
	var all []AllstarsItem
	page := 1
	seen := map[string]struct{}{}
	limit := maxPages
	if limit == 0 {
		limit = 1000
	}

	for {
		url := fmt.Sprintf("https://www.allstars.id/influencer-feed?page=%d&selectedId=%s&searchType=region", page, regionID)
		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			return nil, fmt.Errorf("creating request: %w", err)
		}
		req.Header.Set("User-Agent", chromeUA)
		req.Header.Set("Accept", "application/json, text/javascript, */*; q=0.01")
		req.Header.Set("X-Requested-With", "XMLHttpRequest")
		req.Header.Set("Referer", "https://www.allstars.id/influencer/region/"+regionID)
		req.Header.Set("Accept-Language", "en-US,en;q=0.9,id;q=0.8")

		body, err := doAllstarsRequest(req, page)
		if err != nil {
			return nil, err
		}

		var result AllstarsResponse
		if err := json.Unmarshal(body, &result); err != nil {
			return nil, fmt.Errorf("parsing page %d: %w", page, err)
		}

		if len(result.Data) == 0 {
			break
		}

		newItems := 0
		for _, item := range result.Data {
			key := allstarsItemKey(item)
			if _, ok := seen[key]; ok {
				continue
			}
			seen[key] = struct{}{}
			all = append(all, item)
			newItems++
		}
		log.Printf("  Page %d: %d items, %d new (total so far: %d)", page, len(result.Data), newItems, len(all))

		if newItems == 0 {
			log.Printf("  Page %d had no new items; stopping region %s", page, regionID)
			break
		}
		if page >= limit {
			log.Printf("  Reached max pages limit (%d)", limit)
			break
		}
		page++

		time.Sleep(300 * time.Millisecond)
	}

	return all, nil
}

func doAllstarsRequest(req *http.Request, page int) ([]byte, error) {
	var lastErr error
	for attempt := 1; attempt <= 5; attempt++ {
		resp, err := httpClient.Do(req.Clone(req.Context()))
		if err != nil {
			lastErr = fmt.Errorf("fetching page %d: %w", page, err)
		} else {
			body, readErr := io.ReadAll(resp.Body)
			resp.Body.Close()
			if readErr != nil {
				lastErr = fmt.Errorf("reading page %d: %w", page, readErr)
			} else if resp.StatusCode == http.StatusOK {
				return body, nil
			} else {
				lastErr = fmt.Errorf("page %d: HTTP %d", page, resp.StatusCode)
				if resp.StatusCode < 500 && resp.StatusCode != http.StatusTooManyRequests {
					return nil, lastErr
				}
			}
		}

		if attempt < 5 {
			delay := time.Duration(attempt*2) * time.Second
			log.Printf("  Page %d attempt %d failed: %v; retrying in %s", page, attempt, lastErr, delay)
			time.Sleep(delay)
		}
	}
	return nil, lastErr
}

func downloadAllPhotos(influencers []AllstarsItem, avatarDir string) {
	var wg sync.WaitGroup
	sem := make(chan struct{}, 10) // 10 concurrent downloads
	downloaded := 0
	var mu sync.Mutex

	for _, inf := range influencers {
		if inf.Avatar == "" || inf.Name == "-" {
			continue
		}

		wg.Add(1)
		go func(item AllstarsItem) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()

			filename := avatarFilename(item)
			filepath := filepath.Join(avatarDir, filename)

			// Skip if already downloaded
			if _, err := os.Stat(filepath); err == nil {
				mu.Lock()
				downloaded++
				mu.Unlock()
				return
			}

			if err := downloadFile(item.Avatar, filepath); err != nil {
				log.Printf("  Failed to download %s: %v", item.Name, err)
				return
			}
			mu.Lock()
			downloaded++
			mu.Unlock()
		}(inf)
	}

	wg.Wait()
	log.Printf("Downloaded %d photos to %s", downloaded, avatarDir)
}

func downloadFile(url, destPath string) error {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return err
	}
	req.Header.Set("User-Agent", chromeUA)
	req.Header.Set("Accept", "image/webp,image/apng,image/*,*/*;q=0.8")
	req.Header.Set("Referer", "https://www.allstars.id/")

	resp, err := httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return fmt.Errorf("HTTP %d", resp.StatusCode)
	}

	out, err := os.Create(destPath)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, resp.Body)
	return err
}

func insertCreator(ctx context.Context, db *pgxpool.Pool, inf AllstarsItem, publicAvatarBase, fallbackCity string) (string, error) {
	handle := resolvedHandle(inf)
	slugID := generateSlug(inf.Name)
	if slugID == "" {
		slugID = generateSlug(handle)
	}

	followers := parseExposure(inf.Exposure)
	followersText := formatFollowers(followers)
	engagementRate := parseEnRate(inf.EnRate)
	category := mapPlatform(inf.Platform)

	city := inf.City
	if city == "" {
		city = fallbackCity
	}
	if city == "" {
		city = "Indonesia"
	}

	imgPath := publicAvatarPath(inf, publicAvatarBase)

	_, err := db.Exec(ctx, `
		INSERT INTO creators (id, name, handle, city, country, category, followers, followers_text, engagement_rate, image_url, img_path, bio, verified)
		VALUES ($1, $2, $3, $4, 'Indonesia', $5, $6, $7, $8, $9, $10, $11, true)
		ON CONFLICT (id) DO UPDATE SET
			name = EXCLUDED.name,
			handle = EXCLUDED.handle,
			city = EXCLUDED.city,
			category = EXCLUDED.category,
			followers = EXCLUDED.followers,
			followers_text = EXCLUDED.followers_text,
			engagement_rate = EXCLUDED.engagement_rate,
			image_url = EXCLUDED.image_url,
			img_path = EXCLUDED.img_path,
			bio = EXCLUDED.bio,
			verified = true,
			updated_at = NOW()`,
		slugID, inf.Name, handle, city, category, followers, followersText, engagementRate,
		inf.Avatar, imgPath,
		fmt.Sprintf("Gender: %s | Source: allstars.id", inf.Gender),
	)
	if err != nil {
		return "", fmt.Errorf("upsert creator %s: %w", inf.Name, err)
	}

	_, err = db.Exec(ctx, `
		INSERT INTO creator_platforms (creator_id, platform, handle, profile_picture_url, platform_followers, followers, engagement_rate)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		ON CONFLICT (creator_id, platform) DO UPDATE SET
			handle = EXCLUDED.handle,
			profile_picture_url = EXCLUDED.profile_picture_url,
			platform_followers = EXCLUDED.platform_followers,
			followers = EXCLUDED.followers,
			engagement_rate = EXCLUDED.engagement_rate`,
		slugID, inf.Platform, handle, inf.Avatar, followers, followers, engagementRate,
	)
	if err != nil {
		return "", fmt.Errorf("upsert platform for %s: %w", inf.Name, err)
	}

	return "ok", nil
}

func resolvedHandle(inf AllstarsItem) string {
	handle := extractHandle(inf.Link)
	if handle != "" {
		return handle
	}
	if detailID := extractAllstarsDetailID(inf.Link); detailID != "" {
		return detailID
	}
	return inf.Name
}

func extractHandle(link string) string {
	parsed, err := url.Parse(link)
	rawPath := link
	if err == nil {
		rawPath = parsed.Path
	}
	parts := strings.Split(strings.Trim(rawPath, "/"), "/")
	for i, part := range parts {
		if part == "detail" {
			if len(parts) > i+3 {
				handle, _ := url.PathUnescape(parts[i+3])
				return strings.TrimSpace(strings.TrimPrefix(handle, "@"))
			}
			return ""
		}
	}
	if len(parts) > 0 {
		handle, _ := url.PathUnescape(parts[len(parts)-1])
		return strings.TrimSpace(strings.TrimPrefix(handle, "@"))
	}
	return ""
}

func allstarsItemKey(item AllstarsItem) string {
	if id := extractAllstarsDetailID(item.Link); id != "" {
		return id
	}
	return strings.ToLower(item.Platform + "|" + item.Link + "|" + item.Name)
}

func extractAllstarsDetailID(link string) string {
	parsed, err := url.Parse(link)
	rawPath := link
	if err == nil {
		rawPath = parsed.Path
	}
	parts := strings.Split(strings.Trim(rawPath, "/"), "/")
	for i, part := range parts {
		if part == "detail" && len(parts) > i+1 {
			return parts[i+1]
		}
	}
	return ""
}

func selectedRegions() []AllstarsRegion {
	if raw := strings.TrimSpace(os.Getenv("REGION_IDS")); raw != "" {
		var regions []AllstarsRegion
		for _, id := range strings.Split(raw, ",") {
			id = strings.TrimSpace(id)
			if id == "" {
				continue
			}
			regions = append(regions, AllstarsRegion{ID: id, Name: regionName(id)})
		}
		if len(regions) > 0 {
			return regions
		}
	}
	if truthy(os.Getenv("ALL_REGIONS")) {
		return allstarsRegions
	}
	regionID := strings.TrimSpace(os.Getenv("REGION_ID"))
	if regionID == "" {
		regionID = "31"
	}
	return []AllstarsRegion{{ID: regionID, Name: regionName(regionID)}}
}

func regionName(id string) string {
	for _, region := range allstarsRegions {
		if region.ID == id {
			return region.Name
		}
	}
	return ""
}

func truthy(v string) bool {
	switch strings.ToLower(strings.TrimSpace(v)) {
	case "1", "true", "yes", "y", "all":
		return true
	default:
		return false
	}
}

func maxPagesLabel(maxPages int) string {
	if maxPages == 0 {
		return "until empty"
	}
	return strconv.Itoa(maxPages)
}

func avatarFilename(item AllstarsItem) string {
	slug := generateSlug(item.Name)
	if slug == "" {
		slug = generateSlug(extractHandle(item.Link))
	}
	if slug == "" {
		slug = "creator"
	}
	platform := strings.ToLower(strings.TrimSpace(item.Platform))
	if platform == "" {
		platform = "allstars"
	}
	return fmt.Sprintf("%s_%s%s", slug, platform, avatarExtension(item.Avatar))
}

func avatarExtension(rawURL string) string {
	parsed, err := url.Parse(rawURL)
	if err == nil {
		switch ext := strings.ToLower(path.Ext(parsed.Path)); ext {
		case ".jpg", ".jpeg", ".png", ".webp":
			return ext
		}
	}
	return ".jpg"
}

func publicAvatarPath(item AllstarsItem, publicAvatarBase string) string {
	if publicAvatarBase == "" {
		return ""
	}
	return strings.TrimRight(publicAvatarBase, "/") + "/" + avatarFilename(item)
}

func generateSlug(name string) string {
	s := strings.ToLower(strings.TrimSpace(name))
	s = strings.ReplaceAll(s, " ", "-")
	s = strings.ReplaceAll(s, ".", "-")
	s = strings.ReplaceAll(s, "_", "-")
	var b strings.Builder
	for _, r := range s {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == '-' {
			b.WriteRune(r)
		}
	}
	result := b.String()
	for strings.Contains(result, "--") {
		result = strings.ReplaceAll(result, "--", "-")
	}
	result = strings.Trim(result, "-")
	return result
}

func parseExposure(v interface{}) int64 {
	switch val := v.(type) {
	case float64:
		return int64(val)
	case string:
		return parseFollowerString(val)
	default:
		return 0
	}
}

func parseFollowerString(s string) int64 {
	s = strings.TrimSpace(strings.ToLower(s))
	if s == "" {
		return 0
	}

	multiplier := int64(1)
	if strings.HasSuffix(s, "b") {
		multiplier = 1000000000
		s = strings.TrimSuffix(s, "b")
	} else if strings.HasSuffix(s, "m") {
		multiplier = 1000000
		s = strings.TrimSuffix(s, "m")
	} else if strings.HasSuffix(s, "k") {
		multiplier = 1000
		s = strings.TrimSuffix(s, "k")
	}

	s = strings.ReplaceAll(s, ",", "")
	s = strings.TrimSpace(s)

	f, err := strconv.ParseFloat(s, 64)
	if err != nil {
		return 0
	}
	return int64(math.Round(f * float64(multiplier)))
}

func parseEnRate(v interface{}) float64 {
	switch val := v.(type) {
	case float64:
		return val
	case string:
		f, err := strconv.ParseFloat(val, 64)
		if err != nil {
			return 0
		}
		return f
	default:
		return 0
	}
}

func mapPlatform(platform string) string {
	switch strings.ToLower(platform) {
	case "instagram":
		return "lifestyle, beauty, fashion"
	case "tiktok":
		return "entertainment, comedy, lifestyle"
	case "youtube":
		return "entertainment, education, lifestyle"
	case "twitter", "x":
		return "technology, lifestyle, entertainment"
	default:
		return "lifestyle, entertainment"
	}
}

func formatFollowers(n int64) string {
	if n >= 1000000000 {
		return fmt.Sprintf("%.1fB", float64(n)/1000000000)
	}
	if n >= 1000000 {
		return fmt.Sprintf("%.1fM", float64(n)/1000000)
	}
	if n >= 1000 {
		return fmt.Sprintf("%.1fK", float64(n)/1000)
	}
	return fmt.Sprintf("%d", n)
}
