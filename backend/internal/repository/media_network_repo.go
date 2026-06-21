package repository

import (
	"context"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"

	"creatorhub/backend/internal/models"
)

type MediaNetworkRepository struct {
	db *pgxpool.Pool
}

func NewMediaNetworkRepository(db *pgxpool.Pool) *MediaNetworkRepository {
	return &MediaNetworkRepository{db: db}
}

func (r *MediaNetworkRepository) ListGroups(ctx context.Context) ([]models.MediaGroup, error) {
	rows, err := r.db.Query(ctx, `
		SELECT g.id, g.name, g.created_at, COUNT(o.id) as outlet_count
		FROM media_groups g
		LEFT JOIN media_outlets o ON o.group_id = g.id
		GROUP BY g.id, g.name, g.created_at
		ORDER BY g.name
	`)
	if err != nil {
		return nil, fmt.Errorf("list groups: %w", err)
	}
	defer rows.Close()

	var groups []models.MediaGroup
	for rows.Next() {
		var g models.MediaGroup
		if err := rows.Scan(&g.ID, &g.Name, &g.CreatedAt, &g.OutletCount); err != nil {
			return nil, fmt.Errorf("scan group: %w", err)
		}
		groups = append(groups, g)
	}
	return groups, nil
}

func (r *MediaNetworkRepository) ListOutlets(ctx context.Context, groupID string) ([]models.MediaOutlet, error) {
	rows, err := r.db.Query(ctx, `
		SELECT o.id, o.group_id, COALESCE(g.name, '') as group_name, o.name, o.is_group_header, o.url,
		       o.total_brands, o.harga_agency, o.harga_rate_card, o.google_news,
		       o.instagram_handle, o.instagram_followers,
		       o.facebook_handle, o.facebook_followers,
		       o.threads_handle, o.threads_followers,
		       o.tiktok_handle, o.tiktok_followers,
		       o.twitter_handle, o.twitter_followers,
		       o.youtube_handle, o.youtube_followers,
		       o.genre, o.keterangan, o.created_at, o.updated_at
		FROM media_outlets o
		LEFT JOIN media_groups g ON g.id = o.group_id
		WHERE o.group_id = $1
		ORDER BY o.is_group_header DESC, o.name
	`, groupID)
	if err != nil {
		return nil, fmt.Errorf("list outlets: %w", err)
	}
	defer rows.Close()

	var outlets []models.MediaOutlet
	for rows.Next() {
		var o models.MediaOutlet
		if err := rows.Scan(
			&o.ID, &o.GroupID, &o.GroupName, &o.Name, &o.IsGroupHeader, &o.URL,
			&o.TotalBrands, &o.HargaAgency, &o.HargaRateCard, &o.GoogleNews,
			&o.InstagramHandle, &o.InstagramFollowers,
			&o.FacebookHandle, &o.FacebookFollowers,
			&o.ThreadsHandle, &o.ThreadsFollowers,
			&o.TiktokHandle, &o.TiktokFollowers,
			&o.TwitterHandle, &o.TwitterFollowers,
			&o.YouTubeHandle, &o.YouTubeFollowers,
			&o.Genre, &o.Keterangan, &o.CreatedAt, &o.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan outlet: %w", err)
		}
		outlets = append(outlets, o)
	}
	return outlets, nil
}

func (r *MediaNetworkRepository) SearchOutlets(ctx context.Context, query string) ([]models.MediaOutlet, error) {
	rows, err := r.db.Query(ctx, `
		SELECT o.id, o.group_id, COALESCE(g.name, '') as group_name, o.name, o.is_group_header, o.url,
		       o.total_brands, o.harga_agency, o.harga_rate_card, o.google_news,
		       o.instagram_handle, o.instagram_followers,
		       o.facebook_handle, o.facebook_followers,
		       o.threads_handle, o.threads_followers,
		       o.tiktok_handle, o.tiktok_followers,
		       o.twitter_handle, o.twitter_followers,
		       o.youtube_handle, o.youtube_followers,
		       o.genre, o.keterangan, o.created_at, o.updated_at
		FROM media_outlets o
		LEFT JOIN media_groups g ON g.id = o.group_id
		WHERE o.name ILIKE $1
		   OR g.name ILIKE $1
		   OR o.instagram_handle ILIKE $1
		   OR o.tiktok_handle ILIKE $1
		   OR o.youtube_handle ILIKE $1
		   OR o.genre ILIKE $1
		ORDER BY g.name, o.name
		LIMIT 200
	`, "%"+query+"%")
	if err != nil {
		return nil, fmt.Errorf("search outlets: %w", err)
	}
	defer rows.Close()

	var outlets []models.MediaOutlet
	for rows.Next() {
		var o models.MediaOutlet
		if err := rows.Scan(
			&o.ID, &o.GroupID, &o.GroupName, &o.Name, &o.IsGroupHeader, &o.URL,
			&o.TotalBrands, &o.HargaAgency, &o.HargaRateCard, &o.GoogleNews,
			&o.InstagramHandle, &o.InstagramFollowers,
			&o.FacebookHandle, &o.FacebookFollowers,
			&o.ThreadsHandle, &o.ThreadsFollowers,
			&o.TiktokHandle, &o.TiktokFollowers,
			&o.TwitterHandle, &o.TwitterFollowers,
			&o.YouTubeHandle, &o.YouTubeFollowers,
			&o.Genre, &o.Keterangan, &o.CreatedAt, &o.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan outlet: %w", err)
		}
		outlets = append(outlets, o)
	}
	return outlets, nil
}

