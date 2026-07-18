INSERT INTO tours (id, title, description, "hostId", country, city, address, "basePrice", "currency", "durationDays", "minGroupSize", "maxGroupSize", category, difficulty, language, "startDate", "endDate", status, "isFeatured", "commissionRate", "bookingCount", "averageRating", "reviewCount", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'Trekking in Himalayas', 'Incredible journey through mountain trails of Nepal with Everest views', u.id, 'Nepal', 'Kathmandu', 'Thamel District', 1500, 'USD', 14, 4, 12, 'adventure', 'moderate', 'English', '2026-09-01', '2026-09-15', 'active', true, 0.15, 0, 4.8, 24, NOW(), NOW()
FROM users u LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO tours (id, title, description, "hostId", country, city, address, "basePrice", "currency", "durationDays", "minGroupSize", "maxGroupSize", category, difficulty, language, "startDate", "endDate", status, "isFeatured", "commissionRate", "bookingCount", "averageRating", "reviewCount", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'Cultural Tour Japan', 'Immerse in ancient Japanese culture: from Kyoto temples to Tokyo neon lights', u.id, 'Japan', 'Tokyo', 'Shibuya District', 2500, 'USD', 10, 2, 8, 'cultural', 'easy', 'English', '2026-10-01', '2026-10-11', 'active', true, 0.15, 0, 4.9, 31, NOW(), NOW()
FROM users u LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO tours (id, title, description, "hostId", country, city, address, "basePrice", "currency", "durationDays", "minGroupSize", "maxGroupSize", category, difficulty, language, "startDate", "endDate", status, "isFeatured", "commissionRate", "bookingCount", "averageRating", "reviewCount", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'Safari in Tanzania', 'See the Big Five in their natural habitat in Serengeti National Park', u.id, 'Tanzania', 'Arusha', 'Serengeti Gate', 3000, 'USD', 7, 2, 6, 'nature', 'easy', 'English', '2026-08-15', '2026-08-22', 'active', true, 0.15, 0, 4.7, 18, NOW(), NOW()
FROM users u LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO tours (id, title, description, "hostId", country, city, address, "basePrice", "currency", "durationDays", "minGroupSize", "maxGroupSize", category, difficulty, language, "startDate", "endDate", status, "isFeatured", "commissionRate", "bookingCount", "averageRating", "reviewCount", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'Scuba Diving Maldives', 'Explore the underwater world of Maldives with experienced instructors', u.id, 'Maldives', 'Male', 'South Malé Atoll', 1800, 'USD', 5, 2, 10, 'beach', 'easy', 'English', '2026-07-20', '2026-07-25', 'active', false, 0.15, 0, 4.6, 12, NOW(), NOW()
FROM users u LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO tours (id, title, description, "hostId", country, city, address, "basePrice", "currency", "durationDays", "minGroupSize", "maxGroupSize", category, difficulty, language, "startDate", "endDate", status, "isFeatured", "commissionRate", "bookingCount", "averageRating", "reviewCount", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'Gastro Tour Italy', 'Wine tasting and Italian cuisine in Tuscany', u.id, 'Italy', 'Florence', 'Piazza del Duomo', 1200, 'USD', 6, 4, 12, 'food', 'easy', 'Italian', '2026-09-10', '2026-09-16', 'active', false, 0.15, 0, 4.5, 8, NOW(), NOW()
FROM users u LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO tours (id, title, description, "hostId", country, city, address, "basePrice", "currency", "durationDays", "minGroupSize", "maxGroupSize", category, difficulty, language, "startDate", "endDate", status, "isFeatured", "commissionRate", "bookingCount", "averageRating", "reviewCount", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'Photography Iceland', 'Capture northern lights and dramatic landscapes of Iceland', u.id, 'Iceland', 'Reykjavik', 'Hallgrimskirkja', 2200, 'USD', 8, 2, 8, 'photography', 'moderate', 'English', '2026-11-01', '2026-11-09', 'active', true, 0.15, 0, 4.8, 15, NOW(), NOW()
FROM users u LIMIT 1
ON CONFLICT DO NOTHING;
