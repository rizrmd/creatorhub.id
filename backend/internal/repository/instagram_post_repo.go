package repository

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"

	"creatorhub/backend/internal/models"
)

type InstagramPostRepository struct {
	db *pgxpool.Pool
}

func NewInstagramPostRepository(db *pgxpool.Pool) *InstagramPostRepository {
	return &InstagramPostRepository{db: db}
}

func (r *InstagramPostRepository) UpsertPosts(ctx context.Context, posts []models.InstagramPost) (int, error) {
	if len(posts) == 0 {
		return 0, nil
	}

	inserted := 0
	for _, p := range posts {
		tag, err := r.db.Exec(ctx, `
			INSERT INTO instagram_posts (shortcode, account, caption, media_url, views, likes, comments, is_video, posted_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
			ON CONFLICT (shortcode) DO UPDATE SET
				views = EXCLUDED.views,
				likes = EXCLUDED.likes,
				comments = EXCLUDED.comments,
				caption = EXCLUDED.caption,
				media_url = EXCLUDED.media_url,
				scraped_at = NOW()
		`, p.Shortcode, p.Account, p.Caption, p.MediaURL, p.Views, p.Likes, p.Comments, p.IsVideo, p.PostedAt)
		if err != nil {
			return inserted, fmt.Errorf("upsert post %s: %w", p.Shortcode, err)
		}
		if tag.RowsAffected() > 0 {
			inserted++
		}
	}
	return inserted, nil
}

func (r *InstagramPostRepository) ListByAccount(ctx context.Context, account string) ([]models.InstagramPost, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id, shortcode, account, caption, media_url, views, likes, comments, is_video, posted_at, scraped_at
		FROM instagram_posts
		WHERE account = $1
		ORDER BY posted_at DESC NULLS LAST, id DESC
	`, account)
	if err != nil {
		return nil, fmt.Errorf("list posts: %w", err)
	}
	defer rows.Close()

	var posts []models.InstagramPost
	for rows.Next() {
		var p models.InstagramPost
		if err := rows.Scan(&p.ID, &p.Shortcode, &p.Account, &p.Caption, &p.MediaURL, &p.Views, &p.Likes, &p.Comments, &p.IsVideo, &p.PostedAt, &p.ScrapedAt); err != nil {
			return nil, fmt.Errorf("scan post: %w", err)
		}
		posts = append(posts, p)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("list posts rows: %w", err)
	}
	return posts, nil
}

func (r *InstagramPostRepository) CountByAccount(ctx context.Context, account string) (int, error) {
	var count int
	err := r.db.QueryRow(ctx, `SELECT COUNT(*) FROM instagram_posts WHERE account = $1`, account).Scan(&count)
	return count, err
}

func (r *InstagramPostRepository) DeleteByAccount(ctx context.Context, account string) error {
	_, err := r.db.Exec(ctx, `DELETE FROM instagram_posts WHERE account = $1`, account)
	return err
}