func (r *MediaNetworkRepository) BulkUpdateOutlets(ctx context.Context, outlets []models.MediaOutlet) (int, error) {
	if len(outlets) == 0 {
		return 0, nil
	}

	// Build batch update query
	setClauses := []string{}
	args := []interface{}{}
	argIdx := 1

	for i, o := range outlets {
		_ = i
		setClauses = append(setClauses, fmt.Sprintf(`
			UPDATE media_outlets SET
				total_brands = COALESCE(NULLIF($%d::integer, 0), total_brands),
				harga_agency = NULLIF($%d, '') ?? harga_agency,
				harga_rate_card = NULLIF($%d, '') ?? harga_rate_card,
				google_news = $%d,
				instagram_handle = NULLIF($%d, '') ?? instagram_handle,
				instagram_followers = NULLIF($%d, '') ?? instagram_followers,
				facebook_handle = NULLIF($%d, '') ?? facebook_handle,
				facebook_followers = NULLIF($%d, '') ?? facebook_followers,
				threads_handle = NULLIF($%d, '') ?? threads_handle,
				threads_followers = NULLIF($%d, '') ?? threads_followers,
				tiktok_handle = NULLIF($%d, '') ?? tiktok_handle,
				tiktok_followers = NULLIF($%d, '') ?? tiktok_followers,
				twitter_handle = NULLIF($%d, '') ?? twitter_handle,
				twitter_followers = NULLIF($%d, '') ?? twitter_followers,
				youtube_handle = NULLIF($%d, '') ?? youtube_handle,
				youtube_followers = NULLIF($%d, '') ?? youtube_followers,
				genre = NULLIF($%d, '') ?? genre,
				keterangan = NULLIF($%d, '') ?? keterangan,
				updated_at = NOW()
			WHERE id = $%d
		`,
			argIdx,     // total_brands
			argIdx+1,   // harga_agency
			argIdx+2,   // harga_rate_card
			argIdx+3,   // google_news
			argIdx+4,   // instagram_handle
			argIdx+5,   // instagram_followers
			argIdx+6,   // facebook_handle
			argIdx+7,   // facebook_followers
			argIdx+8,   // threads_handle
			argIdx+9,   // threads_followers
			argIdx+10,  // tiktok_handle
			argIdx+11,  // tiktok_followers
			argIdx+12,  // twitter_handle
			argIdx+13,  // twitter_followers
			argIdx+14,  // youtube_handle
			argIdx+15,  // youtube_followers
			argIdx+16,  // genre
			argIdx+17,  // keterangan
			argIdx+18,  // WHERE id
		))

		args = append(args,
			derefInt(o.TotalBrands),
			derefStr(o.HargaAgency),
			derefStr(o.HargaRateCard),
			o.GoogleNews,
			derefStr(o.InstagramHandle),
			derefStr(o.InstagramFollowers),
			derefStr(o.FacebookHandle),
			derefStr(o.FacebookFollowers),
			derefStr(o.ThreadsHandle),
			derefStr(o.ThreadsFollowers),
			derefStr(o.TiktokHandle),
			derefStr(o.TiktokFollowers),
			derefStr(o.TwitterHandle),
			derefStr(o.TwitterFollowers),
			derefStr(o.YouTubeHandle),
			derefStr(o.YouTubeFollowers),
			derefStr(o.Genre),
			derefStr(o.Keterangan),
			o.ID,
		)
		argIdx += 19
	}

	fullQuery := strings.Join(setClauses, ";\n")
	_, err := r.db.Exec(ctx, fullQuery, args...)
	if err != nil {
		return 0, fmt.Errorf("bulk update: %w", err)
	}

	return len(outlets), nil
}

func derefStr(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

func derefInt(i *int) int {
	if i == nil {
		return 0
	}
	return *i
}
