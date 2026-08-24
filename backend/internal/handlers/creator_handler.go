package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"

	"creatorhub/backend/internal/models"
	"creatorhub/backend/internal/repository"
	"creatorhub/backend/internal/services"
)

type CreatorHandler struct {
	repo *repository.CreatorRepository
}

func NewCreatorHandler(repo *repository.CreatorRepository) *CreatorHandler {
	return &CreatorHandler{repo: repo}
}

func (h *CreatorHandler) List(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	params := models.CreatorListParams{
		Category: q.Get("category"),
		City:     q.Get("city"),
		Platform: q.Get("platform"),
		Search:   q.Get("search"),
		SortBy:   q.Get("sortBy"),
		SortDir:  q.Get("sortDir"),
	}
	if v := q.Get("page"); v != "" {
		p, err := strconv.Atoi(v)
		if err != nil || p < 1 {
			writeError(w, http.StatusBadRequest, "invalid page parameter")
			return
		}
		params.Page = p
	}
	if v := q.Get("pageSize"); v != "" {
		ps, err := strconv.Atoi(v)
		if err != nil || ps < 1 {
			writeError(w, http.StatusBadRequest, "invalid pageSize parameter")
			return
		}
		params.PageSize = ps
	}
	if v := q.Get("minFollowers"); v != "" {
		params.MinFollowers, _ = strconv.ParseInt(v, 10, 64)
	}
	if v := q.Get("maxFollowers"); v != "" {
		params.MaxFollowers, _ = strconv.ParseInt(v, 10, 64)
	}
	if v := q.Get("minRating"); v != "" {
		params.MinRating, _ = strconv.ParseFloat(v, 64)
	}
	if v := q.Get("minEngagement"); v != "" {
		params.MinEngagement, _ = strconv.ParseFloat(v, 64)
	}
	if v := q.Get("maxEngagement"); v != "" {
		params.MaxEngagement, _ = strconv.ParseFloat(v, 64)
	}
	if v := q.Get("minPrice"); v != "" {
		params.MinPrice, _ = strconv.ParseInt(v, 10, 64)
	}
	if v := q.Get("maxPrice"); v != "" {
		params.MaxPrice, _ = strconv.ParseInt(v, 10, 64)
	}
	if v := q.Get("verified"); v != "" {
		b := v == "true"
		params.Verified = &b
	}
	if v := q.Get("fastResponse"); v != "" {
		b := v == "true"
		params.FastResponse = &b
	}
	if v := q.Get("topRated"); v != "" {
		b := v == "true"
		params.TopRated = &b
	}

	result, err := h.repo.List(r.Context(), params)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, result)
}

func (h *CreatorHandler) Stats(w http.ResponseWriter, r *http.Request) {
	stats, err := h.repo.Stats(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, stats)
}

func (h *CreatorHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	creator, err := h.repo.GetByID(r.Context(), id)
	if err != nil {
		writeError(w, http.StatusNotFound, "creator not found")
		return
	}
	writeJSON(w, http.StatusOK, creator)
}

func (h *CreatorHandler) ScrapeSocial(w http.ResponseWriter, r *http.Request) {
	limitBody(w, r)
	var req models.ScrapeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.Platform == "" || req.Handle == "" {
		writeError(w, http.StatusBadRequest, "platform and handle are required")
		return
	}

	result := services.ScrapeSocial(req.Platform, req.Handle)
	result = h.cacheScrapedPhoto(req.Handle, result)
	writeJSON(w, http.StatusOK, result)
}

