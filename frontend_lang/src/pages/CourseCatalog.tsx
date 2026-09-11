import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCourses } from '../api/courses';
import type { Course } from '../types/course';
import { Sparkles, ArrowRight, Layers, Utensils, Compass, BookOpen, Film, Flame } from 'lucide-react';
import { CatLogo } from '../components/CatLogo';

export const CourseCatalog: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load Japanese culture modules');
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories from loaded courses
  const dynamicCategories = Array.from(new Set(courses.map((c) => c.language).filter(Boolean)));
  const allCategoryTabs = ['ALL', ...dynamicCategories];

  const filteredCourses =
    selectedCategory === 'ALL'
      ? courses
      : courses.filter((c) => c.language.toLowerCase() === selectedCategory.toLowerCase());

  const getCategoryIcon = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes('food') || c.includes('washoku') || c.includes('cuisine')) return <Utensils size={15} />;
    if (c.includes('travel') || c.includes('tour') || c.includes('sightseeing')) return <Compass size={15} />;
    if (c.includes('pop') || c.includes('anime') || c.includes('manga')) return <Film size={15} />;
    if (c.includes('tradition') || c.includes('shinto') || c.includes('festival')) return <Flame size={15} />;
    return <BookOpen size={15} />;
  };

  const getCategoryKanji = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes('food') || c.includes('washoku')) return '和食';
    if (c.includes('travel') || c.includes('sightseeing')) return '旅行';
    if (c.includes('pop') || c.includes('anime')) return 'ポップ';
    if (c.includes('tradition')) return '伝統';
    if (c.includes('language') || c.includes('writing')) return '語学';
    return '日本';
  };

  return (
    <div className="catalog-container" style={styles.container}>
      {/* Hero Banner with Big Cat Logo */}
      <section className="catalog-hero" style={styles.hero}>
        {/* BIG CAT LOGO (Maneki-Neko) */}
        <div style={{ marginBottom: '20px' }}>
          <CatLogo size={145} />
        </div>

        <div style={styles.heroBadge}>
          <Sparkles size={14} color="var(--orenji-primary)" />
          <span>招き猫の日本文化アカデミー • Maneki-Neko Academy</span>
        </div>

        <h1 className="catalog-hero-title" style={styles.heroTitle}>
          Explore Japanese Culture & <span style={{ color: 'var(--orenji-primary)' }}>Master the Language</span>
        </h1>
        <p className="catalog-hero-subtitle" style={styles.heroSubtitle}>
          Immerse yourself in authentic Japanese culture through curated video lectures — from Hiragana & Kanji mastery to traditional Washoku culinary arts, travel secrets, and modern pop culture.
        </p>

        {/* Categories Under the Big Cat Logo */}
        <div style={{ marginTop: '28px', marginBottom: '8px' }}>
          <span style={styles.categoriesLabel}>Japanese Culture Categories (文化カテゴリー)</span>
        </div>

        <div style={styles.filterRow}>
          {allCategoryTabs.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  ...styles.filterBtn,
                  ...(isSelected ? styles.filterBtnActive : {}),
                }}
              >
                {cat !== 'ALL' && getCategoryIcon(cat)}
                <span>{cat === 'ALL' ? 'All Categories (全て)' : cat}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Courses Grid */}
      {loading ? (
        <div style={styles.loadingGrid}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={styles.skeletonCard} />
          ))}
        </div>
      ) : error ? (
        <div style={styles.errorBox}>
          <p>{error}</p>
          <button onClick={fetchCourses} className="btn-secondary" style={{ marginTop: 12 }}>
            Try Again
          </button>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={{ fontSize: '16px', fontWeight: 600 }}>No categories found matching "{selectedCategory}".</p>
        </div>
      ) : (
        <div className="catalog-grid" style={styles.grid}>
          {filteredCourses.map((course) => (
            <div key={course.id} style={styles.card} className="catalog-card animate-fade">
              <div style={styles.cardHeader} className="catalog-card-header">
                <div style={styles.kanjiBadge} className="catalog-kanji-badge">
                  {course.japaneseTag || getCategoryKanji(course.language)}
                </div>
                <span style={styles.catTag} className="catalog-cat-tag">{course.language}</span>
              </div>

              <h2 style={styles.courseTitle}>{course.title}</h2>
              <p style={styles.courseDesc}>{course.description}</p>

              <div style={styles.metaRow}>
                <div style={styles.metaItem}>
                  <Layers size={15} color="var(--text-muted)" />
                  <span>{course.totalLessons} Video Lectures</span>
                </div>
                <div style={styles.metaItem}>
                  {course.freeLessonsCount > 0 ? (
                    <span className="badge-free">{course.freeLessonsCount} Free Preview</span>
                  ) : (
                    <span className="badge-pro">PRO Content</span>
                  )}
                </div>
              </div>

              <div style={styles.cardFooter}>
                <Link to={`/courses/${course.id}`} className="btn-primary" style={{ width: '100%' }}>
                  <span>Explore Category</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 24px 80px',
  },
  hero: {
    textAlign: 'center',
    maxWidth: '820px',
    margin: '0 auto 50px',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'var(--orenji-light)',
    border: '1px solid var(--orenji-border)',
    color: 'var(--orenji-primary)',
    padding: '6px 18px',
    borderRadius: 'var(--radius-full)',
    fontSize: '13px',
    fontWeight: '700',
    marginBottom: '20px',
    letterSpacing: '0.4px',
  },
  heroTitle: {
    fontSize: '44px',
    fontWeight: '800',
    letterSpacing: '-1.5px',
    color: 'var(--text-primary)',
    lineHeight: 1.15,
    marginBottom: '16px',
  },
  heroSubtitle: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    marginBottom: '24px',
  },
  categoriesLabel: {
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  filterRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  filterBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 18px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--shiro)',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px solid var(--border-subtle)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: 'var(--shadow-sm)',
  },
  filterBtnActive: {
    backgroundColor: 'var(--blue-primary)',
    color: '#fff',
    borderColor: 'var(--blue-primary)',
    boxShadow: '0 2px 10px var(--blue-glow)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--shadow-card)',
    transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '14px',
  },
  kanjiBadge: {
    minWidth: '38px',
    height: '32px',
    padding: '0 8px',
    borderRadius: '8px',
    backgroundColor: 'var(--orenji-light)',
    border: '1px solid var(--orenji-border)',
    color: 'var(--orenji-primary)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '800',
    letterSpacing: '0.4px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    fontFamily: "'Noto Sans JP', sans-serif",
  },
  catTag: {
    fontSize: '13px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    color: 'var(--blue-primary)',
    lineHeight: 1.2,
  },
  courseTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '10px',
    lineHeight: 1.35,
  },
  courseDesc: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    flexGrow: 1,
    marginBottom: '24px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-subtle)',
    marginBottom: '20px',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  cardFooter: {
    marginTop: 'auto',
  },
  skeletonCard: {
    height: '280px',
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
  },
  loadingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '28px',
  },
  errorBox: {
    textAlign: 'center',
    padding: '40px',
    color: '#DC2626',
    backgroundColor: 'var(--danger-bg)',
    borderRadius: 'var(--radius-md)',
  },
  emptyBox: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'var(--text-secondary)',
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
  },
};
