-- +goose Up
ALTER TABLE creators ADD COLUMN tags TEXT[] DEFAULT '{}';

-- +goose Down
ALTER TABLE creators DROP COLUMN tags;
