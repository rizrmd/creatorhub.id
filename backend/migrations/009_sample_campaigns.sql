-- +goose Up
INSERT INTO campaigns (id, title, description, brand, status, objective, budget, budget_spent, start_date, end_date, days_left, deliverables_total, deliverables_completed, deliverables_in_review, hue, created_at)
VALUES
    ('a1b2c3d4-0001-0001-0001-000000000001', 'Wardah Ramadan Glow 2025', 'Kampanye beauty & skincare untuk musim Ramadan dengan fokus konten tutorial makeup halal dan natural look.', 'Wardah', 'active', 'Awareness', 85000000, 42000000, '2025-03-01', '2025-04-10', 14, 12, 7, 2, 340, NOW() - INTERVAL '30 days'),
    ('a1b2c3d4-0002-0002-0002-000000000002', 'Tokopedia 12.12 Mega Sale', 'Kampanye e-commerce besar-besaran untuk event 12.12. Creator membuat konten haul, review produk, dan promo eksklusif.', 'Tokopedia', 'active', 'Conversions', 120000000, 65000000, '2025-12-01', '2025-12-15', 5, 18, 11, 4, 30, NOW() - INTERVAL '20 days'),
    ('a1b2c3d4-0003-0003-0003-000000000003', 'Indomie X Jerome Collab', 'Kolaborasi eksklusif dengan Jerome Polin untuk kampanye Indomie edisi spesial. Konten fun, edukatif, dan viral.', 'Indomie', 'in-review', 'Engagement', 45000000, 0, '2025-02-15', '2025-03-15', 0, 8, 8, 0, 48, NOW() - INTERVAL '15 days'),
    ('a1b2c3d4-0004-0004-0004-000000000004', 'BNI BYOND Super App Launch', 'Kampanye peluncuran aplikasi BNI BYOND. Konten review fitur, tutorial, dan testimoni pengguna nyata.', 'BNI', 'draft', 'Awareness', 200000000, 0, NULL, NULL, NULL, 20, 0, 0, 200, NOW() - INTERVAL '5 days'),
    ('a1b2c3d4-0005-0005-0005-000000000005', 'Gojek #PakaiGojek Lifestyle', 'Kampanye lifestyle Gojek menyasar Gen Z dan millennial. Creator berbagi cerita penggunaan Gojek dalam kehidupan sehari-hari.', 'Gojek', 'completed', 'Engagement', 95000000, 95000000, '2025-01-01', '2025-02-28', 0, 15, 15, 0, 140, NOW() - INTERVAL '60 days'),
    ('a1b2c3d4-0006-0006-0006-000000000006', 'Sociolla Beauty Festival', 'Festival kecantikan digital Sociolla. Creator beauty review produk terbaru, unboxing, dan tutorial eksklusif.', 'Sociolla', 'paused', 'Traffic', 60000000, 18000000, '2025-04-01', '2025-05-31', 21, 10, 3, 2, 320, NOW() - INTERVAL '45 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO campaign_creators (campaign_id, creator_id) VALUES
    ('a1b2c3d4-0001-0001-0001-000000000001', 'tasya-farasya'),
    ('a1b2c3d4-0001-0001-0001-000000000001', 'rachel-vennya'),
    ('a1b2c3d4-0001-0001-0001-000000000001', 'nessie-judge'),
    ('a1b2c3d4-0002-0002-0002-000000000002', 'fadil-jaidi'),
    ('a1b2c3d4-0002-0002-0002-000000000002', 'arief-muhammad'),
    ('a1b2c3d4-0002-0002-0002-000000000002', 'rachel-vennya'),
    ('a1b2c3d4-0003-0003-0003-000000000003', 'jerome-polin'),
    ('a1b2c3d4-0005-0005-0005-000000000005', 'arief-muhammad'),
    ('a1b2c3d4-0005-0005-0005-000000000005', 'fadil-jaidi'),
    ('a1b2c3d4-0006-0006-0006-000000000006', 'tasya-farasya'),
    ('a1b2c3d4-0006-0006-0006-000000000006', 'nessie-judge')
ON CONFLICT DO NOTHING;

-- +goose Down
DELETE FROM campaign_creators WHERE campaign_id IN (
    'a1b2c3d4-0001-0001-0001-000000000001',
    'a1b2c3d4-0002-0002-0002-000000000002',
    'a1b2c3d4-0003-0003-0003-000000000003',
    'a1b2c3d4-0004-0004-0004-000000000004',
    'a1b2c3d4-0005-0005-0005-000000000005',
    'a1b2c3d4-0006-0006-0006-000000000006'
);
DELETE FROM campaigns WHERE id IN (
    'a1b2c3d4-0001-0001-0001-000000000001',
    'a1b2c3d4-0002-0002-0002-000000000002',
    'a1b2c3d4-0003-0003-0003-000000000003',
    'a1b2c3d4-0004-0004-0004-000000000004',
    'a1b2c3d4-0005-0005-0005-000000000005',
    'a1b2c3d4-0006-0006-0006-000000000006'
);
