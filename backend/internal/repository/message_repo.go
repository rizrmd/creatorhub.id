package repository

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"creatorhub/backend/internal/models"
)

type MessageRepository struct {
	db *pgxpool.Pool
}

func NewMessageRepository(db *pgxpool.Pool) *MessageRepository {
	return &MessageRepository{db: db}
}

func (r *MessageRepository) ListChannels(ctx context.Context) ([]models.ChatChannel, error) {
	rows, err := r.db.Query(ctx, `
		SELECT
			ch.id, ch.creator_id, cr.name, cr.image_url,
			COALESCE(
				(SELECT m.content FROM messages m WHERE m.channel_id = ch.id ORDER BY m.created_at DESC LIMIT 1),
				''
			) AS last_message,
			COALESCE(
				(SELECT COUNT(*) FROM messages m WHERE m.channel_id = ch.id AND m.is_read = false AND m.sender_type = 'creator'),
				0
			) AS unread_count,
			ch.updated_at
		FROM chat_channels ch
		JOIN creators cr ON cr.id = ch.creator_id
		ORDER BY ch.updated_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	channels := []models.ChatChannel{}
	for rows.Next() {
		var ch models.ChatChannel
		if err := rows.Scan(
			&ch.ID, &ch.CreatorID, &ch.CreatorName, &ch.Avatar,
			&ch.LastMessage, &ch.UnreadCount, &ch.UpdatedAt,
		); err != nil {
			return nil, err
		}
		channels = append(channels, ch)
	}
	return channels, nil
}

func (r *MessageRepository) CreateChannel(ctx context.Context, creatorID string) (*models.ChatChannel, error) {
	var ch models.ChatChannel
	err := r.db.QueryRow(ctx, `
		INSERT INTO chat_channels (creator_id)
		VALUES ($1)
		ON CONFLICT (creator_id) DO UPDATE SET updated_at = NOW()
		RETURNING id, creator_id, updated_at`,
		creatorID,
	).Scan(&ch.ID, &ch.CreatorID, &ch.UpdatedAt)
	return &ch, err
}

func (r *MessageRepository) ListMessages(ctx context.Context, channelID string) ([]models.Message, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id, channel_id, sender_id, sender_type, content, created_at
		FROM messages
		WHERE channel_id = $1
		ORDER BY created_at ASC`, channelID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	msgs := []models.Message{}
	for rows.Next() {
		var m models.Message
		if err := rows.Scan(
			&m.ID, &m.ChannelID, &m.SenderID, &m.SenderType, &m.Content, &m.CreatedAt,
		); err != nil {
			return nil, err
		}
		msgs = append(msgs, m)
	}
	return msgs, nil
}

func (r *MessageRepository) SendMessage(ctx context.Context, channelID, senderID, senderType, content string) (*models.Message, error) {
	var m models.Message
	err := r.db.QueryRow(ctx, `
		INSERT INTO messages (channel_id, sender_id, sender_type, content)
		VALUES ($1, $2, $3, $4)
		RETURNING id, channel_id, sender_id, sender_type, content, created_at`,
		channelID, senderID, senderType, content,
	).Scan(&m.ID, &m.ChannelID, &m.SenderID, &m.SenderType, &m.Content, &m.CreatedAt)
	if err != nil {
		return nil, err
	}
	_, _ = r.db.Exec(ctx, `UPDATE chat_channels SET updated_at = $1 WHERE id = $2`, time.Now(), channelID)
	return &m, nil
}
