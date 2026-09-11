-- V3__japanese_culture_categories.sql
-- Clear old generic placeholder data
DELETE FROM user_progress WHERE lesson_id IN (SELECT id FROM lessons);
DELETE FROM lessons WHERE course_id IN (1, 2);
DELETE FROM courses WHERE id IN (1, 2);

-- Insert Japanese Culture & Language Categories
INSERT INTO courses (id, language, title, description) VALUES
(1, 'Language & Writing', 'Japanese Language: Hiragana, Kanji & Grammar', 'Master the Japanese writing systems (Hiragana, Katakana, Kanji) and essential grammar patterns for JLPT N5/N4 proficiency.'),
(2, 'Food & Cuisine', 'Washoku: The Art of Japanese Gastronomy', 'Discover the rich traditions of Japanese cuisine, from sushi etiquette and regional ramen styles to Izakaya dining and tea ceremonies.'),
(3, 'Travel & Sightseeing', 'Travel Japan: Tokyo, Kyoto & Hidden Wonders', 'Comprehensive guide to exploring Japan like a local, navigating the Shinkansen, visiting sacred shrines, and respecting onsen etiquette.'),
(4, 'Traditions & Festivals', 'Japanese Heritage: Shinto, Matsuri & Rituals', 'Immerse yourself in centuries-old Japanese customs, temple rituals, seasonal Matsuri festivals, and the philosophy of Wabi-Sabi.'),
(5, 'Pop Culture & Anime', 'Modern Japan: Anime, Manga & Akihabara', 'Explore Japan''s dynamic modern entertainment, anime dialogue breakdown, manga craftsmanship, and Akihabara subculture.')
ON CONFLICT (id) DO UPDATE SET
    language = EXCLUDED.language,
    title = EXCLUDED.title,
    description = EXCLUDED.description;

-- Seed Lessons for Category 1: Language & Writing (Lessons 1 & 2 Free, 3 & 4 Paid)
INSERT INTO lessons (id, course_id, title, video_url, is_free, sequence_no) VALUES
(1, 1, 'Hiragana & Katakana Masterclass: Strokes & Pronunciation', 'https://www.youtube.com/watch?v=6p9Il_j0zjc', TRUE, 1),
(2, 1, 'Essential Particles & Word Order: は (wa), を (o), に (ni), で (de)', 'https://www.youtube.com/watch?v=k74yjmfFb_A', TRUE, 2),
(3, 1, 'First 100 Kanji: Radicals, Mnemonics & Readings', 'https://drive.google.com/file/d/1JapaneseKanjiRadicalsMastery/view', FALSE, 3),
(4, 1, 'Polite Verb Conjugations & Everyday Keigo Expressions', 'https://drive.google.com/file/d/1JapaneseKeigoVerbConjugations/view', FALSE, 4)
ON CONFLICT (id) DO UPDATE SET
    course_id = EXCLUDED.course_id,
    title = EXCLUDED.title,
    video_url = EXCLUDED.video_url,
    is_free = EXCLUDED.is_free,
    sequence_no = EXCLUDED.sequence_no;

-- Seed Lessons for Category 2: Food & Cuisine (Lessons 5 & 6 Free, 7 & 8 Paid)
INSERT INTO lessons (id, course_id, title, video_url, is_free, sequence_no) VALUES
(5, 2, 'The Soul of Washoku: Dashi Broth, Umami & Table Manners', 'https://www.youtube.com/watch?v=0bMA2Zf_W1I', TRUE, 1),
(6, 2, 'Ramen Styles Across Japan: Tonkotsu, Shoyu, Miso & Tsukemen', 'https://www.youtube.com/watch?v=63W9rLgD1XU', TRUE, 2),
(7, 2, 'Matcha & The Japanese Tea Ceremony (Chado)', 'https://drive.google.com/file/d/1JapaneseTeaCeremonyMatchaGuide/view', FALSE, 3),
(8, 2, 'Izakaya Etiquette: Ordering Food & Drinks Like a Tokyoite', 'https://drive.google.com/file/d/1TokyoIzakayaDiningGuide/view', FALSE, 4)
ON CONFLICT (id) DO UPDATE SET
    course_id = EXCLUDED.course_id,
    title = EXCLUDED.title,
    video_url = EXCLUDED.video_url,
    is_free = EXCLUDED.is_free,
    sequence_no = EXCLUDED.sequence_no;

