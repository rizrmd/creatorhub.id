package models

import "time"

type ChatChannel struct {
	ID          string    `json:"id"`
	CreatorID   string    `json:"creatorId"`
	CreatorName string    `json:"creatorName"`
	Avatar      string    `json:"avatar"`
	LastMessage string    `json:"lastMessage"`
	UnreadCount int       `json:"unreadCount"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type Message struct {
	ID         string    `json:"id"`
	ChannelID  string    `json:"channelId"`
	SenderID   string    `json:"senderId"`
	SenderType string    `json:"senderType"`
	Content    string    `json:"content"`
	CreatedAt  time.Time `json:"createdAt"`
}

type SendMessageRequest struct {
	Content string `json:"content"`
}
