-- +goose Up
UPDATE creators SET image_url = 'https://randomuser.me/api/portraits/men/32.jpg'   WHERE id = 'reza-alvaro';
UPDATE creators SET image_url = 'https://randomuser.me/api/portraits/women/44.jpg' WHERE id = 'nadia-aurel';
UPDATE creators SET image_url = 'https://randomuser.me/api/portraits/men/55.jpg'   WHERE id = 'andi-pratama';
UPDATE creators SET image_url = 'https://randomuser.me/api/portraits/women/68.jpg' WHERE id = 'sinta-dewi';
UPDATE creators SET image_url = 'https://randomuser.me/api/portraits/men/22.jpg'   WHERE id = 'fajar-nugroho';
UPDATE creators SET image_url = 'https://randomuser.me/api/portraits/women/51.jpg' WHERE id = 'maya-putri';
UPDATE creators SET image_url = 'https://randomuser.me/api/portraits/men/78.jpg'   WHERE id = 'dimas-arya';
UPDATE creators SET image_url = 'https://randomuser.me/api/portraits/women/35.jpg' WHERE id = 'lestari-ayu';

-- +goose Down
UPDATE creators SET image_url = '/assets/images/creator-1.png' WHERE id = 'reza-alvaro';
UPDATE creators SET image_url = '/assets/images/creator-2.png' WHERE id = 'nadia-aurel';
UPDATE creators SET image_url = '/assets/images/creator-3.png' WHERE id = 'andi-pratama';
UPDATE creators SET image_url = '/assets/images/creator-4.png' WHERE id = 'sinta-dewi';
UPDATE creators SET image_url = '/assets/images/creator-5.png' WHERE id = 'fajar-nugroho';
UPDATE creators SET image_url = '/assets/images/creator-6.png' WHERE id = 'maya-putri';
UPDATE creators SET image_url = '/assets/images/creator-7.png' WHERE id = 'dimas-arya';
UPDATE creators SET image_url = '/assets/images/creator-8.png' WHERE id = 'lestari-ayu';