-- Seed Lessons for Category 3: Travel & Sightseeing (Lessons 9 & 10 Free, 11 & 12 Paid)
INSERT INTO lessons (id, course_id, title, video_url, is_free, sequence_no) VALUES
(9, 3, 'Navigating Tokyo: Yamanote Line, Shinjuku, Shibuya & Metro Tips', 'https://www.youtube.com/watch?v=7h2S5lFhVdE', TRUE, 1),
(10, 3, 'Exploring Ancient Kyoto: Fushimi Inari, Gion & Bamboo Forest', 'https://www.youtube.com/watch?v=JmUvA84l1Y4', TRUE, 2),
(11, 3, 'Japanese Onsen & Ryokan Guide: Etiquette, Rules & Relaxing', 'https://drive.google.com/file/d/1JapaneseOnsenEtiquetteGuide/view', FALSE, 3),
(12, 3, 'Riding the Shinkansen (Bullet Train): Tickets, Bento & Mt. Fuji Views', 'https://drive.google.com/file/d/1ShinkansenBulletTrainJapan/view', FALSE, 4)
ON CONFLICT (id) DO UPDATE SET
    course_id = EXCLUDED.course_id,
    title = EXCLUDED.title,
    video_url = EXCLUDED.video_url,
    is_free = EXCLUDED.is_free,
    sequence_no = EXCLUDED.sequence_no;

-- Seed Lessons for Category 4: Traditions & Festivals (Lessons 13 & 14 Free, 15 & 16 Paid)
INSERT INTO lessons (id, course_id, title, video_url, is_free, sequence_no) VALUES
(13, 4, 'Shinto Shrines vs. Buddhist Temples: History, Torii & Bowing', 'https://www.youtube.com/watch?v=W1OkmkXwU6Q', TRUE, 1),
(14, 4, 'Matsuri Culture: Summer Festivals, Mikoshi & Fireworks (Hanabi)', 'https://www.youtube.com/watch?v=t8dFhH98w1c', TRUE, 2),
(15, 4, 'Hanami: The Cherry Blossom Philosophy of Mono no Aware', 'https://drive.google.com/file/d/1HanamiCherryBlossomPhilosophy/view', FALSE, 3),
(16, 4, 'Kimono & Yukata Traditions: Fabrics, Dressing & Symbolism', 'https://drive.google.com/file/d/1KimonoYukataJapaneseAttire/view', FALSE, 4)
ON CONFLICT (id) DO UPDATE SET
    course_id = EXCLUDED.course_id,
    title = EXCLUDED.title,
    video_url = EXCLUDED.video_url,
    is_free = EXCLUDED.is_free,
    sequence_no = EXCLUDED.sequence_no;

-- Seed Lessons for Category 5: Pop Culture & Anime (Lessons 17 & 18 Free, 19 & 20 Paid)
INSERT INTO lessons (id, course_id, title, video_url, is_free, sequence_no) VALUES
(17, 5, 'Inside Akihabara: The Evolution of Otaku Culture & Retro Gaming', 'https://www.youtube.com/watch?v=8Vb6cE_vG1c', TRUE, 1),
(18, 5, 'Learning Japanese Through Anime: Slang, Nuances & Reality vs TV', 'https://www.youtube.com/watch?v=xZ8cT1LwV0g', TRUE, 2),
(19, 5, 'How Manga is Made: Storyboarding, Screentones & Editorial Life', 'https://drive.google.com/file/d/1MangaDrawingCraftsmanshipJapan/view', FALSE, 3),
(20, 5, 'Studio Ghibli Aesthetics & Japanese Animation History', 'https://drive.google.com/file/d/1StudioGhibliAnimationHistory/view', FALSE, 4)
ON CONFLICT (id) DO UPDATE SET
    course_id = EXCLUDED.course_id,
    title = EXCLUDED.title,
    video_url = EXCLUDED.video_url,
    is_free = EXCLUDED.is_free,
    sequence_no = EXCLUDED.sequence_no;

SELECT setval('courses_id_seq', (SELECT COALESCE(MAX(id), 1) FROM courses));
SELECT setval('lessons_id_seq', (SELECT COALESCE(MAX(id), 1) FROM lessons));
