package repository

import (
	"context"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"

	"creatorhub/backend/internal/models"
)

type CreatorRepository struct {
	db *pgxpool.Pool
}

func NewCreatorRepository(db *pgxpool.Pool) *CreatorRepository {
	return &CreatorRepository{db: db}
}

func (r *CreatorRepository) List(ctx context.Context, params models.CreatorListParams) (*models.CreatorListResponse, error) {
	if params.PageSize == 0 {
		params.PageSize = 50
	}
	if params.Page == 0 {
		params.Page = 1
	}

	where := []string{"1=1"}
	args := []interface{}{}
	argIdx := 1

	if params.Category != "" {
		where = append(where, fmt.Sprintf("c.category ILIKE $%d", argIdx))
		args = append(args, "%"+params.Category+"%")
		argIdx++
	}
	if params.City != "" {
		where = append(where, fmt.Sprintf("c.city ILIKE $%d", argIdx))
		args = append(args, "%"+params.City+"%")
		argIdx++
	}
	if params.Search != "" {
		where = append(where, fmt.Sprintf(
			"(c.name ILIKE $%d OR c.handle ILIKE $%d OR c.bio ILIKE $%d OR c.city ILIKE $%d OR c.category ILIKE $%d)",
			argIdx, argIdx, argIdx, argIdx, argIdx,
		))
		args = append(args, "%"+params.Search+"%")
		argIdx++
	}
	if params.MinFollowers > 0 {
		where = append(where, fmt.Sprintf("c.followers >= $%d", argIdx))
		args = append(args, params.MinFollowers)
		argIdx++
	}
	if params.MaxFollowers > 0 {
		where = append(where, fmt.Sprintf("c.followers <= $%d", argIdx))
		args = append(args, params.MaxFollowers)
		argIdx++
	}
	if params.MinRating > 0 {
		where = append(where, fmt.Sprintf("c.rating >= $%d", argIdx))
		args = append(args, params.MinRating)
		argIdx++
	}
	if params.MinEngagement > 0 {
		where = append(where, fmt.Sprintf("c.engagement_rate >= $%d", argIdx))
		args = append(args, params.MinEngagement)
		argIdx++
	}
	if params.MaxEngagement > 0 {
		where = append(where, fmt.Sprintf("c.engagement_rate <= $%d", argIdx))
		args = append(args, params.MaxEngagement)
		argIdx++
	}
	if params.MinPrice > 0 {
		where = append(where, fmt.Sprintf("c.price >= $%d", argIdx))
		args = append(args, params.MinPrice)
		argIdx++
	}
	if params.MaxPrice > 0 {
		where = append(where, fmt.Sprintf("c.price <= $%d", argIdx))
		args = append(args, params.MaxPrice)
		argIdx++
	}
	if params.Platform != "" {
		where = append(where, fmt.Sprintf("EXISTS (SELECT 1 FROM creator_platforms cp WHERE cp.creator_id = c.id AND cp.platform = $%d)", argIdx))
		args = append(args, params.Platform)
		argIdx++
	}
	if params.Verified != nil {
		where = append(where, fmt.Sprintf("c.verified = $%d", argIdx))
		args = append(args, *params.Verified)
		argIdx++
	}
	if params.FastResponse != nil {
		where = append(where, fmt.Sprintf("c.fast_response = $%d", argIdx))
		args = append(args, *params.FastResponse)
		argIdx++
	}
	if params.TopRated != nil {
		where = append(where, fmt.Sprintf("c.top_rated = $%d", argIdx))
		args = append(args, *params.TopRated)
		argIdx++
	}

	whereClause := strings.Join(where, " AND ")

	orderBy := "c.created_at DESC"
	if params.SortBy != "" {
		validSorts := map[string]string{
			"followers":  "c.followers",
			"engagement": "c.engagement_rate",
			"rating":     "c.rating",
			"price":      "c.price",
		}
		if col, ok := validSorts[params.SortBy]; ok {
			dir := "DESC"
			if strings.ToUpper(params.SortDir) == "ASC" {
				dir = "ASC"
			}
			orderBy = col + " " + dir
		}
	}

	var total int64
	if err := r.db.QueryRow(ctx, fmt.Sprintf(`SELECT COUNT(*) FROM creators c WHERE %s`, whereClause), args...).Scan(&total); err != nil {
		return nil, err
	}

	offset := (params.Page - 1) * params.PageSize
	dataArgs := append(args, params.PageSize, offset)

	dataQuery := fmt.Sprintf(`
		SELECT
			c.id, c.name, c.handle, c.city, c.country, c.category,
			c.followers, c.followers_text, c.engagement_rate,
			c.price, c.price_text, c.verified, c.star_creator, c.rating,
			c.fast_response, c.top_rated, c.last_seen, c.image_url, c.img_path, c.focus, c.hue, c.bio,
			COALESCE(c.tags, '{}') AS tags, COALESCE(c.created_at::text, '') AS created_at,
			COALESCE(
				(SELECT array_agg(cp.platform ORDER BY cp.platform)
				 FROM creator_platforms cp WHERE cp.creator_id = c.id),
				ARRAY[]::text[]
			) AS platforms,
			COALESCE(
				(SELECT jsonb_agg(jsonb_build_object(
					'platform', cp.platform,
					'handle', cp.handle,
					'followers', cp.platform_followers,
					'engagementRate', cp.engagement_rate
				) ORDER BY cp.platform)
				FROM creator_platforms cp WHERE cp.creator_id = c.id),
				'[]'::jsonb
			) AS platform_metrics
		FROM creators c
		WHERE %s
		ORDER BY %s
		LIMIT $%d OFFSET $%d`,
		whereClause, orderBy, argIdx, argIdx+1)

	rows, err := r.db.Query(ctx, dataQuery, dataArgs...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	creators := []models.Creator{}
	for rows.Next() {
		var c models.Creator
		if err := rows.Scan(
			&c.ID, &c.Name, &c.Handle, &c.City, &c.Country, &c.Category,
			&c.Followers, &c.FollowersText, &c.EngagementRate,
			&c.Price, &c.PriceText, &c.Verified, &c.StarCreator, &c.Rating,
			&c.FastResponse, &c.TopRated, &c.LastSeen, &c.ImageURL, &c.ImgPath, &c.Focus, &c.Hue, &c.Bio,
			&c.Tags, &c.CreatedAt, &c.Platforms, &c.PlatformMetrics,
		); err != nil {
			return nil, err
		}
		if c.Platforms == nil {
			c.Platforms = []string{}
		}
		if c.PlatformMetrics == nil {
			c.PlatformMetrics = []models.PlatformMetric{}
		}
		c.FollowersText = formatFollowers(c.Followers)
		creators = append(creators, c)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	totalPages := int((total + int64(params.PageSize) - 1) / int64(params.PageSize))

	return &models.CreatorListResponse{
		Data:       creators,
		Total:      total,
		Page:       params.Page,
		PageSize:   params.PageSize,
		TotalPages: totalPages,
	}, nil
}

func (r *CreatorRepository) Stats(ctx context.Context) (*models.MarketplaceStats, error) {
	var s models.MarketplaceStats
	err := r.db.QueryRow(ctx, `
		SELECT
			(SELECT COUNT(*) FROM creators) AS total_creators,
			(SELECT COUNT(*) FROM campaigns WHERE status = 'active') AS active_campaigns,
			(SELECT COALESCE(AVG(engagement_rate) FILTER (WHERE engagement_rate BETWEEN 0 AND 100), 0) FROM creators) AS avg_engagement,
			(SELECT COALESCE(SUM(budget), 0) FROM campaigns) AS total_budget
	`).Scan(&s.TotalCreators, &s.ActiveCampaigns, &s.AvgEngagementRate, &s.TotalBudget)
	return &s, err
}

func (r *CreatorRepository) GetByID(ctx context.Context, id string) (*models.Creator, error) {
	var c models.Creator
	err := r.db.QueryRow(ctx, `
		SELECT
			c.id, c.name, c.handle, c.city, c.country, c.category,
			c.followers, c.followers_text, c.engagement_rate,
			c.price, c.price_text, c.verified, c.star_creator, c.rating,
			c.fast_response, c.top_rated, c.last_seen, c.image_url, c.img_path, c.focus, c.hue, c.bio,
			COALESCE(c.tags, '{}') AS tags, COALESCE(c.created_at::text, '') AS created_at,
			COALESCE(
				(SELECT array_agg(cp.platform ORDER BY cp.platform)
				 FROM creator_platforms cp WHERE cp.creator_id = c.id),
				ARRAY[]::text[]
			) AS platforms,
			COALESCE(
				(SELECT jsonb_agg(jsonb_build_object(
					'platform', cp.platform,
					'handle', cp.handle,
					'followers', cp.platform_followers,
					'engagementRate', cp.engagement_rate
				) ORDER BY cp.platform)
				FROM creator_platforms cp WHERE cp.creator_id = c.id),
				'[]'::jsonb
			) AS platform_metrics
		FROM creators c
		WHERE c.id = $1`, id,
	).Scan(
		&c.ID, &c.Name, &c.Handle, &c.City, &c.Country, &c.Category,
		&c.Followers, &c.FollowersText, &c.EngagementRate,
		&c.Price, &c.PriceText, &c.Verified, &c.StarCreator, &c.Rating,
		&c.FastResponse, &c.TopRated, &c.LastSeen, &c.ImageURL, &c.ImgPath, &c.Focus, &c.Hue, &c.Bio,
		&c.Tags, &c.CreatedAt, &c.Platforms, &c.PlatformMetrics,
	)
	if err != nil {
		return nil, err
	}
	if c.Platforms == nil {
		c.Platforms = []string{}
	}
	if c.PlatformMetrics == nil {
		c.PlatformMetrics = []models.PlatformMetric{}
	}
	c.FollowersText = formatFollowers(c.Followers)
	return &c, nil
}

func (r *CreatorRepository) Create(ctx context.Context, req models.CreateCreatorRequest) (*models.Creator, error) {
	var c models.Creator

	// Generate a slug-style ID from the name
	id := strings.ToLower(strings.ReplaceAll(req.Name, " ", "-"))
	id = strings.Map(func(r rune) rune {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == '-' {
			return r
		}
		return -1
	}, id)

	// Use first platform's profile picture if no image URL provided
	imageURL := req.ImageURL
	if imageURL == "" && len(req.Platforms) > 0 {
		imageURL = req.Platforms[0].ProfilePictureURL
	}

	// Calculate total followers
	var totalFollowers int64
	for _, p := range req.Platforms {
		totalFollowers += p.Followers
	}

	followersText := formatFollowers(totalFollowers)

	err := r.db.QueryRow(ctx, `
		INSERT INTO creators (id, name, handle, city, country, category, followers, followers_text, image_url, bio)
		VALUES ($1, $2, $3, $4, 'Indonesia', $5, $6, $7, $8, $9)
		RETURNING id, name, handle, city, country, category, followers, followers_text, engagement_rate,
			price, price_text, verified, star_creator, rating, fast_response, top_rated,
			last_seen, image_url, img_path, focus, hue, bio`,
		id, req.Name, "", req.City, req.Category, totalFollowers, followersText, imageURL, req.Bio,
	).Scan(
		&c.ID, &c.Name, &c.Handle, &c.City, &c.Country, &c.Category,
		&c.Followers, &c.FollowersText, &c.EngagementRate,
		&c.Price, &c.PriceText, &c.Verified, &c.StarCreator, &c.Rating,
		&c.FastResponse, &c.TopRated, &c.LastSeen, &c.ImageURL, &c.ImgPath, &c.Focus, &c.Hue, &c.Bio,
	)
	if err != nil {
		return nil, err
	}

	c.Platforms = []string{}
	c.PlatformMetrics = []models.PlatformMetric{}

	return &c, nil
}

func (r *CreatorRepository) AddPlatform(ctx context.Context, creatorID string, p models.PlatformInput) error {
	_, err := r.db.Exec(ctx, `
		INSERT INTO creator_platforms (creator_id, platform, handle, profile_picture_url, platform_followers)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (creator_id, platform) DO UPDATE SET
			handle = EXCLUDED.handle,
			profile_picture_url = EXCLUDED.profile_picture_url,
			platform_followers = EXCLUDED.platform_followers`,
		creatorID, p.Platform, p.Handle, p.ProfilePictureURL, p.Followers,
	)
	return err
}

func formatFollowers(n int64) string {
	s := fmt.Sprintf("%d", n)
	if n < 1000 {
		return s
	}
	var result []byte
	for i, c := range s {
		if i > 0 && (len(s)-i)%3 == 0 {
			result = append(result, '.')
		}
		result = append(result, byte(c))
	}
	return string(result)
}
