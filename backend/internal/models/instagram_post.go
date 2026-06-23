package models

import "time"

type InstagramPost struct {
	ID        int        `json:"id"`
	Shortcode string     `json:"shortcode"`
	Account   string     `json:"account"`
	Caption   string     `json:"caption,omitempty"`
	MediaURL  string     `json:"mediaUrl,omitempty"`
	Views     int        `json:"views"`
	Likes     int        `json:"likes"`
	Comments  int        `json:"comments"`
	IsVideo   bool       `json:"isVideo"`
	PostedAt  *time.Time `json:"postedAt,omitempty"`
	ScrapedAt time.Time  `json:"scrapedAt"`
}

type InstagramScrapeRequest struct {
	Account string `json:"account"`
}

type InstagramScrapeResponse struct {
	Success     bool            `json:"success"`
	Error       string          `json:"error,omitempty"`
	Account     string          `json:"account"`
	DisplayName string          `json:"displayName"`
	Bio         string          `json:"bio"`
	Followers   int64           `json:"followers"`
	Following   int64           `json:"following"`
	Posts       int             `json:"posts"`
	ProfilePic  string          `json:"profilePic"`
	Data        []InstagramPost `json:"data"`
}
