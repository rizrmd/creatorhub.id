-- +goose Up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS creators (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT '',
    country VARCHAR(100) NOT NULL DEFAULT 'Indonesia',
    category VARCHAR(50) NOT NULL DEFAULT '',
    followers BIGINT NOT NULL DEFAULT 0,
    followers_text VARCHAR(20) NOT NULL DEFAULT '',
    engagement_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    price BIGINT NOT NULL DEFAULT 0,
    price_text VARCHAR(50) NOT NULL DEFAULT '',
    verified BOOLEAN NOT NULL DEFAULT false,
    rating DECIMAL(3,2) NOT NULL DEFAULT 0,
    fast_response BOOLEAN NOT NULL DEFAULT false,
    top_rated BOOLEAN NOT NULL DEFAULT false,
    image_url TEXT NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS creator_platforms (
    creator_id TEXT NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    PRIMARY KEY (creator_id, platform)
);

CREATE TABLE IF NOT EXISTS cities (
    id TEXT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'green',
    creator_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    budget BIGINT NOT NULL DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_creators (
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    creator_id TEXT NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (campaign_id, creator_id)
);

CREATE TABLE IF NOT EXISTS chat_channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id TEXT NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (creator_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID NOT NULL REFERENCES chat_channels(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'creator')),
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_creators_category ON creators(category);
CREATE INDEX IF NOT EXISTS idx_creators_city ON creators(city);
CREATE INDEX IF NOT EXISTS idx_creators_followers ON creators(followers DESC);
CREATE INDEX IF NOT EXISTS idx_creators_rating ON creators(rating DESC);
CREATE INDEX IF NOT EXISTS idx_creators_verified ON creators(verified);
CREATE INDEX IF NOT EXISTS idx_messages_channel_id ON messages(channel_id, created_at);
CREATE INDEX IF NOT EXISTS idx_campaign_creators_campaign_id ON campaign_creators(campaign_id);

-- +goose Down
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS chat_channels;
DROP TABLE IF EXISTS campaign_creators;
DROP TABLE IF EXISTS campaigns;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS creator_platforms;
DROP TABLE IF EXISTS creators;
