package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"

	"creatorhub/backend/internal/config"
	"creatorhub/backend/internal/database"
	"creatorhub/backend/internal/handlers"
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

	creatorHandler := handlers.NewCreatorHandler(creatorRepo)
	campaignHandler := handlers.NewCampaignHandler(campaignRepo)
	messageHandler := handlers.NewMessageHandler(messageRepo)

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RealIP)

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok"}`))
	})

	r.Route("/api/v1", func(r chi.Router) {
		r.Route("/creators", func(r chi.Router) {
			r.Get("/", creatorHandler.List)
			r.Get("/stats", creatorHandler.Stats)
			r.Get("/{id}", creatorHandler.GetByID)
		})
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
	})

	// SPA: serve frontend/dist, fallback ke index.html untuk client-side routing
	r.Handle("/*", spaHandler(cfg.StaticDir))

	log.Printf("CreatorHub running on http://localhost:%s (static: %s)", cfg.Port, cfg.StaticDir)
	if err := http.ListenAndServe(":"+cfg.Port, r); err != nil {
		log.Fatal(err)
	}
}

// spaHandler serves static files dari dir, semua path yang tidak ditemukan
// dikembalikan ke index.html agar React Router bisa handle client-side routing.
func spaHandler(dir string) http.Handler {
	fs := http.Dir(dir)
	fileServer := http.FileServer(fs)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		f, err := fs.Open(r.URL.Path)
		if err != nil {
			http.ServeFile(w, r, filepath.Join(dir, "index.html"))
			return
		}
		defer f.Close()

		stat, err := f.Stat()
		if err != nil || stat.IsDir() {
			http.ServeFile(w, r, filepath.Join(dir, "index.html"))
			return
		}

		fileServer.ServeHTTP(w, r)
	})
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
