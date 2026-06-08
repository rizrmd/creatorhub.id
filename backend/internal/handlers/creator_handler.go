package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"

	"creatorhub/backend/internal/models"
	"creatorhub/backend/internal/repository"
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
		params.Page, _ = strconv.Atoi(v)
	}
	if v := q.Get("pageSize"); v != "" {
		params.PageSize, _ = strconv.Atoi(v)
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

func (h *CreatorHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	creator, err := h.repo.GetByID(r.Context(), id)
	if err != nil {
		writeError(w, http.StatusNotFound, "creator not found")
		return
	}
	writeJSON(w, http.StatusOK, creator)
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}
