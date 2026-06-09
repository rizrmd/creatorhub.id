-- +goose Up
ALTER TABLE creators
    ADD COLUMN IF NOT EXISTS handle VARCHAR(100) NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS hue INTEGER NOT NULL DEFAULT 220,
    ADD COLUMN IF NOT EXISTS star_creator BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS last_seen VARCHAR(100) NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS focus VARCHAR(50) NOT NULL DEFAULT '50% 25%',
    ADD COLUMN IF NOT EXISTS img_path VARCHAR(255) NOT NULL DEFAULT '';

-- Update existing creators with handoff data
UPDATE creators SET handle = 'rezaalvaro',    hue = 220, star_creator = true  WHERE id = 'reza-alvaro';
UPDATE creators SET handle = 'nadiaaurel',    hue = 340, star_creator = true  WHERE id = 'nadia-aurel';
UPDATE creators SET handle = 'andipratama',   hue = 200, star_creator = true  WHERE id = 'andi-pratama';
UPDATE creators SET handle = 'sintadewi',     hue = 30,  star_creator = false WHERE id = 'sinta-dewi';
UPDATE creators SET handle = 'fajarnugroho',  hue = 48,  star_creator = true  WHERE id = 'fajar-nugroho';
UPDATE creators SET handle = 'mayaputri',     hue = 250, star_creator = false WHERE id = 'maya-putri';
UPDATE creators SET handle = 'dimasarya',     hue = 140, star_creator = true  WHERE id = 'dimas-arya';
UPDATE creators SET handle = 'lestariayu',    hue = 175, star_creator = false WHERE id = 'lestari-ayu';

-- +goose Down
ALTER TABLE creators
    DROP COLUMN IF EXISTS handle,
    DROP COLUMN IF EXISTS hue,
    DROP COLUMN IF EXISTS star_creator,
    DROP COLUMN IF EXISTS last_seen,
    DROP COLUMN IF EXISTS focus,
    DROP COLUMN IF EXISTS img_path;
