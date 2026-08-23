package repository

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"creatorhub/backend/internal/models"
)

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*models.User, string, error) {
	var u models.User
	var hash string
	var createdAt time.Time
	err := r.db.QueryRow(ctx,
		`SELECT id, email, name, role, COALESCE(province,''), password_hash, created_at FROM users WHERE email = $1`,
		email,
	).Scan(&u.ID, &u.Email, &u.Name, &u.Role, &u.Province, &hash, &createdAt)
	if err != nil {
		return nil, "", err
	}
	u.CreatedAt = createdAt.Format(time.RFC3339)
	return &u, hash, nil
}

func (r *UserRepository) Exists(ctx context.Context) (bool, error) {
	var count int
	err := r.db.QueryRow(ctx, `SELECT COUNT(*) FROM users`).Scan(&count)
	return count > 0, err
}

func (r *UserRepository) Create(ctx context.Context, email, name, role, hash string) error {
	_, err := r.db.Exec(ctx,
		`INSERT INTO users (email, name, role, password_hash) VALUES ($1, $2, $3, $4)`,
		email, name, role, hash,
	)
	return err
}
