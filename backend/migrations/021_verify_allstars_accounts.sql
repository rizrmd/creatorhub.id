-- +goose Up
-- +goose StatementBegin
UPDATE creator_platforms cp
SET platform = 'x'
WHERE cp.platform = 'twitter'
  AND NOT EXISTS (
    SELECT 1
    FROM creator_platforms existing
    WHERE existing.creator_id = cp.creator_id
      AND existing.platform = 'x'
  );

DELETE FROM creator_platforms cp
WHERE cp.platform = 'twitter'
  AND EXISTS (
    SELECT 1
    FROM creator_platforms existing
    WHERE existing.creator_id = cp.creator_id
      AND existing.platform = 'x'
  );

UPDATE creator_platforms cp
SET handle = c.name
FROM creators c
WHERE c.id = cp.creator_id
  AND c.bio ILIKE '%Source: allstars.id%'
  AND cp.platform IN ('instagram', 'tiktok')
  AND cp.handle LIKE '%-%'
  AND c.name ~ '^[A-Za-z0-9._]{2,30}$'
  AND c.name !~ '^[0-9]+$'
  AND c.name !~ '\.\.';

UPDATE creators c
SET handle = c.name,
    updated_at = NOW()
WHERE c.bio ILIKE '%Source: allstars.id%'
  AND c.handle LIKE '%-%'
  AND c.name ~ '^[A-Za-z0-9._]{2,30}$'
  AND c.name !~ '^[0-9]+$'
  AND c.name !~ '\.\.'
  AND EXISTS (
    SELECT 1
    FROM creator_platforms cp
    WHERE cp.creator_id = c.id
      AND cp.platform IN ('instagram', 'tiktok')
  );

UPDATE creators c
SET engagement_rate = ROUND((c.engagement_rate / 100)::numeric, 2),
    updated_at = NOW()
WHERE c.bio ILIKE '%Source: allstars.id%'
  AND c.engagement_rate > 0;

UPDATE creator_platforms cp
SET engagement_rate = ROUND((cp.engagement_rate / 100)::numeric, 2)
FROM creators c
WHERE c.id = cp.creator_id
  AND c.bio ILIKE '%Source: allstars.id%'
  AND cp.engagement_rate > 0;

UPDATE creators c
SET verified = EXISTS (
    SELECT 1
    FROM creator_platforms cp
    WHERE cp.creator_id = c.id
      AND cp.followers > 0
      AND cp.handle <> ''
      AND cp.handle !~ '^[0-9]+$'
      AND (
        (
          cp.platform IN ('instagram', 'tiktok')
          AND cp.handle ~ '^[A-Za-z0-9._]{2,30}$'
          AND cp.handle !~ '\.\.'
        )
        OR (
          cp.platform = 'youtube'
          AND cp.handle ~ '^[A-Za-z0-9._-]{2,100}$'
        )
        OR (
          cp.platform = 'x'
          AND cp.handle ~ '^[A-Za-z0-9_]{1,15}$'
        )
      )
  ),
  updated_at = NOW()
WHERE c.bio ILIKE '%Source: allstars.id%'
  AND c.followers > 0
  AND c.engagement_rate BETWEEN 0 AND 100
  AND c.image_url ~* '^https?://';

UPDATE creators c
SET verified = false,
    updated_at = NOW()
WHERE c.bio ILIKE '%Source: allstars.id%'
  AND (
    c.followers <= 0
    OR c.engagement_rate < 0
    OR c.engagement_rate > 100
    OR c.image_url !~* '^https?://'
  );
-- +goose StatementEnd

-- +goose Down
-- Intentionally no-op: this migration corrects scraped Allstars data quality.
