-- +goose Up
INSERT INTO users (email, name, role, password_hash) VALUES
    ('kreator@creatorhub.id', 'Rina Pratiwi', 'kreator', '$2a$10$HPKsVfkB05z245ZxGB6KTe7pBaigj9rh4FgzvmE85ILVmYzr8rtCi')
ON CONFLICT (email) DO NOTHING;

-- +goose Down
DELETE FROM users WHERE email = 'kreator@creatorhub.id';