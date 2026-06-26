-- +goose Up
INSERT INTO users (email, name, role, password_hash) VALUES
    ('tuffa@creatorhub.id', 'Tuffa', 'admin', '$2a$10$2DoPxQtySWiorgUeog0dkuq5NKj40.y0TIPQ4IGq/xTDEcWqZnT8y')
ON CONFLICT (email) DO NOTHING;

-- +goose Down
DELETE FROM users WHERE email = 'tuffa@creatorhub.id';
