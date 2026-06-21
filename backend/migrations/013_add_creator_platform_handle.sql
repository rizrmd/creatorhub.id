-- +goose Up
ALTER TABLE creator_platforms
    ADD COLUMN IF NOT EXISTS handle VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS profile_picture_url TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS platform_followers BIGINT NOT NULL DEFAULT 0;

-- +goose Down
ALTER TABLE creator_platforms
    DROP COLUMN IF EXISTS handle,
    DROP COLUMN IF EXISTS profile_picture_url,
    DROP COLUMN IF EXISTS platform_followers;
