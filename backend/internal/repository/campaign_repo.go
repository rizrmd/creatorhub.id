package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"

	"creatorhub/backend/internal/models"
)

type CampaignRepository struct {
	db *pgxpool.Pool
}

func NewCampaignRepository(db *pgxpool.Pool) *CampaignRepository {
	return &CampaignRepository{db: db}
}

func (r *CampaignRepository) List(ctx context.Context) ([]models.Campaign, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id, title, description, status, budget, start_date, end_date, created_at, updated_at
		FROM campaigns ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	campaigns := []models.Campaign{}
	for rows.Next() {
		var c models.Campaign
		if err := rows.Scan(
			&c.ID, &c.Title, &c.Description, &c.Status, &c.Budget,
			&c.StartDate, &c.EndDate, &c.CreatedAt, &c.UpdatedAt,
		); err != nil {
			return nil, err
		}
		campaigns = append(campaigns, c)
	}
	return campaigns, nil
}

func (r *CampaignRepository) Create(ctx context.Context, req models.CreateCampaignRequest) (*models.Campaign, error) {
	var c models.Campaign
	err := r.db.QueryRow(ctx, `
		INSERT INTO campaigns (title, description, status, budget)
		VALUES ($1, $2, 'draft', $3)
		RETURNING id, title, description, status, budget, start_date, end_date, created_at, updated_at`,
		req.Title, req.Description, req.Budget,
	).Scan(&c.ID, &c.Title, &c.Description, &c.Status, &c.Budget,
		&c.StartDate, &c.EndDate, &c.CreatedAt, &c.UpdatedAt)
	return &c, err
}

func (r *CampaignRepository) GetByID(ctx context.Context, id string) (*models.Campaign, error) {
	var c models.Campaign
	err := r.db.QueryRow(ctx, `
		SELECT id, title, description, status, budget, start_date, end_date, created_at, updated_at
		FROM campaigns WHERE id = $1`, id,
	).Scan(&c.ID, &c.Title, &c.Description, &c.Status, &c.Budget,
		&c.StartDate, &c.EndDate, &c.CreatedAt, &c.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *CampaignRepository) Update(ctx context.Context, id string, req models.UpdateCampaignRequest) (*models.Campaign, error) {
	var c models.Campaign
	err := r.db.QueryRow(ctx, `
		UPDATE campaigns
		SET title = $1, description = $2, status = $3, budget = $4, updated_at = NOW()
		WHERE id = $5
		RETURNING id, title, description, status, budget, start_date, end_date, created_at, updated_at`,
		req.Title, req.Description, req.Status, req.Budget, id,
	).Scan(&c.ID, &c.Title, &c.Description, &c.Status, &c.Budget,
		&c.StartDate, &c.EndDate, &c.CreatedAt, &c.UpdatedAt)
	return &c, err
}

func (r *CampaignRepository) Delete(ctx context.Context, id string) error {
	_, err := r.db.Exec(ctx, `DELETE FROM campaigns WHERE id = $1`, id)
	return err
}

func (r *CampaignRepository) AddCreator(ctx context.Context, campaignID, creatorID string) error {
	_, err := r.db.Exec(ctx, `
		INSERT INTO campaign_creators (campaign_id, creator_id)
		VALUES ($1, $2) ON CONFLICT DO NOTHING`,
		campaignID, creatorID)
	return err
}

func (r *CampaignRepository) RemoveCreator(ctx context.Context, campaignID, creatorID string) error {
	_, err := r.db.Exec(ctx, `
		DELETE FROM campaign_creators WHERE campaign_id = $1 AND creator_id = $2`,
		campaignID, creatorID)
	return err
}
