-- +goose Up
-- +goose StatementBegin
INSERT INTO creators (
    id, name, city, country, category, followers, followers_text, engagement_rate,
    price, price_text, verified, rating, fast_response, top_rated, image_url, bio,
    created_at, updated_at, handle, hue, star_creator, last_seen, focus, img_path
)
SELECT
    '7558639', name, city, country, category, followers, followers_text, engagement_rate,
    price, price_text, verified, rating, fast_response, top_rated, image_url, bio,
    created_at, NOW(), '7558639', hue, star_creator, last_seen, focus, img_path
FROM creators
WHERE id = 'youtube'
  AND handle = 'youtube'
  AND image_url = 'https://member.allstars.id/storage/avatar/youtube/UCfoZkKr2dYVjICgUKJIBVLQ.jpg'
  AND bio ILIKE '%Source: allstars.id%'
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    city = EXCLUDED.city,
    country = EXCLUDED.country,
    category = EXCLUDED.category,
    followers = EXCLUDED.followers,
    followers_text = EXCLUDED.followers_text,
    engagement_rate = EXCLUDED.engagement_rate,
    verified = EXCLUDED.verified,
    image_url = EXCLUDED.image_url,
    bio = EXCLUDED.bio,
    updated_at = NOW(),
    handle = EXCLUDED.handle,
    img_path = EXCLUDED.img_path;

INSERT INTO creator_platforms (
    creator_id, platform, followers, engagement_rate, handle, profile_picture_url, platform_followers
)
SELECT
    '7558639', platform, followers, engagement_rate, '7558639', profile_picture_url, platform_followers
FROM creator_platforms
WHERE creator_id = 'youtube'
  AND platform = 'youtube'
  AND handle = 'youtube'
  AND profile_picture_url = 'https://member.allstars.id/storage/avatar/youtube/UCfoZkKr2dYVjICgUKJIBVLQ.jpg'
ON CONFLICT (creator_id, platform) DO UPDATE SET
    followers = EXCLUDED.followers,
    engagement_rate = EXCLUDED.engagement_rate,
    handle = EXCLUDED.handle,
    profile_picture_url = EXCLUDED.profile_picture_url,
    platform_followers = EXCLUDED.platform_followers;

DELETE FROM creators
WHERE id = 'youtube'
  AND handle = 'youtube'
  AND image_url = 'https://member.allstars.id/storage/avatar/youtube/UCfoZkKr2dYVjICgUKJIBVLQ.jpg'
  AND bio ILIKE '%Source: allstars.id%';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
INSERT INTO creators (
    id, name, city, country, category, followers, followers_text, engagement_rate,
    price, price_text, verified, rating, fast_response, top_rated, image_url, bio,
    created_at, updated_at, handle, hue, star_creator, last_seen, focus, img_path
)
SELECT
    'youtube', name, city, country, category, followers, followers_text, engagement_rate,
    price, price_text, verified, rating, fast_response, top_rated, image_url, bio,
    created_at, NOW(), 'youtube', hue, star_creator, last_seen, focus, img_path
FROM creators
WHERE id = '7558639'
  AND handle = '7558639'
  AND image_url = 'https://member.allstars.id/storage/avatar/youtube/UCfoZkKr2dYVjICgUKJIBVLQ.jpg'
  AND bio ILIKE '%Source: allstars.id%'
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    city = EXCLUDED.city,
    country = EXCLUDED.country,
    category = EXCLUDED.category,
    followers = EXCLUDED.followers,
    followers_text = EXCLUDED.followers_text,
    engagement_rate = EXCLUDED.engagement_rate,
    verified = EXCLUDED.verified,
    image_url = EXCLUDED.image_url,
    bio = EXCLUDED.bio,
    updated_at = NOW(),
    handle = EXCLUDED.handle,
    img_path = EXCLUDED.img_path;

INSERT INTO creator_platforms (
    creator_id, platform, followers, engagement_rate, handle, profile_picture_url, platform_followers
)
SELECT
    'youtube', platform, followers, engagement_rate, 'youtube', profile_picture_url, platform_followers
FROM creator_platforms
WHERE creator_id = '7558639'
  AND platform = 'youtube'
  AND handle = '7558639'
  AND profile_picture_url = 'https://member.allstars.id/storage/avatar/youtube/UCfoZkKr2dYVjICgUKJIBVLQ.jpg'
ON CONFLICT (creator_id, platform) DO UPDATE SET
    followers = EXCLUDED.followers,
    engagement_rate = EXCLUDED.engagement_rate,
    handle = EXCLUDED.handle,
    profile_picture_url = EXCLUDED.profile_picture_url,
    platform_followers = EXCLUDED.platform_followers;

DELETE FROM creators
WHERE id = '7558639'
  AND handle = '7558639'
  AND image_url = 'https://member.allstars.id/storage/avatar/youtube/UCfoZkKr2dYVjICgUKJIBVLQ.jpg'
  AND bio ILIKE '%Source: allstars.id%';
-- +goose StatementEnd
