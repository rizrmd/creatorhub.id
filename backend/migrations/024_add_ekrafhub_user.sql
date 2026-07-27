-- +goose Up
INSERT INTO users (email, name, role, password_hash)
VALUES ('ekrafhub@creatorhub.id', 'Ekraf Hub', 'ekrafhub', '$2a$10$osyo.qrzVFUxFgqRGyZRAOOSTFsvaRfG9Bo9mGwVbEI7qMcjwf7P2')
ON CONFLICT (email) DO NOTHING;

-- +goose Down
DELETE FROM users WHERE email = 'ekrafhub@creatorhub.id';
