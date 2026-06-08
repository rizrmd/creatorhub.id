package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"

	"creatorhub/backend/migrations"
)

func main() {
	_ = godotenv.Load()

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://postgres:postgres@localhost:5432/creatorhub?sslmode=disable"
	}

	cmd := "up"
	if len(os.Args) > 1 {
		cmd = os.Args[1]
	}

	fmt.Printf("migrate %s\n", cmd)
	if err := migrations.Run(dsn, cmd); err != nil {
		log.Fatal(err)
	}
}
