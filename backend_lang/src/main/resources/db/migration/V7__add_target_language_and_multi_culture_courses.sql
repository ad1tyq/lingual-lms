-- Migration V7: Add target_language column and seed multi-culture courses for Korean, Spanish, and French

-- 1. Add target_language column with default 'Japanese'
ALTER TABLE courses ADD COLUMN IF NOT EXISTS target_language VARCHAR(50) DEFAULT 'Japanese';
UPDATE courses SET target_language = 'Japanese' WHERE target_language IS NULL;

-- 2. Seed Korean Cultural Modules (한국 문화 & 어학)
INSERT INTO courses (id, target_language, language, title, description, japanese_tag) VALUES
(10, 'Korean', 'K-Food & Cuisine', 'K-Food Masterclass: Kimchi, Korean BBQ & Street Food', 'Explore the rich flavors of Korean cuisine, from traditional Kimchi fermentation and Hanjeongsik feasts to bustling Seoul street food markets.', '한식'),
(11, 'Korean', 'K-Pop & Entertainment', 'The Hallyu Wave: K-Pop, Dramas & Webtoons', 'Deep dive into modern Korean entertainment, deciphering K-Drama dialogues, K-Pop fan culture, and the worldwide phenomenon of Hallyu.', '한류'),
(12, 'Korean', 'Travel & Seoul', 'Travel Korea: Seoul Palaces, Jeju Island & Transit', 'Navigate South Korea like a local: subway systems, royal Joseon palaces, KTX bullet trains, and hidden island wonders of Jeju.', '여행'),
(13, 'Korean', 'Language & Hangul', 'Hangul Mastery: Reading, Pronunciation & Honorifics', 'Master King Sejong''s scientific Hangul alphabet, batchim pronunciation rules, and essential polite honorific speech levels.', '한글'),
(14, 'Korean', 'Traditions & Heritage', 'Korean Heritage: Hanbok, Chuseok & Confucian Etiquette', 'Discover centuries of Korean heritage, ancestral rites, holiday traditions (Chuseok & Seollal), and traditional etiquette.', '전통')
ON CONFLICT (id) DO UPDATE SET
    target_language = EXCLUDED.target_language,
    language = EXCLUDED.language,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    japanese_tag = EXCLUDED.japanese_tag;

-- Seed Lessons for Korean Courses
-- Course 10: K-Food
INSERT INTO lessons (id, course_id, title, video_url, is_free, sequence_no) VALUES
(101, 10, 'The Science of Kimchi: Baechu Kimchi Fermentation & Gochugaru', 'https://www.youtube.com/watch?v=eTucCw1w6Ak', TRUE, 1),
(102, 10, 'Korean BBQ Etiquette: Ssam Wraps, Cuts of Pork & Banchan Pairing', 'https://www.youtube.com/watch?v=k1t6H67mGj0', TRUE, 2),
(103, 10, 'Gwangjang Market Night Tour: Tteokbokki, Bindaetteok & Mayak Kimbap', 'https://drive.google.com/file/d/1KoreanStreetFoodTourMastery/view', FALSE, 3),
(104, 10, 'Soju & Makgeolli Culture: Drinking Customs & Chimaek (Chicken & Beer)', 'https://drive.google.com/file/d/1KoreanDrinkingCultureGuide/view', FALSE, 4)
ON CONFLICT (id) DO UPDATE SET
    course_id = EXCLUDED.course_id,
    title = EXCLUDED.title,
    video_url = EXCLUDED.video_url,
    is_free = EXCLUDED.is_free,
    sequence_no = EXCLUDED.sequence_no;

