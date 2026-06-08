package config

import "os"

type Config struct {
	Port        string
	DatabaseURL string
	StaticDir   string
}

func Load() *Config {
	return &Config{
		Port:        getEnv("PORT", "8080"),
		DatabaseURL: getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/creatorhub?sslmode=disable"),
		StaticDir:   getEnv("STATIC_DIR", "../frontend/dist"),
	}
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
