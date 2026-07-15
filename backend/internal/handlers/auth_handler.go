package handlers

import (
	"encoding/json"
	"net/http"
	"sync"
	"time"

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

type loginAttempt struct {
	count    int
	lastSeen time.Time
}

var (
	loginRateMu    sync.Mutex
	loginRateLimit = make(map[string]*loginAttempt)
)

func isLoginRateLimited(ip string) bool {
	loginRateMu.Lock()
	defer loginRateMu.Unlock()

	a, exists := loginRateLimit[ip]
	if !exists {
		loginRateLimit[ip] = &loginAttempt{count: 1, lastSeen: time.Now()}
		return false
	}

	if time.Since(a.lastSeen) > 15*time.Minute {
		a.count = 1
		a.lastSeen = time.Now()
		return false
	}

	a.count++
	a.lastSeen = time.Now()
	return a.count > 20
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	ip := r.RemoteAddr
	if fwd := r.Header.Get("X-Forwarded-For"); fwd != "" {
		ip = fwd
	}

	if isLoginRateLimited(ip) {
		writeError(w, http.StatusTooManyRequests, "too many login attempts, try again later")
		return
	}

	limitBody(w, r)
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
