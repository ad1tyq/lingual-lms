import React, { useEffect, useState } from 'react';
import { getCourses, createCourse, deleteCourse, getCourseLessons, addLessonToCourse, deleteLesson } from '../api/courses';
import type { Course, CreateCourseData, CreateLessonData } from '../types/course';
import type { LessonSummary } from '../types/lesson';
import { Shield, Plus, Trash2, Video, CheckCircle2, Lock, ChevronDown, ChevronUp, AlertCircle, Layers, Key, LogOut, Loader2, Sparkles, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminPage: React.FC = () => {
  const { user, login, logout } = useAuth();
  const isAdmin = user && (user.role === 'ADMIN' || user.email === 'admin@japan.com');

  const [adminEmail, setAdminEmail] = useState('admin@japan.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoggingIn, setAdminLoggingIn] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [courseLessons, setCourseLessons] = useState<Record<number, LessonSummary[]>>({});
  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(null);

  // Form states
  const [newCategory, setNewCategory] = useState<CreateCourseData>({
    category: '',
    title: '',
    description: '',
  });

  const [newLesson, setNewLesson] = useState<CreateLessonData>({
    title: '',
    videoUrl: '',
    isFree: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (isAdmin) {
      loadCourses();
    }
  }, [isAdmin]);

  const loadCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
      if (data.length > 0 && !selectedCourseId) {
        setSelectedCourseId(data[0].id);
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to load courses', type: 'error' });
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminLoggingIn(true);
    try {
      await login(adminEmail, adminPassword);
      await loadCourses();
    } catch (err: any) {
      setAdminError(err.message || 'Invalid administrator credentials. Please check your email and password.');
    } finally {
      setAdminLoggingIn(false);
    }
  };

  const fillAdminCredentials = () => {
    setAdminEmail('admin@japan.com');
    setAdminPassword('AdminPass123!');
  };

  const loadLessonsForCourse = async (courseId: number) => {
    try {
      const lessons = await getCourseLessons(courseId);
      setCourseLessons((prev) => ({ ...prev, [courseId]: lessons }));
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.category || !newCategory.title) {
      setMessage({ text: 'Category name and title are required', type: 'error' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await createCourse(newCategory);
      setMessage({ text: `Category "${newCategory.title}" created successfully!`, type: 'success' });
      setNewCategory({ category: '', title: '', description: '' });
      await loadCourses();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to create category', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !newLesson.title || !newLesson.videoUrl) {
      setMessage({ text: 'Please fill in all lesson details', type: 'error' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await addLessonToCourse(selectedCourseId, newLesson);
      setMessage({ text: `Lecture "${newLesson.title}" added to category!`, type: 'success' });
      setNewLesson({ title: '', videoUrl: '', isFree: false });
      await loadLessonsForCourse(selectedCourseId);
      await loadCourses();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to add lesson', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!window.confirm('Are you sure you want to delete this category and all its lectures?')) return;
    try {
      await deleteCourse(courseId);
      setMessage({ text: 'Category deleted successfully', type: 'success' });
      await loadCourses();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to delete category', type: 'error' });
    }
  };

  const handleDeleteLesson = async (courseId: number, lessonId: number) => {
    if (!window.confirm('Delete this lecture?')) return;
    try {
      await deleteLesson(lessonId);
      setMessage({ text: 'Lecture deleted', type: 'success' });
      await loadLessonsForCourse(courseId);
      await loadCourses();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to delete lecture', type: 'error' });
    }
  };

  const toggleExpand = async (courseId: number) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
    } else {
      setExpandedCourseId(courseId);
      if (!courseLessons[courseId]) {
        await loadLessonsForCourse(courseId);
      }
    }
  };

  if (!isAdmin) {
    return (
      <div style={styles.container}>
        <div style={styles.authGateCard} className="animate-fade">
          <div style={styles.authGateHeader}>
            <div style={styles.authIconCircle}>
              <Lock size={30} color="var(--orenji-primary)" />
            </div>
            <h1 style={styles.authGateTitle}>Administrator Login Required</h1>
            <p style={styles.authGateSub}>
              You must authenticate with administrator credentials to manage categories and video lectures.
            </p>
            {user && (
              <div style={styles.currentAccountNotice}>
                <UserIcon size={14} />
                <span>Currently signed in as: <strong>{user.email}</strong> (Non-admin account)</span>
              </div>
            )}
          </div>

          {adminError && (
            <div style={styles.alertError}>
              <AlertCircle size={16} />
              <span>{adminError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@japan.com"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Admin Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                style={styles.input}
              />
            </div>

            <button type="submit" disabled={adminLoggingIn} className="btn-orenji" style={{ width: '100%', marginTop: 8 }}>
              {adminLoggingIn ? <Loader2 size={16} className="animate-spin" /> : <Key size={16} />}
              <span>Authenticate as Administrator</span>
            </button>
          </form>

          <div style={styles.divider}>
            <span>quick access</span>
          </div>

          <button onClick={fillAdminCredentials} type="button" style={styles.demoBtn}>
            <Sparkles size={14} color="var(--orenji-primary)" />
            <span>Auto-fill Admin Credentials (admin@japan.com)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={styles.badge}>
              <Shield size={14} color="#EA580C" />
              <span>Admin Studio (管理スタジオ)</span>
            </div>
            <h1 style={styles.title}>Japanese Culture & Language Content Manager</h1>
            <p style={styles.subtitle}>
              Add new Japanese categories (Language, Food, Travel, Pop Culture) and upload video lectures with freemium paywall settings.
            </p>
          </div>
          <div style={styles.adminStatusBadge}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={styles.onlineDot} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Admin: {user?.email}</span>
            </div>
            <button onClick={logout} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div
          style={{
            ...styles.alertBox,
            backgroundColor: message.type === 'success' ? 'var(--emerald-bg)' : 'var(--danger-bg)',
            borderColor: message.type === 'success' ? 'var(--emerald-border)' : '#FECACA',
            color: message.type === 'success' ? '#047857' : '#DC2626',
          }}
          className="animate-fade"
        >
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <div style={styles.gridForms}>
        {/* Form 1: Add New Category */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.iconSquare}><Plus size={18} color="#EA580C" /></div>
            <div>
              <h2 style={styles.cardTitle}>1. Create Japanese Category</h2>
              <p style={styles.cardSub}>e.g. Travel, Food, JLPT Grammar, Festivals</p>
            </div>
          </div>

          <form onSubmit={handleCreateCategory} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Category Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Food & Washoku or Japanese Dialects"
                value={newCategory.category}
                onChange={(e) => setNewCategory({ ...newCategory, category: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Course / Module Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Street Food in Osaka: Kansai Culture"
                value={newCategory.title}
                onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea
                rows={3}
                placeholder="Describe what students will learn about this aspect of Japan..."
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                style={styles.textarea}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-orenji" style={{ marginTop: 8 }}>
              <Plus size={16} />
              <span>Publish Category</span>
            </button>
          </form>
        </div>

        {/* Form 2: Add Lecture to Category */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.iconSquare}><Video size={18} color="var(--blue-primary)" /></div>
            <div>
              <h2 style={styles.cardTitle}>2. Add Lecture Video</h2>
              <p style={styles.cardSub}>YouTube or Google Drive stream link</p>
            </div>
          </div>

          <form onSubmit={handleAddLesson} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Select Target Category</label>
              <select
                value={selectedCourseId || ''}
                onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                style={styles.select}
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.language}: {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Lecture Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Dashi Broth Fundamentals & Umami Secrets"
                value={newLesson.title}
                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Video URL (YouTube or Google Drive)</label>
              <input
                type="url"
                required
                placeholder="https://www.youtube.com/watch?v=... or Drive link"
                value={newLesson.videoUrl}
                onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={styles.checkboxRow}>
              <label style={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={newLesson.isFree}
                  onChange={(e) => setNewLesson({ ...newLesson, isFree: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: '#EA580C' }}
                />
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  Mark as Free Preview Lecture
                </span>
              </label>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {newLesson.isFree ? 'Anyone can watch without PRO' : 'Locked behind PRO subscription'}
              </span>
            </div>

            <button type="submit" disabled={loading || courses.length === 0} className="btn-primary" style={{ marginTop: 8 }}>
              <Plus size={16} />
              <span>Add Lecture to Category</span>
            </button>
          </form>
        </div>
      </div>

      {/* Category & Lecture Management Tree */}
      <div style={styles.manageSection}>
        <div style={styles.manageHeader}>
          <Layers size={20} color="#EA580C" />
          <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Existing Categories & Video Lectures ({courses.length})</h2>
        </div>

        <div style={styles.categoryList}>
          {courses.map((course) => {
            const isExpanded = expandedCourseId === course.id;
            const lessons = courseLessons[course.id] || [];

            return (
              <div key={course.id} style={styles.courseBlock}>
                <div style={styles.courseHeader}>
                  <div style={styles.courseTitleBlock} onClick={() => toggleExpand(course.id)}>
                    <button style={styles.expandBtn}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="badge-blue" style={{ fontSize: '10px' }}>{course.language}</span>
                        <h3 style={styles.courseName}>{course.title}</h3>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {course.totalLessons} lectures ({course.freeLessonsCount} free)
                      </span>
                    </div>
                  </div>

                  <div style={styles.courseActions}>
                    <button
                      onClick={() => toggleExpand(course.id)}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      {isExpanded ? 'Hide Lectures' : 'View Lectures'}
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="btn-secondary"
                      title="Delete Category"
                      style={{ padding: '6px 10px', color: '#DC2626' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div style={styles.lessonsSublist}>
                    {lessons.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '12px 16px' }}>
                        No lectures yet in this category. Use the form above to add lectures.
                      </p>
                    ) : (
                      lessons.map((lesson) => (
                        <div key={lesson.id} style={styles.lessonItemRow}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={styles.seqLabel}>#{lesson.sequenceNo}</span>
                            <span style={styles.lessonTitle}>{lesson.title}</span>
                            {lesson.free ? (
                              <span className="badge-free" style={{ fontSize: '10px' }}>Free Preview</span>
                            ) : (
                              <span className="badge-pro" style={{ fontSize: '10px' }}>
                                <Lock size={10} /> PRO Locked
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => handleDeleteLesson(course.id, lesson.id)}
                            style={{ color: 'var(--text-muted)', padding: '4px', cursor: 'pointer' }}
                            title="Delete Lecture"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 24px 80px',
  },
  header: {
    marginBottom: '32px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'var(--orenji-light)',
    border: '1px solid #FFEDD5',
    color: 'var(--orenji-primary)',
    padding: '4px 12px',
    borderRadius: 'var(--radius-full)',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '14px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
    maxWidth: '800px',
    lineHeight: 1.6,
  },
  alertBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 18px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid',
    marginBottom: '24px',
    fontSize: '14px',
    fontWeight: '500',
  },
  gridForms: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  card: {
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '28px',
    boxShadow: 'var(--shadow-card)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '20px',
  },
  iconSquare: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'var(--bg-elevated)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  cardSub: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  input: {
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--bg-subtle)',
    color: 'var(--text-primary)',
    fontSize: '14px',
  },
  textarea: {
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--bg-subtle)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    resize: 'vertical',
  },
  select: {
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--bg-subtle)',
    color: 'var(--text-primary)',
    fontSize: '14px',
  },
  checkboxRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '10px 12px',
    backgroundColor: 'var(--bg-subtle)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
  },
  checkLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  manageSection: {
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '28px',
    boxShadow: 'var(--shadow-card)',
  },
  manageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  courseBlock: {
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    backgroundColor: 'var(--bg-subtle)',
  },
  courseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: 'var(--shiro)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  courseTitleBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    cursor: 'pointer',
    flex: 1,
  },
  expandBtn: {
    color: 'var(--text-muted)',
    padding: '4px',
  },
  courseName: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  courseActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  lessonsSublist: {
    padding: '12px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  lessonItemRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-subtle)',
  },
  seqLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    width: '24px',
  },
  lessonTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  authGateCard: {
    maxWidth: '480px',
    margin: '40px auto',
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '36px',
    boxShadow: 'var(--shadow-card)',
  },
  authGateHeader: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  authIconCircle: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: 'var(--orenji-light)',
    border: '1px solid var(--orenji-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    boxShadow: '0 4px 16px rgba(234, 88, 12, 0.15)',
  },
  authGateTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  authGateSub: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  currentAccountNotice: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'var(--bg-subtle)',
    padding: '6px 12px',
    borderRadius: 'var(--radius-full)',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: '12px',
    border: '1px solid var(--border-subtle)',
  },
  alertError: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 14px',
    backgroundColor: 'var(--danger-bg)',
    color: '#DC2626',
    borderRadius: 'var(--radius-md)',
    border: '1px solid #FECACA',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '18px',
  },
  divider: {
    textAlign: 'center',
    margin: '24px 0 16px',
    borderBottom: '1px solid var(--border-subtle)',
    lineHeight: '0.1em',
    color: 'var(--text-muted)',
    fontSize: '12px',
    textTransform: 'uppercase',
  },
  demoBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: 'var(--orenji-light)',
    border: '1px dashed var(--orenji-border)',
    color: 'var(--orenji-primary)',
    padding: '10px',
    borderRadius: 'var(--radius-md)',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  adminStatusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'var(--shiro)',
    border: '1px solid var(--border-subtle)',
    padding: '8px 16px',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
  },
  onlineDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#059669',
    boxShadow: '0 0 8px #059669',
  },
};
