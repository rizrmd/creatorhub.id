-- +goose Up
INSERT INTO users (email, name, role, password_hash)
VALUES ('andyjobs@creatorhub.id', 'Andy Jobs', 'admin', '$2a$10$NJ6rbYugd5j7tW3dFojmBOZYDuJ68M/cyHT16ARAN9Qqa.RjjV6XK')
ON CONFLICT (email) DO NOTHING;

-- +goose Down
DELETE FROM users WHERE email = 'andyjobs@creatorhub.id';
