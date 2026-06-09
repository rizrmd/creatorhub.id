package models

import "time"

type CampaignDeliverables struct {
	Total     int `json:"total"`
	Completed int `json:"completed"`
	InReview  int `json:"inReview"`
}

type Campaign struct {
	ID           string                `json:"id"`
	Title        string                `json:"title"`
	Description  string                `json:"description"`
	Brand        string                `json:"brand"`
	Status       string                `json:"status"`
	Objective    string                `json:"objective"`
	Budget       int64                 `json:"budget"`
	BudgetSpent  int64                 `json:"budgetSpent"`
	StartDate    *time.Time            `json:"startDate,omitempty"`
	EndDate      *time.Time            `json:"endDate,omitempty"`
	DaysLeft     *int                  `json:"daysLeft,omitempty"`
	Creators     []Creator             `json:"creators,omitempty"`
	Deliverables *CampaignDeliverables `json:"deliverables,omitempty"`
	Hue          int                   `json:"hue"`
	CreatedAt    time.Time             `json:"createdAt"`
	UpdatedAt    time.Time             `json:"updatedAt"`
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
