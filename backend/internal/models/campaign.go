package models

import "time"

type Campaign struct {
	ID          string     `json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Status      string     `json:"status"`
	Budget      int64      `json:"budget"`
	StartDate   *time.Time `json:"startDate,omitempty"`
	EndDate     *time.Time `json:"endDate,omitempty"`
	Creators    []Creator  `json:"creators,omitempty"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}

type CreateCampaignRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Budget      int64  `json:"budget"`
}

type UpdateCampaignRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"`
	Budget      int64  `json:"budget"`
}

type AddCreatorToCampaignRequest struct {
	CreatorID string `json:"creatorId"`
}
