package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"

	"creatorhub/backend/internal/models"
	"creatorhub/backend/internal/repository"
)

type MessageHandler struct {
	repo *repository.MessageRepository
}

func NewMessageHandler(repo *repository.MessageRepository) *MessageHandler {
	return &MessageHandler{repo: repo}
}

func (h *MessageHandler) ListChannels(w http.ResponseWriter, r *http.Request) {
	channels, err := h.repo.ListChannels(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, channels)
}

func (h *MessageHandler) CreateChannel(w http.ResponseWriter, r *http.Request) {
	var body struct {
		CreatorID string `json:"creatorId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	ch, err := h.repo.CreateChannel(r.Context(), body.CreatorID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusCreated, ch)
}

func (h *MessageHandler) ListMessages(w http.ResponseWriter, r *http.Request) {
	channelID := chi.URLParam(r, "channelId")
	msgs, err := h.repo.ListMessages(r.Context(), channelID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, msgs)
}

func (h *MessageHandler) SendMessage(w http.ResponseWriter, r *http.Request) {
	channelID := chi.URLParam(r, "channelId")
	var req models.SendMessageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	msg, err := h.repo.SendMessage(r.Context(), channelID, "user-1", "user", req.Content)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusCreated, msg)
}
