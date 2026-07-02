package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math"
	"net/http"
	"os"
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

	regionID := "31"
	if v := os.Getenv("REGION_ID"); v != "" {
		regionID = v
	}

	avatarDir := "data/avatars"
	if v := os.Getenv("AVATAR_DIR"); v != "" {
		avatarDir = v
	}
	os.MkdirAll(avatarDir, 0755)

	maxPages := 50
	if v := os.Getenv("MAX_PAGES"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 {
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

	log.Printf("Scraping allstars.id influencers for region %s (max %d pages)...", regionID, maxPages)
	influencers, err := scrapeAllPages(regionID, maxPages)
	if err != nil {
		log.Fatalf("Failed to scrape: %v", err)
	}
	log.Printf("Scraped %d influencers from allstars.id", len(influencers))

	// Download all photos concurrently
	log.Printf("Downloading %d profile photos...", len(influencers))
	downloadAllPhotos(influencers, avatarDir)

	// Insert into database
	inserted := 0
	for _, inf := range influencers {
		if inf.Name == "" || inf.Name == "-" {
			continue
		}
		if inf.Link == "" || inf.Platform == "" {
			continue
		}

		_, err := insertCreator(context.Background(), db, inf, avatarDir)
		if err != nil {
			log.Printf("Error inserting %s: %v", inf.Name, err)
			continue
		}
		inserted++
	}

	log.Printf("Done! inserted/updated: %d creators with photos", inserted)
}

func scrapeAllPages(regionID string, maxPages int) ([]AllstarsItem, error) {
	var all []AllstarsItem
	page := 1

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

		resp, err := httpClient.Do(req)
		if err != nil {
			return nil, fmt.Errorf("fetching page %d: %w", page, err)
		}

		body, err := io.ReadAll(resp.Body)
		resp.Body.Close()
		if err != nil {
			return nil, fmt.Errorf("reading page %d: %w", page, err)
		}

		if resp.StatusCode != 200 {
			return nil, fmt.Errorf("page %d: HTTP %d", page, resp.StatusCode)
		}

		var result AllstarsResponse
		if err := json.Unmarshal(body, &result); err != nil {
			return nil, fmt.Errorf("parsing page %d: %w", page, err)
		}

		if len(result.Data) == 0 {
			break
		}

		all = append(all, result.Data...)
		log.Printf("  Page %d: %d items (total so far: %d)", page, len(result.Data), len(all))

		if len(result.Data) < 20 {
			break
		}
		if page >= maxPages {
			log.Printf("  Reached max pages limit (%d)", maxPages)
			break
		}
		page++

		time.Sleep(300 * time.Millisecond)
	}

	return all, nil
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

			slug := generateSlug(item.Name)
			platform := strings.ToLower(item.Platform)
			ext := ".jpg"
			if strings.Contains(item.Avatar, ".png") {
				ext = ".png"
			} else if strings.Contains(item.Avatar, ".webp") {
				ext = ".webp"
			}
			filename := fmt.Sprintf("%s_%s%s", slug, platform, ext)
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

func insertCreator(ctx context.Context, db *pgxpool.Pool, inf AllstarsItem, avatarDir string) (string, error) {
	handle := extractHandle(inf.Link)
	if handle == "" {
		handle = inf.Name
	}

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
		city = "Jakarta"
	}

	// Local avatar path
	ext := ".jpg"
	if strings.Contains(inf.Avatar, ".png") {
		ext = ".png"
	} else if strings.Contains(inf.Avatar, ".webp") {
		ext = ".webp"
	}
	imgPath := filepath.Join(avatarDir, fmt.Sprintf("%s_%s%s", slugID, strings.ToLower(inf.Platform), ext))

		_, err := db.Exec(ctx, `
		INSERT INTO creators (id, name, handle, city, country, category, followers, followers_text, engagement_rate, image_url, img_path, bio, verified)
		VALUES ($1, $2, $3, $4, 'Indonesia', $5, $6, $7, $8, $9, $10, $11, true)
		ON CONFLICT (id) DO UPDATE SET
			name = EXCLUDED.name,
			followers = EXCLUDED.followers,
			followers_text = EXCLUDED.followers_text,
			engagement_rate = EXCLUDED.engagement_rate,
			image_url = EXCLUDED.image_url,
			img_path = EXCLUDED.img_path,
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

func extractHandle(link string) string {
	parts := strings.Split(link, "/")
	if len(parts) >= 7 {
		return parts[6]
	}
	return ""
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
		return "lifestyle"
	case "tiktok":
		return "entertainment"
	case "youtube":
		return "entertainment"
	case "twitter", "x":
		return "tech"
	default:
		return "lifestyle"
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
