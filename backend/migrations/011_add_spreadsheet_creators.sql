-- +goose Up
INSERT INTO creators (id, name, handle, city, country, category, followers, followers_text,
    engagement_rate, price, price_text, verified, rating, fast_response, top_rated,
    image_url, bio, star_creator, hue)
VALUES
    ('rahadi-wangsapermana', 'Rahadi Wangsapermana', 'rahadi_wangsapermana', 'Bali', 'Indonesia', 'lifestyle',
     0, '', 0, 0, '', false, 0, false, false,
     '/creators/rahadi-wangsapermana.jpg', 'Content creator from Bali - Jakarta. Active on TikTok and Instagram.', false, 220),
    ('maria-marpnjtn', 'Maria', 'marpnjtn', 'Jakarta', 'Indonesia', 'lifestyle',
     0, '', 0, 0, '', false, 0, false, false,
     '', 'Content creator. Instagram: @marpnjtn', false, 340)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, handle = EXCLUDED.handle, city = EXCLUDED.city,
    bio = EXCLUDED.bio, image_url = CASE WHEN EXCLUDED.image_url = '' THEN creators.image_url ELSE EXCLUDED.image_url END,
    updated_at = NOW();

INSERT INTO creator_platforms (creator_id, platform) VALUES
    ('rahadi-wangsapermana', 'instagram'),
    ('rahadi-wangsapermana', 'tiktok'),
    ('maria-marpnjtn', 'instagram')
ON CONFLICT DO NOTHING;

-- +goose Down
DELETE FROM creator_platforms WHERE creator_id IN ('rahadi-wangsapermana', 'maria-marpnjtn');
DELETE FROM creators WHERE id IN ('rahadi-wangsapermana', 'maria-marpnjtn');
