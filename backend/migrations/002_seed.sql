-- +goose Up
INSERT INTO cities (id, name, latitude, longitude, status, creator_count) VALUES
    ('jakarta',    'Jakarta',    -6.2088,  106.8456, 'red',    342),
    ('bandung',    'Bandung',    -6.9175,  107.6191, 'orange', 187),
    ('surabaya',   'Surabaya',   -7.2575,  112.7521, 'green',  156),
    ('yogyakarta', 'Yogyakarta', -7.7956,  110.3695, 'orange',  98),
    ('bali',       'Bali',       -8.3405,  115.0920, 'green',  203),
    ('medan',      'Medan',       3.5952,   98.6722, 'green',   89),
    ('makassar',   'Makassar',   -5.1477,  119.4327, 'green',   67),
    ('balikpapan', 'Balikpapan', -1.2654,  116.8312, 'green',   45),
    ('semarang',   'Semarang',   -6.9932,  110.4203, 'orange',  72),
    ('palembang',  'Palembang',  -2.9761,  104.7754, 'green',   54),
    ('manado',     'Manado',      1.4748,  124.8421, 'green',   33)
ON CONFLICT (id) DO NOTHING;

INSERT INTO creators (id, name, city, country, category, followers, followers_text, engagement_rate, price, price_text, verified, rating, fast_response, top_rated, image_url, bio) VALUES
('reza-alvaro',  'Reza Alvaro',     'Jakarta',    'Indonesia', 'lifestyle', 532000,  '532K', 4.21,  8000000, 'Rp 8.000.000',  true,  4.8, true,  true,  '/assets/images/creator-1.png', 'Content creator lifestyle Jakarta dengan fokus pada gaya hidup urban, fashion, dan kuliner premium. Telah berkolaborasi dengan 50+ brand ternama.'),
('nadia-aurel',  'Nadia Aurellia',  'Bandung',    'Indonesia', 'beauty',    1200000, '1.2M', 3.87, 15000000, 'Rp 15.000.000', true,  4.9, true,  true,  '/assets/images/creator-2.png', 'Beauty influencer Bandung spesialis skincare dan makeup tutorial. Brand ambassador beberapa produk kecantikan lokal dan internasional.'),
('andi-pratama', 'Andi Pratama',    'Bali',       'Indonesia', 'travel',    890000,  '890K', 5.12, 12000000, 'Rp 12.000.000', true,  4.7, false, true,  '/assets/images/creator-3.png', 'Travel content creator berbasis di Bali. Mengabadikan keindahan Indonesia dan Asia Tenggara dengan gaya fotografi yang khas.'),
('sinta-dewi',   'Sinta Dewi',      'Surabaya',   'Indonesia', 'food',      445000,  '445K', 6.33,  5500000, 'Rp 5.500.000',  false, 4.6, true,  false, '/assets/images/creator-4.png', 'Food blogger dan reviewer kuliner Surabaya. Dikenal dengan ulasan jujur dan presentasi yang menggiurkan.'),
('fajar-nugroho','Fajar Nugroho',   'Jakarta',    'Indonesia', 'tech',      678000,  '678K', 3.45,  9500000, 'Rp 9.500.000',  true,  4.5, true,  true,  '/assets/images/creator-5.png', 'Tech reviewer dan unboxer gadget terpercaya. Memberikan review mendalam untuk smartphone, laptop, dan perangkat smart home.'),
('maya-putri',   'Maya Putri',      'Yogyakarta', 'Indonesia', 'lifestyle', 320000,  '320K', 4.89,  4000000, 'Rp 4.000.000',  false, 4.4, true,  false, '/assets/images/creator-6.png', 'Lifestyle creator Yogyakarta yang memadukan budaya lokal dengan tren modern. Fokus pada sustainable living dan wellness.'),
('dimas-arya',   'Dimas Arya',      'Medan',      'Indonesia', 'sports',    567000,  '567K', 7.21,  7000000, 'Rp 7.000.000',  true,  4.7, false, true,  '/assets/images/creator-7.png', 'Fitness dan sports content creator. Personal trainer bersertifikat yang berbagi tips workout dan gaya hidup sehat.'),
('lestari-ayu',  'Lestari Ayu',     'Makassar',   'Indonesia', 'beauty',    234000,  '234K', 5.67,  3000000, 'Rp 3.000.000',  false, 4.3, true,  false, '/assets/images/creator-8.png', 'Beauty content creator dari Makassar yang fokus pada produk lokal dan teknik makeup natural.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO creator_platforms (creator_id, platform) VALUES
    ('reza-alvaro',   'instagram'), ('reza-alvaro',   'tiktok'),
    ('nadia-aurel',   'instagram'), ('nadia-aurel',   'youtube'), ('nadia-aurel',   'tiktok'),
    ('andi-pratama',  'instagram'), ('andi-pratama',  'youtube'),
    ('sinta-dewi',    'instagram'), ('sinta-dewi',    'tiktok'),
    ('fajar-nugroho', 'youtube'),   ('fajar-nugroho', 'instagram'),
    ('maya-putri',    'instagram'), ('maya-putri',    'tiktok'),
    ('dimas-arya',    'instagram'), ('dimas-arya',    'youtube'), ('dimas-arya', 'tiktok'),
    ('lestari-ayu',   'instagram'), ('lestari-ayu',   'tiktok')
ON CONFLICT DO NOTHING;

INSERT INTO campaigns (title, description, status, budget) VALUES
    ('Kampanye Ramadan 2025', 'Kolaborasi kreator untuk kampanye produk Ramadan', 'active', 50000000),
    ('Brand Awareness Q1',    'Meningkatkan brand awareness melalui micro-influencer', 'draft', 25000000)
ON CONFLICT DO NOTHING;

-- +goose Down
DELETE FROM campaigns WHERE title IN ('Kampanye Ramadan 2025', 'Brand Awareness Q1');
DELETE FROM creator_platforms WHERE creator_id IN ('reza-alvaro','nadia-aurel','andi-pratama','sinta-dewi','fajar-nugroho','maya-putri','dimas-arya','lestari-ayu');
DELETE FROM creators WHERE id IN ('reza-alvaro','nadia-aurel','andi-pratama','sinta-dewi','fajar-nugroho','maya-putri','dimas-arya','lestari-ayu');
DELETE FROM cities WHERE id IN ('jakarta','bandung','surabaya','yogyakarta','bali','medan','makassar','balikpapan','semarang','palembang','manado');
