-- V2__seed_data.sql
-- Seed initial language courses
INSERT INTO courses (id, language, title, description) VALUES
(1, 'Japanese', 'Japanese N5 Masterclass', 'Master basic Hiragana, Katakana, Kanji, and essential grammar for JLPT N5.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO courses (id, language, title, description) VALUES
(2, 'Spanish', 'Conversational Spanish A1', 'Start speaking Spanish from day one with practical everyday dialogues.')
ON CONFLICT (id) DO NOTHING;

-- Seed lessons for Japanese course (Lessons 1 & 2 are FREE, 3-5 are PAID)
INSERT INTO lessons (id, course_id, title, video_url, is_free, sequence_no) VALUES
(1, 1, 'Introduction to Japanese Writing: Hiragana Fundamentals', 'https://www.youtube.com/watch?v=6p9Il_j0zjc', TRUE, 1),
(2, 1, 'Basic Greetings & Self Introduction (Hajimemashite)', 'https://www.youtube.com/watch?v=k74yjmfFb_A', TRUE, 2),
(3, 1, 'Essential Particles: は (wa), を (o), and が (ga)', 'https://drive.google.com/file/d/1JapaneseGrammarParticlesSample/view', FALSE, 3),
(4, 1, 'Counting & Numbers: 一二三 to Advanced Counters', 'https://www.youtube.com/watch?v=samplePaidJapaneseCounting', FALSE, 4),
(5, 1, 'Polite Verb Conjugation: ます (Masu) form', 'https://drive.google.com/file/d/1JapaneseVerbConjugationsSample/view', FALSE, 5)
ON CONFLICT (id) DO NOTHING;

-- Seed lessons for Spanish course (Lessons 6 & 7 are FREE, 8-10 are PAID)
INSERT INTO lessons (id, course_id, title, video_url, is_free, sequence_no) VALUES
(6, 2, 'Spanish Pronunciation & The Alphabet', 'https://www.youtube.com/watch?v=hsLYD1EZW4o', TRUE, 1),
(7, 2, 'Common Greetings & Introductions (¡Hola! ¿Cómo estás?)', 'https://www.youtube.com/watch?v=t_8vVbM3R9k', TRUE, 2),
(8, 2, 'Ser vs. Estar: The Two Spanish To Be Verbs', 'https://drive.google.com/file/d/1SpanishSerEstarSample/view', FALSE, 3),
(9, 2, 'Regular -AR, -ER, -IR Verb Conjugation in Present Tense', 'https://www.youtube.com/watch?v=samplePaidSpanishVerbs', FALSE, 4),
(10, 2, 'Ordering Food & Navigating a Spanish Restaurant', 'https://drive.google.com/file/d/1SpanishRestaurantDialogueSample/view', FALSE, 5)
ON CONFLICT (id) DO NOTHING;

-- Adjust sequence values to prevent duplicate key errors on future inserts
SELECT setval('courses_id_seq', (SELECT COALESCE(MAX(id), 1) FROM courses));
SELECT setval('lessons_id_seq', (SELECT COALESCE(MAX(id), 1) FROM lessons));
