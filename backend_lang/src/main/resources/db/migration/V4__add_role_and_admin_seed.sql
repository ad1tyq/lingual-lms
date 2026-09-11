-- V4__add_role_and_admin_seed.sql
-- Add role column to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'USER';

-- Seed / Update default administrator account: admin@japan.com / AdminPass123!
INSERT INTO users (email, password_hash, subscription_status, role, created_at)
VALUES (
    'admin@japan.com',
    '$2a$12$FYLhsChBGg8a33RefDILRelP966iPMLwlyf/xIY6HiAkycAsdpEqO',
    'PRO',
    'ADMIN',
    NOW()
)
ON CONFLICT (email) DO UPDATE 
SET role = 'ADMIN', subscription_status = 'PRO', password_hash = EXCLUDED.password_hash;

-- Seed / Update default sample learner account: learner@japan.com / Password123!
INSERT INTO users (email, password_hash, subscription_status, role, created_at)
VALUES (
    'learner@japan.com',
    '$2a$12$5otcVo39oCTK6Ts.CweUMeWDR1caTPf7B3R6s5G1UQRIBIX0o0JUW',
    'FREE',
    'USER',
    NOW()
)
ON CONFLICT (email) DO UPDATE 
SET role = 'USER', subscription_status = 'FREE', password_hash = EXCLUDED.password_hash;
