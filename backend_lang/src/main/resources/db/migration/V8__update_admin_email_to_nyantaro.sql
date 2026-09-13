-- V8__update_admin_email_to_nyantaro.sql
-- Update default administrator email from admin@japan.com to admin@nyantaro.com

UPDATE users 
SET email = 'admin@nyantaro.com' 
WHERE email = 'admin@japan.com';

INSERT INTO users (email, username, password_hash, subscription_status, role, created_at)
VALUES (
    'admin@nyantaro.com',
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