-- Course 11: K-Pop & Entertainment
INSERT INTO lessons (id, course_id, title, video_url, is_free, sequence_no) VALUES
(105, 11, 'Decoding K-Pop Lyrics: Trendy Slang, Wordplay & English Hybrids', 'https://www.youtube.com/watch?v=gdZLi9oWNZg', TRUE, 1),
(106, 11, 'K-Drama Conversational Tropes: Romance, Melodrama & Everyday Banter', 'https://www.youtube.com/watch?v=kJQP7kiw5Fk', TRUE, 2),
(107, 11, 'Inside the K-Pop Idol Training System: Auditions, Trainees & Agency Life', 'https://drive.google.com/file/d/1KPopIndustryInsiderGuide/view', FALSE, 3)
ON CONFLICT (id) DO UPDATE SET
    course_id = EXCLUDED.course_id,
    title = EXCLUDED.title,
    video_url = EXCLUDED.video_url,
    is_free = EXCLUDED.is_free,
    sequence_no = EXCLUDED.sequence_no;

-- Course 13: Hangul Mastery
INSERT INTO lessons (id, course_id, title, video_url, is_free, sequence_no) VALUES
(108, 13, 'Hangul in 30 Minutes: Consonants, Vowels & Block Construction', 'https://www.youtube.com/watch?v=s5aobqyEaMQ', TRUE, 1),
(109, 13, 'Batchim (Final Consonant) Sound Shifts & Pronunciation Secrets', 'https://www.youtube.com/watch?v=0ZhOeA0vGMY', TRUE, 2),
(110, 13, 'Honorific Speech Levels: Banmal vs. Jondaenmal in Daily Life', 'https://drive.google.com/file/d/1KoreanHonorificsSpeechGuide/view', FALSE, 3)
ON CONFLICT (id) DO UPDATE SET
    course_id = EXCLUDED.course_id,
    title = EXCLUDED.title,
    video_url = EXCLUDED.video_url,
    is_free = EXCLUDED.is_free,
    sequence_no = EXCLUDED.sequence_no;

-- 3. Seed Spanish Cultural Modules (Cultura Española)
INSERT INTO courses (id, target_language, language, title, description, japanese_tag) VALUES
(20, 'Spanish', 'Gastronomy & Tapas', 'Spanish Cuisine: Tapas, Paella & Jamón Ibérico', 'Experience the social culinary culture of Spain: tapeo traditions, authentic Valencian paella, and cured jamón artistry.', 'Tapas'),
(21, 'Spanish', 'Music & Flamenco', 'Rhythms of Spain: Flamenco, Fiesta & Folk Heritage', 'Immerse yourself in the passionate Andalusian art of Flamenco, festive Ferias, and Spanish acoustic guitar traditions.', 'Fiesta'),
(22, 'Spanish', 'Travel & Cities', 'Travel Spain: Madrid, Barcelona & Andalusian Wonders', 'From Gaudí''s modernist Barcelona architecture to the historic Plaza Mayor of Madrid and Granada''s Alhambra palace.', 'Viaje'),
(23, 'Spanish', 'Language & Grammar', 'Spanish Fundamentals: Conversational Fluency & Pronunciation', 'Master clear Spanish pronunciation, rolled Rs, essential verb conjugations (ser vs. estar), and everyday Castilian expressions.', 'Idioma')
ON CONFLICT (id) DO UPDATE SET
    target_language = EXCLUDED.target_language,
    language = EXCLUDED.language,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    japanese_tag = EXCLUDED.japanese_tag;

-- Seed Lessons for Spanish Courses
INSERT INTO lessons (id, course_id, title, video_url, is_free, sequence_no) VALUES
(201, 20, 'The Art of Tapeo: Ordering Small Plates & Bar Culture in Seville', 'https://www.youtube.com/watch?v=gT8Y5k7l3kQ', TRUE, 1),
(202, 20, 'Authentic Valencian Paella: Socarrat, Saffron & Local Ingredients', 'https://www.youtube.com/watch?v=2B1k9A4Q3sE', TRUE, 2),
(203, 20, 'Jamón Ibérico de Bellota: Grading, Curing & Hand-Slicing Mastery', 'https://drive.google.com/file/d/1JamonIbericoCuringGuide/view', FALSE, 3),
(204, 23, 'Spanish Pronunciation Bootcamp: Vowels, Diphthongs & The Trilled R', 'https://www.youtube.com/watch?v=4d8l6e9zX1s', TRUE, 1),
(205, 23, 'Ser vs. Estar Demystified: Permanent Traits vs. Transient States', 'https://www.youtube.com/watch?v=9L8p2f7k1aB', TRUE, 2),
(206, 23, 'Subjunctive Mood Mastery: Expressing Desires, Doubts & Hopes', 'https://drive.google.com/file/d/1SpanishSubjunctiveMastery/view', FALSE, 3)
ON CONFLICT (id) DO UPDATE SET
    course_id = EXCLUDED.course_id,
    title = EXCLUDED.title,
    video_url = EXCLUDED.video_url,
    is_free = EXCLUDED.is_free,
    sequence_no = EXCLUDED.sequence_no;

