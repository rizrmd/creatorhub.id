-- +goose Up
ALTER TABLE creator_platforms
  ADD COLUMN IF NOT EXISTS followers BIGINT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS engagement_rate DECIMAL(5,2) NOT NULL DEFAULT 0;

-- Tasya Farasya
UPDATE creator_platforms SET followers = 3200000, engagement_rate = 3.80 WHERE creator_id = 'tasya-farasya' AND platform = 'instagram';
UPDATE creator_platforms SET followers = 1200000, engagement_rate = 2.90 WHERE creator_id = 'tasya-farasya' AND platform = 'youtube';
UPDATE creator_platforms SET followers = 800000,  engagement_rate = 4.10 WHERE creator_id = 'tasya-farasya' AND platform = 'tiktok';

-- Rachel Vennya
UPDATE creator_platforms SET followers = 2500000, engagement_rate = 4.50 WHERE creator_id = 'rachel-vennya' AND platform = 'instagram';
UPDATE creator_platforms SET followers = 1600000, engagement_rate = 3.80 WHERE creator_id = 'rachel-vennya' AND platform = 'tiktok';

-- Jerome Polin
UPDATE creator_platforms SET followers = 1800000, engagement_rate = 5.80 WHERE creator_id = 'jerome-polin' AND platform = 'instagram';
UPDATE creator_platforms SET followers = 1500000, engagement_rate = 5.10 WHERE creator_id = 'jerome-polin' AND platform = 'youtube';
UPDATE creator_platforms SET followers = 500000,  engagement_rate = 4.70 WHERE creator_id = 'jerome-polin' AND platform = 'tiktok';

-- Fadil Jaidi
UPDATE creator_platforms SET followers = 3000000, engagement_rate = 7.50 WHERE creator_id = 'fadil-jaidi' AND platform = 'instagram';
UPDATE creator_platforms SET followers = 2500000, engagement_rate = 6.20 WHERE creator_id = 'fadil-jaidi' AND platform = 'tiktok';

-- Arief Muhammad
UPDATE creator_platforms SET followers = 2800000, engagement_rate = 4.20 WHERE creator_id = 'arief-muhammad' AND platform = 'instagram';
UPDATE creator_platforms SET followers = 1500000, engagement_rate = 3.50 WHERE creator_id = 'arief-muhammad' AND platform = 'tiktok';

-- Nessie Judge
UPDATE creator_platforms SET followers = 1600000, engagement_rate = 4.90 WHERE creator_id = 'nessie-judge' AND platform = 'instagram';
UPDATE creator_platforms SET followers = 1200000, engagement_rate = 4.20 WHERE creator_id = 'nessie-judge' AND platform = 'youtube';

-- +goose Down
ALTER TABLE creator_platforms DROP COLUMN IF EXISTS engagement_rate;
ALTER TABLE creator_platforms DROP COLUMN IF EXISTS followers;
