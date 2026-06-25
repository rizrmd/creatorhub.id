-- +goose Up
INSERT INTO users (email, name, role, password_hash) VALUES
    ('mediamonitoring@creatorhub.id', 'Media Monitoring', 'media_monitoring', '$2a$10$lswcPRFLRRw97g4w.3bihuGcYPNS2tVXSeE/uKBuWgtDYVylSsb6u')
ON CONFLICT (email) DO NOTHING;

-- +goose Down
DELETE FROM users WHERE email = 'mediamonitoring@creatorhub.id';
