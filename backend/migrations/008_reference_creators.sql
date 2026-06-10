-- +goose Up
INSERT INTO creators (id, name, handle, city, country, category, followers, followers_text, engagement_rate, price, price_text, verified, rating, fast_response, top_rated, image_url, star_creator, hue, focus, bio, last_seen, img_path)
VALUES
    ('tasya-farasya',  'Tasya Farasya',  'tasyafarasya',   'Jakarta', 'Indonesia', 'beauty',        5200000, '5.2M', 3.42, 35000000, 'Rp 35.000.000', true,  4.9, true,  true, '/creators/tasya-farasya.png',  true,  340, '50% 25%', 'Beauty & makeup artist terkemuka Indonesia. Brand ambassador 20+ brand kecantikan lokal & internasional.', '', ''),
    ('rachel-vennya',  'Rachel Vennya',  'rachelvennya',   'Jakarta', 'Indonesia', 'lifestyle',     4100000, '4.1M', 4.15, 28000000, 'Rp 28.000.000', true,  4.8, true,  true, '/creators/rachel-vennya.png',  true,   30, '50% 20%', 'Lifestyle & parenting content creator. Mom influencer #1 Indonesia dengan komunitas aktif 4+ juta follower.', '', ''),
    ('jerome-polin',   'Jerome Polin',   'jeromepolin',    'Jakarta', 'Indonesia', 'education',     3800000, '3.8M', 5.23, 22000000, 'Rp 22.000.000', true,  4.9, false, true, '/creators/jerome-polin.png',   true,   48, '50% 15%', 'Edukasi & entertainment. Mahasiswa Indonesia di Waseda University yang viral dengan konten matematika & kehidupan Jepang.', '', ''),
    ('fadil-jaidi',    'Fadil Jaidi',    'fadiljaidi',     'Jakarta', 'Indonesia', 'comedy',        5500000, '5.5M', 6.87, 40000000, 'Rp 40.000.000', true,  4.8, true,  true, '/creators/fadil-jaidi.png',    true,  200, '50% 20%', 'King of comedy Indonesia. Konten humor yang selalu viral dan menghibur jutaan penonton setiap hari.', '', ''),
    ('arief-muhammad', 'Arief Muhammad', 'ariefmuhammad',  'Jakarta', 'Indonesia', 'lifestyle',     4300000, '4.3M', 3.91, 32000000, 'Rp 32.000.000', true,  4.7, true,  true, '/creators/arief-muhammad.png', true,  140, '50% 20%', 'Lifestyle & fashion influencer. CEO brand lokal yang sukses, berbagi inspirasi gaya hidup dan bisnis.', '', ''),
    ('nessie-judge',   'Nessie Judge',   'nessiejudge',    'Jakarta', 'Indonesia', 'entertainment', 2800000, '2.8M', 4.56, 18000000, 'Rp 18.000.000', true,  4.7, false, true, '/creators/nessie-judge.png',   false, 250, '50% 25%', 'Entertainment & lifestyle creator. Dikenal dengan konten review, lifestyle Bali, dan kolaborasi brand premium.', '', '')
ON CONFLICT (id) DO UPDATE SET
    name            = EXCLUDED.name,
    handle          = EXCLUDED.handle,
    city            = EXCLUDED.city,
    country         = EXCLUDED.country,
    category        = EXCLUDED.category,
    followers       = EXCLUDED.followers,
    followers_text  = EXCLUDED.followers_text,
    engagement_rate = EXCLUDED.engagement_rate,
    price           = EXCLUDED.price,
    price_text      = EXCLUDED.price_text,
    verified        = EXCLUDED.verified,
    rating          = EXCLUDED.rating,
    fast_response   = EXCLUDED.fast_response,
    top_rated       = EXCLUDED.top_rated,
    image_url       = EXCLUDED.image_url,
    star_creator    = EXCLUDED.star_creator,
    hue             = EXCLUDED.hue,
    focus           = EXCLUDED.focus,
    bio             = EXCLUDED.bio,
    updated_at      = NOW();

INSERT INTO creator_platforms (creator_id, platform) VALUES
    ('tasya-farasya',  'instagram'),
    ('tasya-farasya',  'youtube'),
    ('tasya-farasya',  'tiktok'),
    ('rachel-vennya',  'instagram'),
    ('rachel-vennya',  'tiktok'),
    ('jerome-polin',   'instagram'),
    ('jerome-polin',   'youtube'),
    ('jerome-polin',   'tiktok'),
    ('fadil-jaidi',    'instagram'),
    ('fadil-jaidi',    'tiktok'),
    ('arief-muhammad', 'instagram'),
    ('arief-muhammad', 'tiktok'),
    ('nessie-judge',   'instagram'),
    ('nessie-judge',   'youtube')
ON CONFLICT DO NOTHING;

-- +goose Down
DELETE FROM creator_platforms WHERE creator_id IN (
    'tasya-farasya', 'rachel-vennya', 'jerome-polin',
    'fadil-jaidi', 'arief-muhammad', 'nessie-judge'
);

DELETE FROM creators WHERE id IN (
    'tasya-farasya', 'rachel-vennya', 'jerome-polin',
    'fadil-jaidi', 'arief-muhammad', 'nessie-judge'
);
