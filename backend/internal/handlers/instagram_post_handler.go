package handlers

import (
	"encoding/json"
	"net/http"

	"creatorhub/backend/internal/models"
	"creatorhub/backend/internal/repository"
	"creatorhub/backend/internal/services"
)

type InstagramPostHandler struct {
	repo *repository.InstagramPostRepository
}

func NewInstagramPostHandler(repo *repository.InstagramPostRepository) *InstagramPostHandler {
	return &InstagramPostHandler{repo: repo}
}

func (h *InstagramPostHandler) ScrapeAccount(w http.ResponseWriter, r *http.Request) {
	var req models.InstagramScrapeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.Account == "" {
		writeError(w, http.StatusBadRequest, "account is required")
		return
	}

	result, err := services.CrawlInstagramPosts(req.Account)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	if !result.Success {
		writeError(w, http.StatusBadGateway, result.Error)
		return
	}

	// Save posts to database
	if len(result.Data) > 0 {
		if _, err := h.repo.UpsertPosts(r.Context(), result.Data); err != nil {
			writeError(w, http.StatusInternalServerError, "failed to save posts: "+err.Error())
			return
		}
	}

	writeJSON(w, http.StatusOK, result)
}

func (h *InstagramPostHandler) ListPosts(w http.ResponseWriter, r *http.Request) {
	account := r.URL.Query().Get("account")
	if account == "" {
		writeError(w, http.StatusBadRequest, "account query param is required")
		return
	}

	posts, err := h.repo.ListByAccount(r.Context(), account)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list posts")
		return
	}
	if posts == nil {
		posts = []models.InstagramPost{}
	}
	writeJSON(w, http.StatusOK, posts)
}

func (h *InstagramPostHandler) ClearAccount(w http.ResponseWriter, r *http.Request) {
	account := r.URL.Query().Get("account")
	if account == "" {
		writeError(w, http.StatusBadRequest, "account query param is required")
		return
	}

	if err := h.repo.DeleteByAccount(r.Context(), account); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to clear posts")
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"status": "cleared"})
}
