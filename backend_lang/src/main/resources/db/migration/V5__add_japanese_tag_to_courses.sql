-- Migration V5: Add japanese_tag to courses table for customizable Japanese badge text
ALTER TABLE courses ADD COLUMN IF NOT EXISTS japanese_tag VARCHAR(50);

-- Populate existing Japanese categories with authentic default badge text
UPDATE courses SET japanese_tag = '語学' WHERE language ILIKE '%language%' OR language ILIKE '%writing%';
UPDATE courses SET japanese_tag = '和食' WHERE language ILIKE '%food%' OR language ILIKE '%washoku%' OR language ILIKE '%cuisine%';
UPDATE courses SET japanese_tag = '旅行' WHERE language ILIKE '%travel%' OR language ILIKE '%sightseeing%';
UPDATE courses SET japanese_tag = 'ポップ' WHERE language ILIKE '%pop%' OR language ILIKE '%anime%' OR language ILIKE '%manga%';
UPDATE courses SET japanese_tag = '伝統' WHERE language ILIKE '%tradition%' OR language ILIKE '%festival%' OR language ILIKE '%shinto%';

-- Fallback for any other courses
UPDATE courses SET japanese_tag = '日本' WHERE japanese_tag IS NULL;
