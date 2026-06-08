package migrations

import (
	"database/sql"
	"embed"
	"fmt"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
)

//go:embed *.sql
var embedMigrations embed.FS

// Run jalankan perintah migrasi: up, down, status, reset, version.
func Run(dsn, command string) error {
	db, err := sql.Open("pgx", dsn)
	if err != nil {
		return fmt.Errorf("open db: %w", err)
	}
	defer db.Close()

	goose.SetBaseFS(embedMigrations)

	if err := goose.SetDialect("postgres"); err != nil {
		return fmt.Errorf("set dialect: %w", err)
	}

	switch command {
	case "up":
		return goose.Up(db, ".")
	case "down":
		return goose.Down(db, ".")
	case "status":
		return goose.Status(db, ".")
	case "reset":
		return goose.Reset(db, ".")
	case "version":
		return goose.Version(db, ".")
	default:
		return fmt.Errorf("unknown command %q — valid: up, down, status, reset, version", command)
	}
}
