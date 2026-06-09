-- +goose Up
ALTER TABLE campaigns
    ADD COLUMN IF NOT EXISTS brand VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS objective VARCHAR(50) NOT NULL DEFAULT 'Awareness',
    ADD COLUMN IF NOT EXISTS budget_spent BIGINT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS days_left INTEGER,
    ADD COLUMN IF NOT EXISTS deliverables_total INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS deliverables_completed INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS deliverables_in_review INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS hue INTEGER NOT NULL DEFAULT 220;

-- Allow in-review and archived statuses (CHECK constraint was not originally set, so just update)
ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS campaigns_status_check;

-- +goose Down
ALTER TABLE campaigns
    DROP COLUMN IF EXISTS brand,
    DROP COLUMN IF EXISTS objective,
    DROP COLUMN IF EXISTS budget_spent,
    DROP COLUMN IF EXISTS days_left,
    DROP COLUMN IF EXISTS deliverables_total,
    DROP COLUMN IF EXISTS deliverables_completed,
    DROP COLUMN IF EXISTS deliverables_in_review,
    DROP COLUMN IF EXISTS hue;
