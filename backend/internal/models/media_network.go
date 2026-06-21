package models

import "time"

type MediaGroup struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	OutletCount  int    `json:"outletCount"`
	CreatedAt    time.Time `json:"createdAt"`
}

type MediaOutlet struct {
	ID                int       `json:"id"`
	GroupID           *string   `json:"groupId"`
	GroupName         string    `json:"groupName,omitempty"`
	Name              string    `json:"name"`
	IsGroupHeader     bool      `json:"isGroupHeader"`
	URL               *string   `json:"url"`
	TotalBrands       *int      `json:"totalBrands"`
	HargaAgency       *string   `json:"hargaAgency"`
	HargaRateCard     *string   `json:"hargaRateCard"`
	GoogleNews        bool      `json:"googleNews"`
	InstagramHandle   *string   `json:"instagramHandle"`
	InstagramFollowers *string  `json:"instagramFollowers"`
	FacebookHandle    *string   `json:"facebookHandle"`
	FacebookFollowers *string   `json:"facebookFollowers"`
	ThreadsHandle     *string   `json:"threadsHandle"`
	ThreadsFollowers  *string   `json:"threadsFollowers"`
	TiktokHandle      *string   `json:"tiktokHandle"`
	TiktokFollowers   *string   `json:"tiktokFollowers"`
	TwitterHandle     *string   `json:"twitterHandle"`
	TwitterFollowers  *string   `json:"twitterFollowers"`
	YouTubeHandle     *string   `json:"youtubeHandle"`
	YouTubeFollowers  *string   `json:"youtubeFollowers"`
	Genre             *string   `json:"genre"`
	Keterangan        *string   `json:"keterangan"`
	CreatedAt         time.Time `json:"createdAt"`
	UpdatedAt         time.Time `json:"updatedAt"`
}

type BulkUpdateRequest struct {
	Outlets []MediaOutlet `json:"outlets"`
}

type BulkUpdateResponse struct {
	Updated int `json:"updated"`
}
