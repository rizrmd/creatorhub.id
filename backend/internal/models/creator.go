package models

type PlatformMetric struct {
	Platform       string  `json:"platform"`
	Handle         string  `json:"handle,omitempty"`
	Followers      int64   `json:"followers"`
	EngagementRate float64 `json:"engagementRate"`
}

type Creator struct {
	ID              string           `json:"id"`
	Name            string           `json:"name"`
	Handle          string           `json:"handle"`
	City            string           `json:"city"`
	Country         string           `json:"country"`
	Category        string           `json:"category"`
	Platforms       []string         `json:"platforms"`
	PlatformMetrics []PlatformMetric `json:"platformMetrics"`
	Followers       int64            `json:"followers"`
	FollowersText   string           `json:"followersText"`
	EngagementRate  float64          `json:"engagementRate"`
	Price           int64            `json:"price"`
	PriceText       string           `json:"priceText"`
	Verified        bool             `json:"verified"`
	StarCreator     bool             `json:"starCreator"`
	Rating          float64          `json:"rating"`
	FastResponse    bool             `json:"fastResponse"`
	TopRated        bool             `json:"topRated"`
	LastSeen        string           `json:"lastSeen"`
	ImageURL        string           `json:"imageUrl"`
	ImgPath         string           `json:"img"`
	Focus           string           `json:"focus"`
	Hue             int              `json:"hue"`
	Bio             string           `json:"bio"`
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
	TotalCreators     int64   `json:"totalCreators"`
	ActiveCampaigns   int64   `json:"activeCampaigns"`
	AvgEngagementRate float64 `json:"avgEngagementRate"`
	TotalBudget       int64   `json:"totalBudget"`
}

type CreatorListResponse struct {
	Data       []Creator `json:"data"`
	Total      int64     `json:"total"`
	Page       int       `json:"page"`
	PageSize   int       `json:"pageSize"`
	TotalPages int       `json:"totalPages"`
}

type ScrapeRequest struct {
	Platform string `json:"platform"`
	Handle   string `json:"handle"`
}

type PlatformInput struct {
	Platform          string `json:"platform"`
	Handle            string `json:"handle"`
	ProfilePictureURL string `json:"profilePictureUrl"`
	Followers         int64  `json:"followers"`
}

type CreateCreatorRequest struct {
	Name      string          `json:"name"`
	Bio       string          `json:"bio"`
	Category  string          `json:"category"`
	City      string          `json:"city"`
	ImageURL  string          `json:"imageUrl"`
	Platforms []PlatformInput `json:"platforms"`
}
