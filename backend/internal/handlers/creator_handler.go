package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

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
	writeJSON(w, http.StatusOK, result)
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

	// Download and cache profile photo locally
	if req.ImageURL != "" && len(req.ImageURL) > 10 {
		go downloadAndCachePhoto(creator.ID, req.ImageURL)
	}

	writeJSON(w, http.StatusCreated, creator)
}

func downloadAndCachePhoto(id, imageURL string) {
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
