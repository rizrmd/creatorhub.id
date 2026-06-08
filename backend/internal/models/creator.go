package models

type Creator struct {
	ID             string   `json:"id"`
	Name           string   `json:"name"`
	City           string   `json:"city"`
	Country        string   `json:"country"`
	Category       string   `json:"category"`
	Platforms      []string `json:"platforms"`
	Followers      int64    `json:"followers"`
	FollowersText  string   `json:"followersText"`
	EngagementRate float64  `json:"engagementRate"`
	Price          int64    `json:"price"`
	PriceText      string   `json:"priceText"`
	Verified       bool     `json:"verified"`
	Rating         float64  `json:"rating"`
	FastResponse   bool     `json:"fastResponse"`
	TopRated       bool     `json:"topRated"`
	ImageURL       string   `json:"imageUrl"`
	Bio            string   `json:"bio"`
}

type CreatorListParams struct {
	Category      string
	City          string
	Platform      string
	MinFollowers  int64
	MaxFollowers  int64
	MinEngagement float64
	MaxEngagement float64
	MinPrice      int64
	MaxPrice      int64
	MinRating     float64
	Verified      *bool
	FastResponse  *bool
	TopRated      *bool
	Search        string
	SortBy        string
	SortDir       string
	Page          int
	PageSize      int
}

type MarketplaceStats struct {
	TotalCreators      int64   `json:"totalCreators"`
	ActiveCampaigns    int64   `json:"activeCampaigns"`
	AvgEngagementRate  float64 `json:"avgEngagementRate"`
	TotalBudget        int64   `json:"totalBudget"`
}

type CreatorListResponse struct {
	Data       []Creator `json:"data"`
	Total      int64     `json:"total"`
	Page       int       `json:"page"`
	PageSize   int       `json:"pageSize"`
	TotalPages int       `json:"totalPages"`
}
