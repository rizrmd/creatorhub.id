package handlers

import (
	"encoding/json"
	"net/http"

	"golang.org/x/crypto/bcrypt"

	"creatorhub/backend/internal/auth"
	"creatorhub/backend/internal/models"
	"creatorhub/backend/internal/repository"
)

type AuthHandler struct {
	repo *repository.UserRepository
}

func NewAuthHandler(repo *repository.UserRepository) *AuthHandler {
	return &AuthHandler{repo: repo}
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "request tidak valid")
		return
	}
	if req.Email == "" || req.Password == "" {
		writeError(w, http.StatusBadRequest, "email dan password wajib diisi")
		return
	}

	user, hash, err := h.repo.GetByEmail(r.Context(), req.Email)
	if err != nil {
		writeError(w, http.StatusUnauthorized, "Email atau password salah")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.Password)); err != nil {
		writeError(w, http.StatusUnauthorized, "Email atau password salah")
		return
	}

	token, err := auth.CreateToken(user)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "gagal membuat token")
		return
	}

	writeJSON(w, http.StatusOK, models.LoginResponse{Token: token, User: *user})
}
