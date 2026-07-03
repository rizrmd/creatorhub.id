-- +goose Up
UPDATE creator_platforms cp
SET handle = c.name
FROM creators c
WHERE c.id = cp.creator_id
  AND c.bio ILIKE '%Source: allstars.id%'
  AND cp.platform IN ('instagram', 'tiktok')
  AND c.name ~ '^[A-Za-z0-9._]{2,30}$'
  AND c.name !~ '^[0-9]+$'
  AND c.name !~ '\.\.'
  AND cp.handle <> c.name;

UPDATE creators c
SET handle = c.name,
    updated_at = NOW()
WHERE c.bio ILIKE '%Source: allstars.id%'
  AND c.name ~ '^[A-Za-z0-9._]{2,30}$'
  AND c.name !~ '^[0-9]+$'
  AND c.name !~ '\.\.'
  AND c.handle <> c.name
  AND EXISTS (
    SELECT 1
    FROM creator_platforms cp
    WHERE cp.creator_id = c.id
      AND cp.platform IN ('instagram', 'tiktok')
  );

-- +goose Down
-- Intentionally no-op: this migration restores platform handles from Allstars names.
