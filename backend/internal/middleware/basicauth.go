package middleware

import (
	"crypto/sha256"
	"crypto/subtle"
	"net/http"
)

const robotsTxt = "User-agent: *\nDisallow: /\n"

// NoIndex sends X-Robots-Tag so crawlers do not index the site.
func NoIndex(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Robots-Tag", "noindex, nofollow, noarchive")
		next.ServeHTTP(w, r)
	})
}

// BasicAuth requires HTTP basic auth when user and pass are both non-empty.
// /health and /robots.txt stay public so probes and crawlers can read them.
func BasicAuth(user, pass string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		if user == "" || pass == "" {
			return next
		}
		userHash := sha256.Sum256([]byte(user))
		passHash := sha256.Sum256([]byte(pass))
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			path := r.URL.Path
			if path == "/health" {
				next.ServeHTTP(w, r)
				return
			}
			if path == "/robots.txt" {
				w.Header().Set("Content-Type", "text/plain; charset=utf-8")
				w.Header().Set("Cache-Control", "no-store")
				w.WriteHeader(http.StatusOK)
				_, _ = w.Write([]byte(robotsTxt))
				return
			}

			gotUser, gotPass, ok := r.BasicAuth()
			gotUserHash := sha256.Sum256([]byte(gotUser))
			gotPassHash := sha256.Sum256([]byte(gotPass))
			userOK := subtle.ConstantTimeCompare(userHash[:], gotUserHash[:]) == 1
			passOK := subtle.ConstantTimeCompare(passHash[:], gotPassHash[:]) == 1
			if !ok || !userOK || !passOK {
				w.Header().Set("WWW-Authenticate", `Basic realm="CreatorHub sandbox"`)
				w.Header().Set("X-Robots-Tag", "noindex, nofollow, noarchive")
				http.Error(w, "unauthorized", http.StatusUnauthorized)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
