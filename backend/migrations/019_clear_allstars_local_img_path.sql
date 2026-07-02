-- +goose Up
UPDATE creators
SET img_path = '',
    updated_at = NOW()
WHERE bio ILIKE '%Source: allstars.id%'
  AND image_url ~* '^https?://'
  AND img_path <> '';

-- +goose Down
-- Intentionally no-op: old local data/avatars paths were not served by the app.
