-- +goose Up
CREATE TABLE IF NOT EXISTS instagram_posts (
  id SERIAL PRIMARY KEY,
  shortcode TEXT NOT NULL UNIQUE,
  account TEXT NOT NULL,
  caption TEXT,
  media_url TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  is_video BOOLEAN DEFAULT FALSE,
  posted_at TIMESTAMPTZ,
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_instagram_posts_account ON instagram_posts(account);

-- +goose Down
DROP TABLE IF EXISTS instagram_posts;
