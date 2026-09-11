import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getLessonById } from '../api/lessons';
import { getCourseById, getCourseLessons } from '../api/courses';
import { markLessonComplete, getCourseProgress } from '../api/progress';
import type { LessonDetail, LessonSummary } from '../types/lesson';
import type { Course } from '../types/course';
import type { CourseProgress } from '../types/progress';
import { VideoPlayer } from '../components/VideoPlayer';
import { LessonSidebar } from '../components/LessonSidebar';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { ArrowLeft, ChevronLeft, ChevronRight, AlertCircle, Lock } from 'lucide-react';

export const Classroom: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openPaywall } = useModal();

  const cId = Number(courseId);
  const lId = Number(lessonId);

  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<LessonDetail | null>(null);
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [progress, setProgress] = useState<CourseProgress | null>(null);

  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cId || !lId) return;
    loadLessonAndSyllabus();
  }, [cId, lId, user?.subscriptionStatus]);

  const loadLessonAndSyllabus = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user) {
        // Unauthenticated guests cannot load the video stream
        const [cData, lessonsList] = await Promise.all([
          getCourseById(cId),
          getCourseLessons(cId),
        ]);
        setCourse(cData);
        setLessons(lessonsList);
        setCurrentLesson(null);
        return;
      }

      const [cData, lData, lessonsList] = await Promise.all([
        getCourseById(cId),
        getLessonById(lId),
        getCourseLessons(cId),
      ]);

      setCourse(cData);
      setCurrentLesson(lData);
      setLessons(lessonsList);

      try {
        const progData = await getCourseProgress(cId);
        setProgress(progData);
      } catch {
        // Non-blocking progress load
      }
    } catch (err: any) {
      if (err.status === 403 || err.message?.includes('Subscription required')) {
        openPaywall('This lecture is locked. Upgrade to PRO to unlock the full course.');
      }
      setError(err.message || 'Failed to load lecture');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLesson = (lesson: LessonSummary) => {
    if (!user) {
      openPaywall('You cannot open or watch any videos without creating an account or logging in.');
      return;
    }

    if (lesson.locked) {
      openPaywall(`Lecture #${lesson.sequenceNo} is locked. Upgrade to PRO to view this video.`);
    } else {
      navigate(`/courses/${cId}/lessons/${lesson.id}`);
    }
  };

  const handleComplete = async () => {
    if (!currentLesson) return;
    if (!user) {
      openPaywall('Please sign in to save your learning progress.');
      return;
    }

    setCompleting(true);
    try {
      await markLessonComplete(currentLesson.id);
      setCurrentLesson((prev) => (prev ? { ...prev, completed: true } : null));

      // Update sidebar completed state
      setLessons((prev) =>
        prev.map((l) => (l.id === currentLesson.id ? { ...l, completed: true } : l))
      );

      // Refresh progress metrics
      const progData = await getCourseProgress(cId);
      setProgress(progData);
    } catch (err: any) {
      alert(err.message || 'Failed to mark as completed');
    } finally {
      setCompleting(false);
    }
  };

  const currentIndex = lessons.findIndex((l) => l.id === lId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <div style={styles.pageWrapper}>
      {/* Top Breadcrumb Bar */}
      <div style={styles.topBar}>
        <div style={styles.topBarInner}>
          <Link to={`/courses/${cId}`} style={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Back to Category Syllabus</span>
          </Link>

          <div style={styles.navArrows}>
            <button
              onClick={() => prevLesson && handleSelectLesson(prevLesson)}
              disabled={!prevLesson}
              className="btn-secondary"
              style={{ ...styles.navBtn, opacity: prevLesson ? 1 : 0.4 }}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              onClick={() => nextLesson && handleSelectLesson(nextLesson)}
              disabled={!nextLesson}
              className="btn-secondary"
              style={{ ...styles.navBtn, opacity: nextLesson ? 1 : 0.4 }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div style={styles.layout}>
        {/* Main Video & Details */}
        <main style={styles.mainContent}>
          {!user ? (
            <div style={styles.authLockCard}>
              <div style={styles.authLockIcon}>
                <Lock size={36} color="var(--orenji-primary)" />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: 16 }}>
                Account Required to Open Videos
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '15px', maxWidth: '520px', margin: '8px auto 0', lineHeight: 1.6 }}>
                You cannot open or watch any videos without creating an account or logging in. Register a free account today to watch introductory preview lectures!
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
                <Link to={`/login?redirect=/courses/${cId}/lessons/${lId}`} className="btn-secondary" style={{ padding: '12px 24px' }}>
                  Sign In to Existing Account
                </Link>
                <Link to={`/login?mode=register&redirect=/courses/${cId}/lessons/${lId}`} className="btn-orenji" style={{ padding: '12px 24px' }}>
                  Create Free Account
                </Link>
              </div>
            </div>
          ) : loading ? (
            <div style={styles.skeletonPlayer} />
          ) : error && !currentLesson ? (
            <div style={styles.errorBox}>
              <AlertCircle size={36} color="#F87171" />
              <h3 style={{ color: '#F87171', marginTop: 12 }}>{error}</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: '14px' }}>
                If this lecture is locked, you can upgrade to PRO to unlock it.
              </p>
              <button
                onClick={() => openPaywall()}
                className="btn-orenji"
                style={{ marginTop: 20 }}
              >
                Upgrade to PRO
              </button>
            </div>
          ) : currentLesson ? (
            <VideoPlayer
              lesson={currentLesson}
              onComplete={handleComplete}
              isCompleting={completing}
            />
          ) : null}
        </main>

        {/* Sidebar Playlist */}
        <aside style={styles.sidebarWrapper}>
          <LessonSidebar
            courseTitle={course?.title || 'Category Syllabus'}
            lessons={lessons}
            activeLessonId={lId}
            onSelectLesson={handleSelectLesson}
            completedCount={progress?.completedLessons || lessons.filter((l) => l.completed).length}
            totalCount={course?.totalLessons || lessons.length}
          />
        </aside>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    maxWidth: '1360px',
    margin: '0 auto',
    padding: '0 24px 60px',
    width: '100%',
  },
  topBar: {
    padding: '16px 0',
    borderBottom: '1px solid var(--border-subtle)',
    marginBottom: '24px',
  },
  topBarInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: '600',
  },
  navArrows: {
    display: 'flex',
    gap: '10px',
  },
  navBtn: {
    padding: '6px 14px',
    fontSize: '13px',
  },
  layout: {
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
  },
  mainContent: {
    flex: '1 1 0%',
    minWidth: 0,
  },
  sidebarWrapper: {
    flexShrink: 0,
    position: 'sticky',
    top: '90px',
  },
  skeletonPlayer: {
    width: '100%',
    paddingTop: '56.25%',
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
  },
  authLockCard: {
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    border: '2px dashed var(--orenji-subtle)',
    padding: '70px 30px',
    textAlign: 'center',
    boxShadow: 'var(--shadow-card)',
    maxWidth: '720px',
    margin: '30px auto',
  },
  authLockIcon: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: 'var(--orenji-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    border: '2px solid var(--orenji-subtle)',
  },
  errorBox: {
    backgroundColor: 'var(--shiro)',
    padding: '60px 40px',
    borderRadius: 'var(--radius-lg)',
    textAlign: 'center',
    border: '1px solid var(--border-subtle)',
    boxShadow: 'var(--shadow-card)',
  },
};
