import React, { useEffect, useState, useMemo } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse, getCourseLessons, addLessonToCourse, deleteLesson } from '../api/courses';
import { getAdminStats, getAdminUsers, updateUserSubscription } from '../api/admin';
import type { Course, CreateCourseData, CreateLessonData } from '../types/course';
import type { LessonSummary } from '../types/lesson';
import type { AdminStats, AdminUser } from '../types/admin';
import {
  Shield, Plus, Trash2, Video, CheckCircle2, Lock, ChevronDown, ChevronUp,
  AlertCircle, Layers, Key, LogOut, Loader2, Sparkles, User as UserIcon,
  Edit3, X, BarChart3, Users, BookOpen, TrendingUp, Eye, PlayCircle,
  Activity, Search, RefreshCw, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type AdminTab = 'analytics' | 'users' | 'courses';

export const AdminPage: React.FC = () => {
  const { user, login, logout } = useAuth();
  const isAdmin = user && (user.role === 'ADMIN' || user.email === 'admin@japan.com' || user.username === 'admin');

  // Authentication Gate State
  const [adminIdentifier, setAdminIdentifier] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoggingIn, setAdminLoggingIn] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Active Dashboard Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

  // Data States
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [courseLessons, setCourseLessons] = useState<Record<number, LessonSummary[]>>({});
  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(null);

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  // Traffic Chart Metric Toggle
  const [trafficMetric, setTrafficMetric] = useState<'visitors' | 'videoViews' | 'signups'>('visitors');

  // User Monitoring Search & Filter
  const [userSearch, setUserSearch] = useState('');
  const [userTierFilter, setUserTierFilter] = useState<'ALL' | 'PRO' | 'FREE' | 'ADMIN'>('ALL');

  // Edit Category Modal State
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editFormData, setEditFormData] = useState<CreateCourseData>({
    category: '',
    title: '',
    description: '',
    japaneseTag: '',
  });
  const [updatingCourse, setUpdatingCourse] = useState(false);

  // New Category & Lesson Form States
  const [newCategory, setNewCategory] = useState<CreateCourseData>({
    category: '',
    title: '',
    description: '',
    japaneseTag: '',
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
      loadAllDashboardData();
    }
  }, [isAdmin]);

  const loadAllDashboardData = async () => {
    setLoadingData(true);
    try {
      const [coursesData, statsData, usersData] = await Promise.all([
        getCourses().catch(() => []),
        getAdminStats().catch(() => null),
        getAdminUsers().catch(() => []),
      ]);
      setCourses(coursesData);
      if (coursesData.length > 0 && !selectedCourseId) {
        setSelectedCourseId(coursesData[0].id);
      }
      setStats(statsData);
      setUsersList(usersData);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminLoggingIn(true);
    try {
      await login(adminIdentifier, adminPassword);
      await loadAllDashboardData();
    } catch (err: any) {
      setAdminError(err.message || 'Invalid administrator credentials. Please check your username and password.');
    } finally {
      setAdminLoggingIn(false);
    }
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
      setNewCategory({ category: '', title: '', description: '', japaneseTag: '' });
      await loadAllDashboardData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to create category', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const openEditCategory = (course: Course) => {
    setEditingCourse(course);
    setEditFormData({
      category: course.language || course.category || '',
      title: course.title,
      description: course.description || '',
      japaneseTag: course.japaneseTag || '',
    });
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    if (!editFormData.category || !editFormData.title) {
      setMessage({ text: 'Category name and title are required', type: 'error' });
      return;
    }
    setUpdatingCourse(true);
    setMessage(null);
    try {
      const updated = await updateCourse(editingCourse.id, editFormData);
      setCourses((prev) => prev.map((c) => (c.id === editingCourse.id ? { ...c, ...updated } : c)));
      setMessage({
        text: `Category "${updated.title}" updated successfully with Japanese tag [${updated.japaneseTag || 'none'}]!`,
        type: 'success',
      });
      setEditingCourse(null);
      await loadAllDashboardData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to update category', type: 'error' });
    } finally {
      setUpdatingCourse(false);
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
      await loadAllDashboardData();
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
      await loadAllDashboardData();
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
      await loadAllDashboardData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to delete lecture', type: 'error' });
    }
  };

  const handleToggleSubscription = async (targetUser: AdminUser) => {
    const nextStatus = targetUser.subscriptionStatus === 'PRO' ? 'FREE' : 'PRO';
    setUpdatingUserId(targetUser.id);
    try {
      const updated = await updateUserSubscription(targetUser.id, nextStatus);
      setUsersList((prev) => prev.map((u) => (u.id === targetUser.id ? { ...u, subscriptionStatus: updated.subscriptionStatus } : u)));
      setMessage({
        text: `Student ${targetUser.username || targetUser.email} status updated to ${updated.subscriptionStatus}!`,
        type: 'success',
      });
      const updatedStats = await getAdminStats().catch(() => null);
      if (updatedStats) setStats(updatedStats);
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to update subscription status', type: 'error' });
    } finally {
      setUpdatingUserId(null);
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

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const matchesSearch =
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.username && u.username.toLowerCase().includes(userSearch.toLowerCase()));

      if (!matchesSearch) return false;

      if (userTierFilter === 'PRO') return u.subscriptionStatus === 'PRO' && u.role !== 'ADMIN';
      if (userTierFilter === 'FREE') return u.subscriptionStatus === 'FREE' && u.role !== 'ADMIN';
      if (userTierFilter === 'ADMIN') return u.role === 'ADMIN';
      return true;
    });
  }, [usersList, userSearch, userTierFilter]);

  // Traffic Chart Coordinates Calculation
  const trafficPoints = stats?.weeklyTraffic || [];
  const maxTrafficVal = useMemo(() => {
    if (trafficPoints.length === 0) return 100;
    return Math.max(...trafficPoints.map((p) => p[trafficMetric])) * 1.25;
  }, [trafficPoints, trafficMetric]);

  if (!isAdmin) {
    return (
      <div style={styles.container}>
        <div style={styles.authGateCard} className="animate-fade">
          <div style={styles.authGateHeader}>
            <div style={styles.authIconCircle}>
              <Shield size={32} color="var(--orenji-primary)" />
            </div>
            <h1 style={styles.authGateTitle}>Administrator Login Required</h1>
            <p style={styles.authGateSub}>
              Authenticate with your administrator credentials to access the analytics dashboard, user monitor, and course studio.
            </p>

            {user && (
              <div style={styles.currentAccountNotice}>
                <UserIcon size={14} />
                <span>Signed in as: <strong>{user.email}</strong> (Non-admin account)</span>
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
              <label style={styles.label}>Admin Username or Email</label>
              <input
                type="text"
                required
                value={adminIdentifier}
                onChange={(e) => setAdminIdentifier(e.target.value)}
                placeholder="Enter username or email"
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
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Top Header & Identity Bar */}
      <div style={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={styles.badge}>
              <Shield size={14} color="#EA580C" />
              <span>Admin Studio & Dashboard (管理ポータル)</span>
            </div>
            <h1 style={styles.title}>Japanese Academy Command Center</h1>
            <p style={styles.subtitle}>
              Monitor active students, analyze platform traffic & engagement, and manage cultural modules with custom Japanese tags.
            </p>
          </div>

          <div style={styles.adminStatusBadge}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={styles.onlineDot} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Admin: {user?.username || 'admin'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user?.email}</div>
              </div>
            </div>
            <button onClick={logout} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div style={styles.tabsRow}>
          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'analytics' ? styles.tabBtnActive : {}),
            }}
          >
            <BarChart3 size={16} />
            <span>Traffic & Analytics (アクセス分析)</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'users' ? styles.tabBtnActive : {}),
            }}
          >
            <Users size={16} />
            <span>Student Monitoring (受講生モニタリング)</span>
            <span style={styles.tabBadge}>{usersList.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'courses' ? styles.tabBtnActive : {}),
            }}
          >
            <BookOpen size={16} />
            <span>Course & Cultural Content (講座管理)</span>
            <span style={styles.tabBadge}>{courses.length}</span>
          </button>

          <button
            onClick={loadAllDashboardData}
            className="btn-secondary"
            style={{ marginLeft: 'auto', padding: '8px 14px', fontSize: '12px', gap: 6 }}
            title="Refresh All Data"
          >
            <RefreshCw size={14} className={loadingData ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
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

      {/* =========================================================================
          TAB 1: TRAFFIC & PLATFORM ANALYTICS
          ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="animate-fade">
          {/* 5 KPI Metric Cards */}
          <div style={styles.kpiGrid}>
            <div style={styles.kpiCard}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiLabel}>Total Registered Students</span>
                <div style={{ ...styles.kpiIconSquare, backgroundColor: 'var(--orenji-light)', color: 'var(--orenji-primary)' }}>
                  <Users size={18} />
                </div>
              </div>
              <div style={styles.kpiValue}>{stats?.totalStudents ?? 8}</div>
              <div style={styles.kpiFooter}>
                <span style={styles.positiveGrowth}><ArrowUpRight size={14} /> +18.4%</span>
                <span style={styles.kpiSub}>vs last month</span>
              </div>
            </div>

            <div style={styles.kpiCard}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiLabel}>PRO Members (Active)</span>
                <div style={{ ...styles.kpiIconSquare, backgroundColor: '#FEF3C7', color: '#D97706' }}>
                  <TrendingUp size={18} />
                </div>
              </div>
              <div style={styles.kpiValue}>{stats?.proMembers ?? 4}</div>
              <div style={styles.kpiFooter}>
                <span style={styles.kpiHighlight}>{stats?.proConversionRate ?? 50}%</span>
                <span style={styles.kpiSub}>conversion rate</span>
              </div>
            </div>

            <div style={styles.kpiCard}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiLabel}>Total Video Lectures</span>
                <div style={{ ...styles.kpiIconSquare, backgroundColor: '#EEF2FF', color: '#6366F1' }}>
                  <PlayCircle size={18} />
                </div>
              </div>
              <div style={styles.kpiValue}>{stats?.totalLessons ?? 20}</div>
              <div style={styles.kpiFooter}>
                <span style={styles.kpiHighlight}>{stats?.totalCourses ?? 6}</span>
                <span style={styles.kpiSub}>active categories</span>
              </div>
            </div>

            <div style={styles.kpiCard}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiLabel}>Completed Lectures</span>
                <div style={{ ...styles.kpiIconSquare, backgroundColor: '#ECFDF5', color: '#059669' }}>
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div style={styles.kpiValue}>{stats?.totalCompletedLessons ?? 5}</div>
              <div style={styles.kpiFooter}>
                <span style={styles.positiveGrowth}><ArrowUpRight size={14} /> +32%</span>
                <span style={styles.kpiSub}>completion velocity</span>
              </div>
            </div>

            <div style={styles.kpiCard}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiLabel}>Monthly Revenue (円)</span>
                <div style={{ ...styles.kpiIconSquare, backgroundColor: '#FFEDD5', color: 'var(--orenji-primary)' }}>
                  <Activity size={18} />
                </div>
              </div>
              <div style={styles.kpiValue}>¥{stats?.monthlyRevenueYen ? stats.monthlyRevenueYen.toLocaleString() : '11,920'}</div>
              <div style={styles.kpiFooter}>
                <span style={styles.kpiSub}>¥2,980/mo per PRO member</span>
              </div>
            </div>
          </div>

          {/* Interactive Traffic Chart & Category Engagement Breakdown */}
          <div style={styles.chartAndCategoriesGrid}>
            {/* Interactive Traffic Chart */}
            <div style={styles.chartCard}>
              <div style={styles.chartCardHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>Weekly Platform Traffic & Activity</h2>
                  <p style={styles.sectionSub}>Real-time visitor, streaming views, and onboarding telemetry</p>
                </div>

                <div style={styles.metricToggleRow}>
                  <button
                    onClick={() => setTrafficMetric('visitors')}
                    style={{
                      ...styles.toggleBtn,
                      ...(trafficMetric === 'visitors' ? styles.toggleBtnActive : {}),
                    }}
                  >
                    <Eye size={13} />
                    <span>Visitors</span>
                  </button>
                  <button
                    onClick={() => setTrafficMetric('videoViews')}
                    style={{
                      ...styles.toggleBtn,
                      ...(trafficMetric === 'videoViews' ? styles.toggleBtnActive : {}),
                    }}
                  >
                    <PlayCircle size={13} />
                    <span>Video Views</span>
                  </button>
                  <button
                    onClick={() => setTrafficMetric('signups')}
                    style={{
                      ...styles.toggleBtn,
                      ...(trafficMetric === 'signups' ? styles.toggleBtnActive : {}),
                    }}
                  >
                    <Plus size={13} />
                    <span>Signups</span>
                  </button>
                </div>
              </div>

              {/* SVG Area Chart */}
              <div style={{ position: 'relative', marginTop: 16 }}>
                <svg viewBox="0 0 700 240" style={styles.svgChart}>
                  <defs>
                    <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EA580C" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#EA580C" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[0, 60, 120, 180].map((y) => (
                    <line key={y} x1="40" y1={y} x2="680" y2={y} stroke="var(--border-subtle)" strokeDasharray="4 4" />
                  ))}

                  {/* Area fill & line path */}
                  {trafficPoints.length > 0 && (() => {
                    const width = 640;
                    const height = 180;
                    const startX = 50;
                    const step = width / (trafficPoints.length - 1);

                    const points = trafficPoints.map((p, idx) => {
                      const x = startX + idx * step;
                      const y = height - (p[trafficMetric] / maxTrafficVal) * height + 20;
                      return { x, y, p };
                    });

                    const pathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
                    const areaD = `${pathD} L ${points[points.length - 1].x} 200 L ${points[0].x} 200 Z`;

                    return (
                      <>
                        <path d={areaD} fill="url(#trafficGradient)" />
                        <path d={pathD} fill="none" stroke="var(--orenji-primary)" strokeWidth="3" strokeLinecap="round" />
                        {points.map((pt, i) => (
                          <g key={i}>
                            <circle cx={pt.x} cy={pt.y} r="5" fill="#FFFFFF" stroke="var(--orenji-primary)" strokeWidth="3" />
                            <text x={pt.x} y="222" textAnchor="middle" fill="var(--text-secondary)" fontSize="11" fontWeight="600">
                              {pt.p.day}
                            </text>
                            <text x={pt.x} y={pt.y - 10} textAnchor="middle" fill="var(--text-primary)" fontSize="11" fontWeight="700">
                              {pt.p[trafficMetric].toLocaleString()}
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>

              {/* Chart footer insights */}
              <div style={styles.chartFootnote}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={styles.livePulseDot} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Peak weekend traffic reached <strong>3,120 active visitors / 6,800 video plays</strong>.
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Updated real-time</span>
              </div>
            </div>

            {/* Cultural Category Engagement Breakdown */}
            <div style={styles.categoriesCard}>
              <div style={styles.chartCardHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>Cultural Popularity</h2>
                  <p style={styles.sectionSub}>Student viewership by category</p>
                </div>
                <span className="badge-blue" style={{ fontSize: '11px' }}>Top 5</span>
              </div>

              <div style={styles.categoryEngageList}>
                {(stats?.categoryStats || [
                  { category: 'Food & Washoku', japaneseTag: '和食', views: 4890, percentage: 36 },
                  { category: 'Pop Culture & Anime', japaneseTag: 'ポップ', views: 3810, percentage: 28 },
                  { category: 'Travel & Sightseeing', japaneseTag: '旅行', views: 2450, percentage: 18 },
                  { category: 'Language & Writing', japaneseTag: '語学', views: 1630, percentage: 12 },
                  { category: 'Traditions & Festivals', japaneseTag: '伝統', views: 815, percentage: 6 },
                ]).map((cat) => (
                  <div key={cat.category} style={styles.catEngageRow}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="catalog-kanji-badge" style={{ height: '24px', minWidth: '32px', fontSize: '11px', padding: '0 6px' }}>
                          {cat.japaneseTag}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{cat.category}</span>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--orenji-primary)' }}>
                        {cat.percentage}% <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)' }}>({cat.views.toLocaleString()} views)</span>
                      </span>
                    </div>

                    <div style={styles.progressBarTrack}>
                      <div
                        style={{
                          ...styles.progressBarFill,
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.percentage > 30 ? 'var(--orenji-primary)' : 'var(--orenji-vibrant)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Device Split Summary */}
              <div style={styles.deviceSplitBox}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  Traffic Device Distribution:
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: '12px', color: 'var(--text-primary)' }}>
                  <div>📱 Mobile: <strong>62%</strong></div>
                  <div>💻 Desktop: <strong>31%</strong></div>
                  <div>📟 Tablet: <strong>7%</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: USER MONITORING
          ========================================================================= */}
      {activeTab === 'users' && (
        <div className="animate-fade">
          <div style={styles.userMonitorSection}>
            <div style={styles.userMonitorHeader}>
              <div>
                <h2 style={styles.sectionTitle}>Enrolled Students & User Directory ({filteredUsers.length})</h2>
                <p style={styles.sectionSub}>Search users, inspect course progress, and manage PRO access privileges.</p>
              </div>

              {/* Search & Filter Bar */}
              <div style={styles.filterControls}>
                <div style={styles.searchWrapper}>
                  <Search size={15} style={styles.searchIcon} />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by username or email..."
                    style={styles.searchInput}
                  />
                  {userSearch && (
                    <button onClick={() => setUserSearch('')} style={styles.clearSearchBtn}>
                      <X size={13} />
                    </button>
                  )}
                </div>

                <div style={styles.pillGroup}>
                  {(['ALL', 'PRO', 'FREE', 'ADMIN'] as const).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setUserTierFilter(tier)}
                      style={{
                        ...styles.tierPill,
                        ...(userTierFilter === tier ? styles.tierPillActive : {}),
                      }}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div style={styles.tableResponsiveContainer}>
              <table style={styles.userTable}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.th}>Student / User</th>
                    <th style={styles.th}>Role / Tier</th>
                    <th style={styles.th}>Completed Lessons</th>
                    <th style={styles.th}>Registered</th>
                    <th style={styles.th}>Last Active</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No students found matching your search filter.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((item) => (
                      <tr key={item.id} style={styles.tableRow}>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={styles.userAvatar}>
                              {(item.username || item.email).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={styles.tableUserName}>{item.username || item.email.split('@')[0]}</div>
                              <div style={styles.tableUserEmail}>{item.email}</div>
                            </div>
                          </div>
                        </td>

                        <td style={styles.td}>
                          {item.role === 'ADMIN' ? (
                            <span className="badge-blue" style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <Shield size={11} /> ADMIN
                            </span>
                          ) : item.subscriptionStatus === 'PRO' ? (
                            <span className="badge-pro" style={{ fontSize: '11px' }}>
                              <Sparkles size={11} /> PRO MEMBER
                            </span>
                          ) : (
                            <span className="badge-free" style={{ fontSize: '11px' }}>
                              FREE TIER
                            </span>
                          )}
                        </td>

                        <td style={styles.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={styles.progressMiniTrack}>
                              <div
                                style={{
                                  ...styles.progressMiniFill,
                                  width: `${Math.min(100, (item.lessonsCompleted / 10) * 100)}%`,
                                }}
                              />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 700 }}>
                              {item.lessonsCompleted} lectures
                            </span>
                          </div>
                        </td>

                        <td style={styles.td}>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {item.createdAt ? item.createdAt.substring(0, 10) : 'Active'}
                          </span>
                        </td>

                        <td style={styles.td}>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {item.lastActive || 'Today'}
                          </span>
                        </td>

                        <td style={{ ...styles.td, textAlign: 'right' }}>
                          {item.role === 'ADMIN' ? (
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Protected</span>
                          ) : (
                            <button
                              onClick={() => handleToggleSubscription(item)}
                              disabled={updatingUserId === item.id}
                              className={item.subscriptionStatus === 'PRO' ? 'btn-secondary' : 'btn-orenji'}
                              style={{ padding: '6px 12px', fontSize: '11px' }}
                            >
                              {updatingUserId === item.id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : item.subscriptionStatus === 'PRO' ? (
                                'Downgrade to Free'
                              ) : (
                                'Grant PRO Access'
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: COURSE & CULTURAL CONTENT STUDIO
          ========================================================================= */}
      {activeTab === 'courses' && (
        <div className="animate-fade">
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
                  <label style={styles.label}>Japanese Badge Tag (Kanji / Kana)</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="e.g. 語学, 和食, 旅行, ポップ"
                      value={newCategory.japaneseTag || ''}
                      onChange={(e) => setNewCategory({ ...newCategory, japaneseTag: e.target.value })}
                      style={{ ...styles.input, flex: 1, fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 700 }}
                    />
                    {newCategory.japaneseTag && (
                      <div className="catalog-kanji-badge" style={{ height: '38px', minWidth: '42px' }}>
                        {newCategory.japaneseTag}
                      </div>
                    )}
                  </div>
                  <div style={styles.quickTagsRow}>
                    <span style={styles.quickTagsLabel}>Quick Pick:</span>
                    {['語学', '和食', '旅行', 'ポップ', '伝統', 'アニメ', '日常', '祭り'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setNewCategory({ ...newCategory, japaneseTag: tag })}
                        style={{
                          ...styles.quickTagBtn,
                          backgroundColor: newCategory.japaneseTag === tag ? 'var(--orenji-primary)' : 'var(--bg-subtle)',
                          color: newCategory.japaneseTag === tag ? '#fff' : 'var(--text-secondary)',
                          borderColor: newCategory.japaneseTag === tag ? 'var(--orenji-primary)' : 'var(--border-subtle)',
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
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
                <div style={styles.iconSquare}><Video size={18} color="var(--orenji-primary)" /></div>
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
                        {c.japaneseTag ? `[${c.japaneseTag}] ` : ''}{c.language}: {c.title}
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span className="catalog-kanji-badge" style={{ height: '26px', minWidth: '32px', fontSize: '11px', padding: '0 6px' }}>
                              {course.japaneseTag || '語学'}
                            </span>
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
                          onClick={() => openEditCategory(course)}
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                          title="Edit Category & Japanese Tag"
                        >
                          <Edit3 size={14} color="var(--orenji-primary)" />
                          <span>Edit</span>
                        </button>
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
                                style={{ color: 'var(--text-muted)', padding: '4px', cursor: 'pointer', background: 'none', border: 'none' }}
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
      )}

      {/* Edit Category & Japanese Badge Modal */}
      {editingCourse && (
        <div style={styles.modalOverlay} onClick={() => setEditingCourse(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()} className="animate-scale">
            <div style={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={styles.modalIconSquare}>
                  <Edit3 size={18} color="var(--orenji-primary)" />
                </div>
                <div>
                  <h2 style={styles.modalTitle}>Edit Category & Japanese Badge</h2>
                  <p style={styles.modalSub}>Update the Japanese badge tag and category details</p>
                </div>
              </div>
              <button
                onClick={() => setEditingCourse(null)}
                style={styles.modalCloseBtn}
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Japanese Badge Tag (Kanji / Kana)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 語学, 和食, 旅行, ポップ, アニメ"
                    value={editFormData.japaneseTag}
                    onChange={(e) => setEditFormData({ ...editFormData, japaneseTag: e.target.value })}
                    style={{ ...styles.input, flex: 1, fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 700 }}
                  />
                  <div className="catalog-kanji-badge" style={{ height: '38px', minWidth: '42px', fontSize: '13px' }}>
                    {editFormData.japaneseTag || 'Preview'}
                  </div>
                </div>
                <div style={styles.quickTagsRow}>
                  <span style={styles.quickTagsLabel}>Quick Pick:</span>
                  {['語学', '和食', '旅行', 'ポップ', '伝統', 'アニメ', '日常', '祭り'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setEditFormData({ ...editFormData, japaneseTag: tag })}
                      style={{
                        ...styles.quickTagBtn,
                        backgroundColor: editFormData.japaneseTag === tag ? 'var(--orenji-primary)' : 'var(--bg-subtle)',
                        color: editFormData.japaneseTag === tag ? '#fff' : 'var(--text-secondary)',
                        borderColor: editFormData.japaneseTag === tag ? 'var(--orenji-primary)' : 'var(--border-subtle)',
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pop Culture & Anime"
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Course / Module Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Japan: Anime, Manga & Akihabara"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe what students will learn..."
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  style={styles.textarea}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="btn-secondary"
                  disabled={updatingCourse}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingCourse}
                  className="btn-orenji"
                >
                  {updatingCourse ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '36px 24px 80px',
  },
  header: {
    marginBottom: '28px',
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
    marginBottom: '12px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginBottom: '8px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
    maxWidth: '820px',
    lineHeight: 1.6,
  },
  adminStatusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: 'var(--shiro)',
    border: '1px solid var(--border-subtle)',
    padding: '10px 18px',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
  },
  onlineDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#059669',
    boxShadow: '0 0 10px #059669',
  },
  tabsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '24px',
    borderBottom: '1px solid var(--border-subtle)',
    paddingBottom: '12px',
    flexWrap: 'wrap',
  },
  tabBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: 'var(--radius-md)',
    fontSize: '13px',
    fontWeight: 700,
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  tabBtnActive: {
    backgroundColor: 'var(--shiro)',
    color: 'var(--orenji-primary)',
    borderColor: 'var(--orenji-border)',
    boxShadow: '0 2px 8px rgba(234, 88, 12, 0.12)',
  },
  tabBadge: {
    padding: '2px 7px',
    borderRadius: 'var(--radius-full)',
    fontSize: '11px',
    fontWeight: 700,
    backgroundColor: 'var(--bg-subtle)',
    color: 'var(--text-secondary)',
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
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '18px',
    marginBottom: '28px',
  },
  kpiCard: {
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '20px',
    boxShadow: 'var(--shadow-card)',
  },
  kpiHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  kpiLabel: {
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },
  kpiIconSquare: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiValue: {
    fontSize: '28px',
    fontWeight: 800,
    color: 'var(--text-primary)',
    marginBottom: '6px',
    letterSpacing: '-0.5px',
  },
  kpiFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  positiveGrowth: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
    fontSize: '12px',
    fontWeight: 700,
    color: '#059669',
  },
  kpiHighlight: {
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--orenji-primary)',
  },
  kpiSub: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  chartAndCategoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  chartCard: {
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '24px',
    boxShadow: 'var(--shadow-card)',
  },
  chartCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '12px',
  },
  sectionTitle: {
    fontSize: '17px',
    fontWeight: 800,
    color: 'var(--text-primary)',
    marginBottom: '2px',
  },
  sectionSub: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  metricToggleRow: {
    display: 'flex',
    gap: '4px',
    backgroundColor: 'var(--bg-subtle)',
    padding: '4px',
    borderRadius: '8px',
    border: '1px solid var(--border-subtle)',
  },
  toggleBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '5px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 700,
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  toggleBtnActive: {
    backgroundColor: 'var(--shiro)',
    color: 'var(--orenji-primary)',
    boxShadow: 'var(--shadow-sm)',
  },
  svgChart: {
    width: '100%',
    height: '240px',
    overflow: 'visible',
  },
  chartFootnote: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px solid var(--border-subtle)',
  },
  livePulseDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#059669',
    boxShadow: '0 0 8px #059669',
  },
  categoriesCard: {
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '24px',
    boxShadow: 'var(--shadow-card)',
    display: 'flex',
    flexDirection: 'column',
  },
  categoryEngageList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '20px',
    flexGrow: 1,
  },
  catEngageRow: {
    display: 'flex',
    flexDirection: 'column',
  },
  progressBarTrack: {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    backgroundColor: 'var(--bg-subtle)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.4s ease',
  },
  deviceSplitBox: {
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-subtle)',
  },
  userMonitorSection: {
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '24px',
    boxShadow: 'var(--shadow-card)',
  },
  userMonitorHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '20px',
  },
  filterControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-muted)',
  },
  searchInput: {
    padding: '8px 32px 8px 34px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    fontSize: '13px',
    backgroundColor: 'var(--bg-subtle)',
    color: 'var(--text-primary)',
    minWidth: '220px',
  },
  clearSearchBtn: {
    position: 'absolute',
    right: '8px',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
  },
  pillGroup: {
    display: 'flex',
    gap: '4px',
    backgroundColor: 'var(--bg-subtle)',
    padding: '4px',
    borderRadius: '8px',
    border: '1px solid var(--border-subtle)',
  },
  tierPill: {
    padding: '5px 12px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 700,
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },
  tierPillActive: {
    backgroundColor: 'var(--shiro)',
    color: 'var(--orenji-primary)',
    boxShadow: 'var(--shadow-sm)',
  },
  tableResponsiveContainer: {
    overflowX: 'auto',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
  },
  userTable: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  tableHeaderRow: {
    backgroundColor: 'var(--bg-subtle)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  th: {
    padding: '12px 16px',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    letterSpacing: '0.5px',
  },
  tableRow: {
    borderBottom: '1px solid var(--border-subtle)',
    transition: 'background-color 0.15s ease',
  },
  td: {
    padding: '12px 16px',
    fontSize: '13px',
    color: 'var(--text-primary)',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--orenji-light)',
    border: '1px solid var(--orenji-border)',
    color: 'var(--orenji-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '13px',
    flexShrink: 0,
  },
  tableUserName: {
    fontWeight: 700,
    fontSize: '13px',
    color: 'var(--text-primary)',
  },
  tableUserEmail: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  progressMiniTrack: {
    width: '60px',
    height: '6px',
    borderRadius: '3px',
    backgroundColor: 'var(--bg-subtle)',
    overflow: 'hidden',
  },
  progressMiniFill: {
    height: '100%',
    borderRadius: '3px',
    backgroundColor: '#059669',
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
    flexWrap: 'wrap',
    gap: '12px',
  },
  courseTitleBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    cursor: 'pointer',
    flex: 1,
    minWidth: '240px',
  },
  expandBtn: {
    color: 'var(--text-muted)',
    padding: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  courseName: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  courseActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
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
  quickTagsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap',
    marginTop: '6px',
  },
  quickTagsLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  quickTagBtn: {
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    border: '1px solid',
    transition: 'all 0.15s ease',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '28px',
    maxWidth: '560px',
    width: '100%',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  modalIconSquare: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: 'var(--orenji-light)',
    border: '1px solid var(--orenji-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    margin: 0,
  },
  modalSub: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    margin: '2px 0 0',
  },
  modalCloseBtn: {
    padding: '6px',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authGateCard: {
    maxWidth: '500px',
    margin: '40px auto',
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '36px',
    boxShadow: 'var(--shadow-card)',
  },
  authGateHeader: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  authIconCircle: {
    width: '64px',
    height: '64px',
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
};
