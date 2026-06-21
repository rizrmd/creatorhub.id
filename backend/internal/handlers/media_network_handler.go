package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"

	"creatorhub/backend/internal/models"
	"creatorhub/backend/internal/repository"
)

type MediaNetworkHandler struct {
	repo *repository.MediaNetworkRepository
}

func NewMediaNetworkHandler(repo *repository.MediaNetworkRepository) *MediaNetworkHandler {
	return &MediaNetworkHandler{repo: repo}
}

func (h *MediaNetworkHandler) ListGroups(w http.ResponseWriter, r *http.Request) {
	groups, err := h.repo.ListGroups(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list groups")
		return
	}
	writeJSON(w, http.StatusOK, groups)
}

func (h *MediaNetworkHandler) ListOutlets(w http.ResponseWriter, r *http.Request) {
	groupID := chi.URLParam(r, "id")
	if groupID == "" {
		writeError(w, http.StatusBadRequest, "group id is required")
		return
	}

	outlets, err := h.repo.ListOutlets(r.Context(), groupID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list outlets")
		return
	}
	writeJSON(w, http.StatusOK, outlets)
}

func (h *MediaNetworkHandler) SearchOutlets(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query().Get("q")
	if q == "" {
		writeError(w, http.StatusBadRequest, "search query is required")
		return
	}

	outlets, err := h.repo.SearchOutlets(r.Context(), q)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to search outlets")
		return
	}
	writeJSON(w, http.StatusOK, outlets)
}

func (h *MediaNetworkHandler) BulkUpdate(w http.ResponseWriter, r *http.Request) {
	var req models.BulkUpdateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	updated, err := h.repo.BulkUpdateOutlets(r.Context(), req.Outlets)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to update outlets")
		return
	}

	writeJSON(w, http.StatusOK, models.BulkUpdateResponse{Updated: updated})
}