// cacheScrapedPhoto downloads the scraped profile photo once and returns a
// permanent local URL. Instagram/TikTok CDN URLs are signed and expire (they
// load once in the browser, then 403 — "keliatan habis hilang"). With a local
// copy, the preview and the stored creator always show the photo.
func (h *CreatorHandler) cacheScrapedPhoto(handle string, result *services.ScrapeResult) *services.ScrapeResult {
	if result == nil || result.ProfilePictureURL == "" {
		return result
	}
	url := result.ProfilePictureURL
	if strings.HasPrefix(url, "/") {
		return result
	}

	staticDir := os.Getenv("STATIC_DIR")
	if staticDir == "" {
		staticDir = "/app/static"
	}
	creatorsDir := filepath.Join(staticDir, "creators")
	if err := os.MkdirAll(creatorsDir, 0755); err != nil {
		return result
	}

	// Sanitize handle -> stable filename (reuse existing cache if present)
	name := strings.Map(func(r rune) rune {
		if (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') || r == '.' || r == '-' || r == '_' {
			return r
		}
		return -1
	}, strings.TrimSpace(handle))
	if name == "" {
		return result
	}

	filename := name + ".jpg"
	destPath := filepath.Join(creatorsDir, filename)

	if _, err := os.Stat(destPath); err == nil {
		result.ProfilePictureURL = "/creators/" + filename
		return result
	}

	client := &http.Client{Timeout: 20 * time.Second}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return result
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")

	resp, err := client.Do(req)
	if err != nil || resp.StatusCode != 200 {
		fmt.Printf("scrape photo download failed for %s: %v\n", handle, err)
		return result
	}
	defer resp.Body.Close()

	f, err := os.Create(destPath)
	if err != nil {
		fmt.Printf("scrape photo create failed for %s: %v\n", handle, err)
		return result
	}
	defer f.Close()

	if _, err := io.Copy(f, resp.Body); err != nil {
		fmt.Printf("scrape photo copy failed for %s: %v\n", handle, err)
		return result
	}

	// Small extra safety: verify the downloaded bytes look like an image
	head := make([]byte, 3)
	if _, err := f.Seek(0, io.SeekStart); err == nil {
		if _, rerr := f.Read(head); rerr == nil {
			if head[0] != 0xFF || head[1] != 0xD8 {
				os.Remove(destPath)
				fmt.Printf("scrape photo not a jpeg for %s\n", handle)
				return result
			}
		}
	}

	result.ProfilePictureURL = "/creators/" + filename
	fmt.Printf("scrape photo cached for %s -> /creators/%s\n", handle, filename)
	return result
}

func (h *CreatorHandler) Create(w http.ResponseWriter, r *http.Request) {
	limitBody(w, r)
	var req models.CreateCreatorRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.Name == "" {
		writeError(w, http.StatusBadRequest, "name is required")
		return
	}

	creator, err := h.repo.Create(r.Context(), req)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// Add platforms
	for _, p := range req.Platforms {
		if p.Handle != "" {
			if err := h.repo.AddPlatform(r.Context(), creator.ID, p); err != nil {
				writeError(w, http.StatusInternalServerError, "failed to add platform: "+err.Error())
				return
			}
		}
	}

	// Download and cache profile photo locally, then point DB to the local file
	if req.ImageURL != "" && len(req.ImageURL) > 10 {
		go h.downloadAndCachePhoto(context.Background(), creator.ID, req.ImageURL)
	}

	writeJSON(w, http.StatusCreated, creator)
}

func (h *CreatorHandler) downloadAndCachePhoto(ctx context.Context, id, imageURL string) {
	staticDir := os.Getenv("STATIC_DIR")
	if staticDir == "" {
		staticDir = "/app/static"
	}
	creatorsDir := filepath.Join(staticDir, "creators")
	os.MkdirAll(creatorsDir, 0755)

	filename := id + ".jpg"
	destPath := filepath.Join(creatorsDir, filename)

	if _, err := os.Stat(destPath); err == nil {
		return
	}

	// Already a local path (fast-path from scrape) — just point DB at it.
	if strings.HasPrefix(imageURL, "/creators/") {
		localURL := imageURL
		if !strings.HasSuffix(localURL, ".jpg") {
			localURL = "/creators/" + filename
		}
		fmt.Printf("photo already cached for %s -> %s\n", id, localURL)
		if err := h.repo.UpdateImage(ctx, id, localURL); err != nil {
			fmt.Printf("failed to persist local image for %s: %v\n", id, err)
		}
		return
	}

	resp, err := http.Get(imageURL)
	if err != nil || resp.StatusCode != 200 {
		fmt.Printf("download photo failed for %s: %v\n", id, err)
		return
	}
	defer resp.Body.Close()

	f, err := os.Create(destPath)
	if err != nil {
		fmt.Printf("create file failed for %s: %v\n", id, err)
		return
	}
	defer f.Close()

	io.Copy(f, resp.Body)

	localURL := "/creators/" + filename
	fmt.Printf("downloaded photo for %s -> %s\n", id, localURL)

	// IMPORTANT: persist local path to DB so the frontend never serves an
	// expired/403 CDN URL (e.g. Instagram) for this creator.
	if err := h.repo.UpdateImage(ctx, id, localURL); err != nil {
		fmt.Printf("failed to persist local image for %s: %v\n", id, err)
	}
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}

func limitBody(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 1<<20) // 1 MB
}
