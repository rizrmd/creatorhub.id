package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5"

	"creatorhub/backend/internal/models"
	"creatorhub/backend/internal/repository"
)

var validStatuses = map[string]bool{
	"draft": true, "active": true, "completed": true, "paused": true, "in-review": true, "archived": true,
}

type CampaignHandler struct {
	repo *repository.CampaignRepository
}

func NewCampaignHandler(repo *repository.CampaignRepository) *CampaignHandler {
	return &CampaignHandler{repo: repo}
}

func (h *CampaignHandler) List(w http.ResponseWriter, r *http.Request) {
	campaigns, err := h.repo.List(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, campaigns)
}

func (h *CampaignHandler) Create(w http.ResponseWriter, r *http.Request) {
	limitBody(w, r)
	var req models.CreateCampaignRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	campaign, err := h.repo.Create(r.Context(), req)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusCreated, campaign)
}

func (h *CampaignHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	campaign, err := h.repo.GetByID(r.Context(), id)
	if err != nil {
		writeError(w, http.StatusNotFound, "campaign not found")
		return
	}
	writeJSON(w, http.StatusOK, campaign)
}

func (h *CampaignHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	limitBody(w, r)
	var req models.UpdateCampaignRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.Status != "" && !validStatuses[req.Status] {
		writeError(w, http.StatusBadRequest, "invalid status value")
		return
	}
	campaign, err := h.repo.Update(r.Context(), id, req)
	if err != nil {
		if err == pgx.ErrNoRows {
			writeError(w, http.StatusNotFound, "campaign not found")
			return
		}
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, campaign)
}

func (h *CampaignHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	rowsAffected, err := h.repo.Delete(r.Context(), id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	if rowsAffected == 0 {
		writeError(w, http.StatusNotFound, "campaign not found")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *CampaignHandler) AddCreator(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	limitBody(w, r)
	var req models.AddCreatorToCampaignRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if err := h.repo.AddCreator(r.Context(), id, req.CreatorID); err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *CampaignHandler) RemoveCreator(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	creatorID := chi.URLParam(r, "creatorId")
	rowsAffected, err := h.repo.RemoveCreator(r.Context(), id, creatorID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	if rowsAffected == 0 {
		writeError(w, http.StatusNotFound, "creator not found in campaign")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
