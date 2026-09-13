import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourseById, getCourseLessons } from '../api/courses';
import type { Course } from '../types/course';
import type { LessonSummary } from '../types/lesson';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { Play, Lock, CheckCircle2, ArrowLeft, Video, Sparkles } from 'lucide-react';
import { ProgressBar } from '../components/ProgressBar';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openPaywall } = useModal();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cId = Number(courseId);

  useEffect(() => {
    if (!cId) return;
    loadCourse();
  }, [cId, user?.subscriptionStatus]);

  const loadCourse = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cData, lData] = await Promise.all([
        getCourseById(cId),
        getCourseLessons(cId),
      ]);
      setCourse(cData);
      setLessons(lData);
    } catch (err: any) {
      setError(err.message || 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (lesson: LessonSummary) => {
    if (!user) {
      openPaywall('You cannot open or watch any videos without creating an account or logging in. Please sign in or create a free account to unlock video lectures!');
      return;
    }

    if (lesson.locked) {
      openPaywall(`Lecture #${lesson.sequenceNo} is a PRO lecture. Upgrade now to unlock this video.`);
    } else {
      navigate(`/courses/${cId}/lessons/${lesson.id}`);
    }
  };

  const completedCount = lessons.filter((l) => l.completed).length;
  const totalCount = lessons.length;
  const nextLessonToPlay = lessons.find((l) => !l.completed && !l.locked) || lessons[0];

  const startFirstLesson = () => {
    if (!user) {
      navigate('/login?mode=register');
      return;
    }
    if (lessons.length > 0) {
      handleLessonClick(nextLessonToPlay);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div className="badge-pro" style={{ padding: '8px 16px' }}>Loading Course Syllabus...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <p style={{ color: '#F87171' }}>{error || 'Course not found'}</p>
          <Link to="/" className="btn-secondary" style={{ marginTop: 16 }}>
            <ArrowLeft size={16} /> Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="course-detail-container" style={styles.container}>
      <Link
        to={course?.targetLanguage ? `/languages/${course.targetLanguage.toLowerCase()}` : '/'}
        className="course-detail-back"
        style={styles.backLink}
      >
        <ArrowLeft size={16} /> Back to {course?.targetLanguage ? `Nyantaro ${course.targetLanguage}` : 'all courses'}
      </Link>

      {/* Hero Header */}
      <div className="course-detail-hero" style={styles.heroCard}>
        <div className="course-detail-content" style={styles.heroContent}>
          <div className="course-detail-badge-row" style={styles.badgeRow}>
            {course.targetLanguage && (
              <span className="badge-pro" style={{ fontSize: '11px', padding: '3px 8px' }}>
                Nyantaro {course.targetLanguage}
              </span>
            )}
            {course.japaneseTag && (
              <span className="catalog-kanji-badge" style={{ height: '26px', minWidth: '34px', fontSize: '12px', padding: '0 8px' }}>
                {course.japaneseTag}
              </span>
            )}
            <span className="course-detail-lang-tag" style={styles.langTag}>{course.language}</span>
            <span className="badge-free">{course.freeLessonsCount} Free Preview Lessons</span>
          </div>

          <h1 className="course-detail-title" style={styles.title}>{course.title}</h1>
          <p className="course-detail-desc" style={styles.description}>{course.description}</p>

          {totalCount > 0 && (
            <div style={styles.progressBox}>
              <ProgressBar completed={completedCount} total={totalCount} />
            </div>
          )}

          <div className="course-detail-actions" style={styles.heroActions}>
            <button onClick={startFirstLesson} className="btn-primary" style={{ padding: '12px 24px', fontSize: '15px' }}>
              <Play size={18} fill="#fff" />
              <span>
                {user
                  ? completedCount > 0
                    ? completedCount === totalCount
                      ? 'Review Course (Lesson #1)'
                      : `Resume Course (Lesson #${nextLessonToPlay?.sequenceNo || 1})`
                    : 'Start Course (Lesson #1)'
                  : 'Sign In to Start Course'}
              </span>
            </button>

            {user && user?.subscriptionStatus !== 'PRO' && (
              <button
                onClick={() => openPaywall()}
                className="btn-orenji"
                style={{ padding: '12px 24px', fontSize: '15px' }}
              >
                <Sparkles size={18} />
                <span>Unlock All Paid Lectures</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Syllabus Table */}
      <div className="course-detail-syllabus" style={styles.syllabusSection}>
        <div style={styles.syllabusHeader}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>Category Syllabus & Lectures</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: 4 }}>
              {lessons.length} video lectures available. {user ? `First ${course.freeLessonsCount} lectures are free preview.` : 'Sign in to watch free preview lectures.'}
            </p>
          </div>
          {totalCount > 0 && (
            <div style={styles.syllabusProgressWrapper}>
              <ProgressBar completed={completedCount} total={totalCount} />
            </div>
          )}
        </div>

        <div className="course-detail-lesson-list" style={styles.lessonList}>
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => handleLessonClick(lesson)}
              className="course-detail-lesson-row"
              style={{
                ...styles.lessonRow,
                cursor: 'pointer',
              }}
            >
              <div className="course-detail-lesson-info" style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                <div className="course-detail-seq-badge" style={styles.seqBadge}>#{lesson.sequenceNo}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 className="course-detail-lesson-title" style={styles.lessonTitle}>{lesson.title}</h3>
                  <div className="course-detail-lesson-meta" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: 4 }}>
                    <span style={styles.lessonFormat}>
                      <Video size={12} style={{ marginRight: 4, verticalAlign: 'middle', color: 'var(--orenji-primary)' }} />
                      Video Lecture
                    </span>
                    {lesson.completed ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#059669', fontSize: '11px', fontWeight: 700 }}>
                        <CheckCircle2 size={13} /> Completed
                      </span>
                    ) : lesson.free ? (
                      <span className="badge-free" style={{ fontSize: '10px', padding: '2px 7px' }}>Free Preview</span>
                    ) : lesson.locked ? (
                      <span className="badge-pro" style={{ fontSize: '10px', padding: '2px 7px' }}>
                        <Lock size={10} /> PRO Only
                      </span>
                    ) : (
                      <span className="badge-orenji" style={{ fontSize: '10px', padding: '2px 7px' }}>
                        Unlocked
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="course-detail-lesson-right" style={{ flexShrink: 0 }}>
                <button className="course-detail-play-btn" style={styles.playBtn} title={lesson.locked ? 'Unlock Lecture' : 'Watch Lecture'}>
                  {!user || lesson.locked ? <Lock size={16} color="var(--orenji-primary)" /> : <Play size={16} color="var(--orenji-primary)" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '30px 24px 80px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '24px',
  },
  heroCard: {
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '36px',
    marginBottom: '40px',
    boxShadow: 'var(--shadow-card)',
  },
  heroContent: {
    maxWidth: '750px',
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  langTag: {
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'var(--orenji-primary)',
    backgroundColor: 'var(--orenji-light)',
    border: '1px solid var(--orenji-border)',
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    lineHeight: 1.25,
    marginBottom: '14px',
  },
  description: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    marginBottom: '28px',
  },
  heroActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  progressBox: {
    backgroundColor: 'var(--bg-subtle)',
    borderRadius: '12px',
    padding: '14px 18px',
    border: '1px solid var(--border-subtle)',
    maxWidth: '520px',
    marginBottom: '24px',
  },
  syllabusSection: {
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-card)',
  },
  syllabusHeader: {
    padding: '24px',
    borderBottom: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--bg-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    flexWrap: 'wrap',
  },
  syllabusProgressWrapper: {
    minWidth: '220px',
    maxWidth: '300px',
    width: '100%',
  },
  lessonList: {
    display: 'flex',
    flexDirection: 'column',
  },
  lessonRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 24px',
    borderBottom: '1px solid var(--border-subtle)',
    transition: 'background-color 0.2s',
  },
  lessonInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  seqBadge: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-subtle)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '2px',
  },
  lessonFormat: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  lessonRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  playBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '1px solid var(--border-subtle)',
  },
};
