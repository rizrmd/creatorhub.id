-- +goose Up
UPDATE creators SET category = 'beauty, lifestyle, fashion, entertainment' WHERE id = 'tasya-farasya';
UPDATE creators SET category = 'lifestyle, parenting, food, travel' WHERE id = 'rachel-vennya';
UPDATE creators SET category = 'education, entertainment, lifestyle, technology' WHERE id = 'jerome-polin';
UPDATE creators SET category = 'comedy, entertainment, lifestyle, food' WHERE id = 'fadil-jaidi';
UPDATE creators SET category = 'lifestyle, fashion, beauty, technology' WHERE id = 'arief-muhammad';
UPDATE creators SET category = 'entertainment, lifestyle, travel, beauty' WHERE id = 'nessie-judge';

-- +goose Down
UPDATE creators SET category = 'beauty' WHERE id = 'tasya-farasya';
UPDATE creators SET category = 'lifestyle' WHERE id = 'rachel-vennya';
UPDATE creators SET category = 'education' WHERE id = 'jerome-polin';
UPDATE creators SET category = 'comedy' WHERE id = 'fadil-jaidi';
UPDATE creators SET category = 'lifestyle' WHERE id = 'arief-muhammad';
UPDATE creators SET category = 'entertainment' WHERE id = 'nessie-judge';
