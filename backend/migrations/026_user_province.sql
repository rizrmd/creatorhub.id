-- +goose Up
ALTER TABLE users ADD COLUMN province VARCHAR(100) DEFAULT '';

-- +goose Down
ALTER TABLE users DROP COLUMN province;
