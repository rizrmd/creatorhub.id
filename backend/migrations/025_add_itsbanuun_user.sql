-- +goose Up
INSERT INTO users (email, name, role, password_hash)
VALUES ('itsbanuun@creatorhub.id', 'Ainul Mardhiah Lubis', 'ekrafhub', '$2a$10$STX58llIrDfI6Fckx1W/F.d.H97.1xTCbezXtb/3JaGEmJr5SNepO')
ON CONFLICT (email) DO NOTHING;

-- +goose Down
DELETE FROM users WHERE email = 'itsbanuun@creatorhub.id';