-- 4. Seed French Cultural Modules (Culture Française)
INSERT INTO courses (id, target_language, language, title, description, japanese_tag) VALUES
(30, 'French', 'Cuisine & Wine', 'The Art of French Cooking: Pastries, Wine & Bistro Dining', 'Unravel the world of French gastronomy, butter-rich viennoiseries, AOC wine regions, and authentic Parisian bistro dining.', 'Cuisine'),
(31, 'French', 'Cinema & Art', 'French Culture: Impressionism, Fashion & Nouvelle Vague', 'Journey through Paris salons, the Musée d''Orsay, haute couture legacy, and French cinematic storytelling.', 'Culture'),
(32, 'French', 'Travel & Paris', 'Discover France: Paris Arrondissements, Châteaux & Riviera', 'Explore the hidden passages of Paris, the Loire Valley châteaux, and sun-soaked coastal towns of the Côte d''Azur.', 'Voyage'),
(33, 'French', 'Language & Pronunciation', 'French Mastery: Nasal Vowels, Liaisons & Everyday Verbs', 'Perfect the elegant French accent: nasal sounds, silent letters, the guttural R, and conversational French idioms.', 'Langue')
ON CONFLICT (id) DO UPDATE SET
    target_language = EXCLUDED.target_language,
    language = EXCLUDED.language,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    japanese_tag = EXCLUDED.japanese_tag;

-- Seed Lessons for French Courses
INSERT INTO lessons (id, course_id, title, video_url, is_free, sequence_no) VALUES
(301, 30, 'The French Bakery Morning: Croissants, Baguettes & Café Etiquette', 'https://www.youtube.com/watch?v=7X9m2P5k1bA', TRUE, 1),
(302, 30, 'Wine Regions of France: Bordeaux, Burgundy, Champagne & Terroir', 'https://www.youtube.com/watch?v=3K5j7R9p1qA', TRUE, 2),
(303, 30, 'Classic French Sauces: Béchamel, Velouté, Espagnole & Hollandaise', 'https://drive.google.com/file/d/1FrenchClassicSaucesGuide/view', FALSE, 3),
(304, 33, 'The French Accent Blueprint: Mastering The Guttural R & Silent Letters', 'https://www.youtube.com/watch?v=5M8n2K7p1xA', TRUE, 1),
(305, 33, 'Liaisons & Enchaînement: How French Words Flow Together Naturally', 'https://www.youtube.com/watch?v=1N7m3P9k2yB', TRUE, 2),
(306, 33, 'Real Parisian Colloquial French: Verlan, Slang & Daily Contractions', 'https://drive.google.com/file/d/1ParisianColloquialFrenchGuide/view', FALSE, 3)
ON CONFLICT (id) DO UPDATE SET
    course_id = EXCLUDED.course_id,
    title = EXCLUDED.title,
    video_url = EXCLUDED.video_url,
    is_free = EXCLUDED.is_free,
    sequence_no = EXCLUDED.sequence_no;

-- Update sequences
SELECT setval('courses_id_seq', (SELECT COALESCE(MAX(id), 1) FROM courses));
SELECT setval('lessons_id_seq', (SELECT COALESCE(MAX(id), 1) FROM lessons));
