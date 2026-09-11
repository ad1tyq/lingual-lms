-- V6__add_admin_username_and_dashboard_stats.sql
-- Add username column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100);
CREATE UNIQUE INDEX IF NOT EXISTS uq_users_username ON users(LOWER(username)) WHERE username IS NOT NULL;

-- Ensure administrator account has username = 'admin' and password = 'pass-neko-maneki-word'
-- BCrypt hash for 'pass-neko-maneki-word' ($2a$10$STOl6X/a.4EULzFOeRIdPuFKBtdKGfL4lgctkYlOhL4Knsy0qcoGu)
INSERT INTO users (email, username, password_hash, subscription_status, role, created_at)
VALUES (
    'admin@japan.com',
    'admin',
    '$2a$10$STOl6X/a.4EULzFOeRIdPuFKBtdKGfL4lgctkYlOhL4Knsy0qcoGu',
    'PRO',
    'ADMIN',
    NOW() - INTERVAL '60 days'
)
ON CONFLICT (email) DO UPDATE 
SET username = 'admin',
    role = 'ADMIN',
    subscription_status = 'PRO',
    password_hash = '$2a$10$STOl6X/a.4EULzFOeRIdPuFKBtdKGfL4lgctkYlOhL4Knsy0qcoGu';

-- Seed / Update sample students for monitoring
INSERT INTO users (email, username, password_hash, subscription_status, role, created_at)
VALUES 
(
    'kenji.sato@example.com',
    'kenji_sato',
    '$2a$12$5otcVo39oCTK6Ts.CweUMeWDR1caTPf7B3R6s5G1UQRIBIX0o0JUW',
    'PRO',
    'USER',
    NOW() - INTERVAL '28 days'
),
(
    'sakura.tanaka@example.com',
    'sakura_t',
    '$2a$12$5otcVo39oCTK6Ts.CweUMeWDR1caTPf7B3R6s5G1UQRIBIX0o0JUW',
    'PRO',
    'USER',
    NOW() - INTERVAL '21 days'
),
(
    'alex.miller@example.com',
    'alex_nihongo',
    '$2a$12$5otcVo39oCTK6Ts.CweUMeWDR1caTPf7B3R6s5G1UQRIBIX0o0JUW',
    'FREE',
    'USER',
    NOW() - INTERVAL '14 days'
),
(
    'yuki.t@example.com',
    'yuki_tokyo',
    '$2a$12$5otcVo39oCTK6Ts.CweUMeWDR1caTPf7B3R6s5G1UQRIBIX0o0JUW',
    'PRO',
    'USER',
    NOW() - INTERVAL '10 days'
),
(
    'elena.r@example.com',
    'elena_jp',
    '$2a$12$5otcVo39oCTK6Ts.CweUMeWDR1caTPf7B3R6s5G1UQRIBIX0o0JUW',
    'FREE',
    'USER',
    NOW() - INTERVAL '5 days'
),
(
    'marcus.chen@example.com',
    'marcus_c',
    '$2a$12$5otcVo39oCTK6Ts.CweUMeWDR1caTPf7B3R6s5G1UQRIBIX0o0JUW',
    'FREE',
    'USER',
    NOW() - INTERVAL '1 day'
)
ON CONFLICT (email) DO UPDATE 
SET username = EXCLUDED.username,
    subscription_status = EXCLUDED.subscription_status;

-- Seed some sample user progress for the monitoring table
INSERT INTO user_progress (user_id, lesson_id, completed, last_watched_at)
SELECT u.id, l.id, true, NOW() - INTERVAL '2 hours'
FROM users u
CROSS JOIN (SELECT id FROM lessons LIMIT 2) l
WHERE u.email IN ('kenji.sato@example.com', 'sakura.tanaka@example.com')
ON CONFLICT (user_id, lesson_id) DO NOTHING;
