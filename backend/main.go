package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"

	"creatorhub/backend/internal/config"
	"creatorhub/backend/internal/database"
	"creatorhub/backend/internal/handlers"
	authmw "creatorhub/backend/internal/middleware"
	"creatorhub/backend/internal/repository"
	"creatorhub/backend/migrations"
)

func main() {
	log.SetOutput(os.Stdout)
	_ = godotenv.Load()

	cfg := config.Load()

	if err := migrations.Run(cfg.DatabaseURL, "up"); err != nil {
		log.Fatalf("migration failed: %v", err)
	}

	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()

	creatorRepo := repository.NewCreatorRepository(db)
	campaignRepo := repository.NewCampaignRepository(db)
	messageRepo := repository.NewMessageRepository(db)
	userRepo := repository.NewUserRepository(db)
	mediaNetworkRepo := repository.NewMediaNetworkRepository(db)

	if err := ensureAdminUser(context.Background(), userRepo); err != nil {
		log.Printf("warning: could not ensure admin user: %v", err)
	}

	creatorHandler := handlers.NewCreatorHandler(creatorRepo)
	campaignHandler := handlers.NewCampaignHandler(campaignRepo)
	messageHandler := handlers.NewMessageHandler(messageRepo)
	authHandler := handlers.NewAuthHandler(userRepo)
	mediaNetworkHandler := handlers.NewMediaNetworkHandler(mediaNetworkRepo)

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RealIP)

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok"}`))
	})

	r.Route("/api/v1", func(r chi.Router) {
		// Public: auth endpoints
		r.Post("/auth/login", authHandler.Login)

		// Public: marketplace browsing (no auth required)
		r.Route("/creators", func(r chi.Router) {
			r.Get("/", creatorHandler.List)
			r.Get("/stats", creatorHandler.Stats)
			r.Get("/{id}", creatorHandler.GetByID)
		})

		// Protected: all other API routes require a valid JWT
		r.Group(func(r chi.Router) {
			r.Use(authmw.RequireAuth)

			r.Post("/creators/scrape", creatorHandler.ScrapeSocial)
			r.Post("/creators", creatorHandler.Create)
			r.Route("/campaigns", func(r chi.Router) {
				r.Get("/", campaignHandler.List)
				r.Post("/", campaignHandler.Create)
				r.Get("/{id}", campaignHandler.GetByID)
				r.Put("/{id}", campaignHandler.Update)
				r.Delete("/{id}", campaignHandler.Delete)
				r.Post("/{id}/creators", campaignHandler.AddCreator)
				r.Delete("/{id}/creators/{creatorId}", campaignHandler.RemoveCreator)
			})
			r.Route("/messages", func(r chi.Router) {
				r.Get("/channels", messageHandler.ListChannels)
				r.Post("/channels", messageHandler.CreateChannel)
				r.Get("/channels/{channelId}/messages", messageHandler.ListMessages)
				r.Post("/channels/{channelId}/messages", messageHandler.SendMessage)
			})
			r.Route("/media-groups", func(r chi.Router) {
				r.Get("/", mediaNetworkHandler.ListGroups)
				r.Get("/{id}/outlets", mediaNetworkHandler.ListOutlets)
			})
			r.Route("/media-outlets", func(r chi.Router) {
				r.Get("/search", mediaNetworkHandler.SearchOutlets)
				r.Put("/bulk", mediaNetworkHandler.BulkUpdate)
			})
		})
	})

	// SPA: serve frontend/dist, fallback ke index.html untuk client-side routing
	r.Handle("/*", spaHandler(cfg.StaticDir))

	log.Printf("CreatorHub running on http://localhost:%s (static: %s)", cfg.Port, cfg.StaticDir)
	if err := http.ListenAndServe(":"+cfg.Port, r); err != nil {
		log.Fatal(err)
	}
}

// ensureAdminUser creates the default admin account if no users exist.
func ensureAdminUser(ctx context.Context, repo *repository.UserRepository) error {
	exists, err := repo.Exists(ctx)
	if err != nil {
		return err
	}
	if exists {
		return nil
	}
	hash, err := bcrypt.GenerateFromPassword([]byte("Admin123!"), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	if err := repo.Create(ctx, "admin@creatorhub.id", "Administrator", "admin", string(hash)); err != nil {
		return err
	}
	log.Println("Admin user created: admin@creatorhub.id / Admin123!")
	return nil
}

func spaHandler(dir string) http.Handler {
	fs := http.Dir(dir)
	fileServer := http.FileServer(fs)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Missing static assets must 404 — never fall back to index.html.
		// Otherwise browsers/CDN cache HTML with text/html as a .js module script.
		if isStaticAsset(r.URL.Path) {
			serveStaticAsset(w, r, fs, fileServer)
			return
		}

		f, err := fs.Open(r.URL.Path)
		if err != nil {
			w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
			http.ServeFile(w, r, filepath.Join(dir, "index.html"))
			return
		}
		defer f.Close()

		stat, err := f.Stat()
		if err != nil || stat.IsDir() {
			w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
			http.ServeFile(w, r, filepath.Join(dir, "index.html"))
			return
		}

		fileServer.ServeHTTP(w, r)
	})
}

func serveStaticAsset(w http.ResponseWriter, r *http.Request, fs http.FileSystem, fileServer http.Handler) {
	f, err := fs.Open(r.URL.Path)
	if err != nil {
		w.Header().Set("Cache-Control", "no-store")
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	defer f.Close()

	if stat, err := f.Stat(); err != nil || stat.IsDir() {
		w.Header().Set("Cache-Control", "no-store")
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	// Vite emits content-hashed filenames — safe to cache aggressively.
	if strings.HasPrefix(r.URL.Path, "/assets/") {
		w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
	}
	fileServer.ServeHTTP(w, r)
}

func isStaticAsset(path string) bool {
	if strings.HasPrefix(path, "/assets/") {
		return true
	}
	switch strings.ToLower(filepath.Ext(path)) {
	case ".js", ".css", ".map", ".webp", ".png", ".jpg", ".jpeg", ".svg", ".ico", ".woff", ".woff2", ".ttf":
		return true
	}
	return false
}
