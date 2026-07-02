-- +goose Up
ALTER TABLE creators ALTER COLUMN engagement_rate TYPE DECIMAL(10,2);
ALTER TABLE creator_platforms ALTER COLUMN engagement_rate TYPE DECIMAL(10,2);

-- +goose Down
ALTER TABLE creators ALTER COLUMN engagement_rate TYPE DECIMAL(5,2);
ALTER TABLE creator_platforms ALTER COLUMN engagement_rate TYPE DECIMAL(5,2);
