import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getCourses } from '../api/courses';
import type { Course } from '../types/course';
import {
  ArrowRight, Layers, Utensils, Compass, BookOpen, Film, Flame,
  ArrowLeft
} from 'lucide-react';
import { CultureMascot } from '../components/CultureMascot';

interface CultureMeta {
  targetLanguage: string;
  name: string;
  nativeName: string;
  badge: string;
  flag: string;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
  categoryLabel: string;
}

const CULTURE_CONFIGS: Record<string, CultureMeta> = {
  japanese: {
    targetLanguage: 'Japanese',
    name: 'Japanese',
    nativeName: '日本語',
    badge: 'Nyantaro • 日本語',
    flag: '🇯🇵',
    titlePrefix: 'Nyantaro 日本語: Explore ',
    titleHighlight: 'Japanese Culture & Language',
    subtitle: 'Immerse yourself in authentic Japanese culture through curated video lectures — from Hiragana & Kanji mastery to traditional Washoku culinary arts, travel secrets, and modern pop culture.',
    categoryLabel: 'Japanese Culture Categories (文化カテゴリー)',
  },
  korean: {
    targetLanguage: 'Korean',
    name: 'Korean',
    nativeName: '한국어',
    badge: 'Nyantaro • 한국어',
    flag: '🇰🇷',
    titlePrefix: 'Nyantaro 한국어: Explore ',
    titleHighlight: 'Korean Culture & Language',
    subtitle: 'Immerse yourself in authentic Korean culture through curated video lectures — from King Sejong’s scientific Hangul alphabet to traditional Kimchi, Seoul transit, and the global K-Pop Hallyu wave.',
    categoryLabel: 'Korean Culture Categories (문화 카테고리)',
  },
  spanish: {
    targetLanguage: 'Spanish',
    name: 'Spanish',
    nativeName: 'Español',
    badge: 'Nyantaro • Español',
    flag: '🇪🇸',
    titlePrefix: 'Nyantaro Español: Explore ',
    titleHighlight: 'Spanish Culture & Language',
    subtitle: 'Immerse yourself in authentic Spanish culture through curated video lectures — from Castilian conversational fluency to Andalusian Flamenco, Tapas culinary artistry, and travel wonders.',
    categoryLabel: 'Spanish Culture Categories (Categorías Culturales)',
  },
  french: {
    targetLanguage: 'French',
    name: 'French',
    nativeName: 'Français',
    badge: 'Nyantaro • Français',
    flag: '🇫🇷',
    titlePrefix: 'Nyantaro Français: Explore ',
    titleHighlight: 'French Culture & Language',
    subtitle: 'Immerse yourself in authentic French culture through curated video lectures — from melodic pronunciation and grammar to Parisian bistro dining, wine terroirs, and Impressionist art.',
    categoryLabel: 'French Culture Categories (Catégories Culturelles)',
  },
};

export const CourseCatalog: React.FC = () => {
  const { languageId } = useParams<{ languageId?: string }>();
  const navigate = useNavigate();

  const activeKey = (languageId || 'japanese').toLowerCase();
  const currentCulture = CULTURE_CONFIGS[activeKey] || {
    targetLanguage: activeKey.charAt(0).toUpperCase() + activeKey.slice(1),
    name: activeKey.charAt(0).toUpperCase() + activeKey.slice(1),
    nativeName: activeKey.toUpperCase(),
    badge: activeKey.toUpperCase(),
    flag: '🌐',
    titlePrefix: `Explore ${activeKey.charAt(0).toUpperCase() + activeKey.slice(1)} Culture & `,
    titleHighlight: 'Master the Language',
    subtitle: `Immerse yourself in authentic ${activeKey} culture through curated video lectures.`,
    categoryLabel: `${activeKey.charAt(0).toUpperCase() + activeKey.slice(1)} Categories`,
  };

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
    setSelectedCategory('ALL');
  }, [currentCulture.targetLanguage]);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCourses(undefined, currentCulture.targetLanguage);
      setCourses(data);
    } catch (err: any) {
      setError(err.message || `Failed to load ${currentCulture.name} culture modules`);
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
    if (c.includes('food') || c.includes('washoku') || c.includes('cuisine') || c.includes('tapas')) return <Utensils size={15} />;
    if (c.includes('travel') || c.includes('tour') || c.includes('sightseeing') || c.includes('seoul') || c.includes('paris') || c.includes('viaje')) return <Compass size={15} />;
    if (c.includes('pop') || c.includes('anime') || c.includes('manga') || c.includes('hallyu') || c.includes('cinema') || c.includes('music')) return <Film size={15} />;
    if (c.includes('tradition') || c.includes('shinto') || c.includes('festival') || c.includes('heritage') || c.includes('flamenco')) return <Flame size={15} />;
    return <BookOpen size={15} />;
  };

  return (
    <div className="catalog-container" style={styles.container}>
      {/* Top Bar: Hub Navigation & Quick Language Switcher */}
      <div style={styles.topNavigationRow}>
        <Link to="/" style={styles.backToHubLink}>
          <ArrowLeft size={16} />
          <span>All Nyantaro Solutions Hub (全言語)</span>
        </Link>

        {/* Language Switcher Pills */}
        <div style={styles.langPillsWrapper}>
          {Object.entries(CULTURE_CONFIGS).map(([key, config]) => {
            const isCurrent = key === activeKey;
            return (
              <button
                key={key}
                onClick={() => navigate(`/languages/${key}`)}
                style={{
                  ...styles.langPillBtn,
                  ...(isCurrent ? styles.langPillBtnActive : {}),
                }}
              >
                <span>{config.flag}</span>
                <span>Nyantaro {config.nativeName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Banner with Big Cultural Mascot */}
      <section className="catalog-hero" style={styles.hero}>
        {/* Culture Mascot */}
        <div style={{ marginBottom: '24px' }}>
          <CultureMascot language={currentCulture.targetLanguage} size={150} />
        </div>

        <div style={styles.badgeRow}>
          <div className="catalog-kanji-badge" style={{ fontSize: '13px', padding: '5px 14px' }}>
            {currentCulture.flag} {currentCulture.badge}
          </div>
        </div>

        <h1 className="catalog-hero-title" style={styles.heroTitle}>
          {currentCulture.titlePrefix}
          <span style={{ color: 'var(--orenji-primary)' }}>{currentCulture.titleHighlight}</span>
        </h1>
        <p className="catalog-hero-subtitle" style={styles.heroSubtitle}>
          {currentCulture.subtitle}
        </p>

        {/* Categories Under the Culture Mascot */}
        <div style={{ marginTop: '28px', marginBottom: '8px' }}>
          <span style={styles.categoriesLabel}>{currentCulture.categoryLabel}</span>
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
                  {course.japaneseTag || currentCulture.nativeName}
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
                  <span>Enter Course & Watch Lectures</span>
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
    padding: '30px 24px 80px',
  },
  topNavigationRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '28px',
  },
  backToHubLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: '8px',
    backgroundColor: 'var(--shiro)',
    border: '1px solid var(--border-subtle)',
    transition: 'all 0.15s ease',
  },
  langPillsWrapper: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  langPillBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '9999px',
    border: '1px solid var(--border-subtle)',
    backgroundColor: '#FFFFFF',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  langPillBtnActive: {
    backgroundColor: 'var(--orenji-primary)',
    borderColor: 'var(--orenji-primary)',
    color: '#FFFFFF',
    boxShadow: '0 2px 8px var(--orenji-glow)',
  },
  hero: {
    textAlign: 'center',
    maxWidth: '820px',
    margin: '0 auto 50px',
  },
  badgeRow: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '14px',
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
    backgroundColor: 'var(--orenji-primary)',
    color: '#fff',
    borderColor: 'var(--orenji-primary)',
    boxShadow: '0 2px 10px var(--orenji-glow)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    border: '1px solid var(--border-subtle)',
    boxShadow: 'var(--shadow-md)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  kanjiBadge: {
    fontFamily: "'Noto Sans JP', sans-serif",
  },
  catTag: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--orenji-primary)',
    backgroundColor: 'var(--orenji-light)',
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
  },
  courseTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '10px',
    lineHeight: 1.3,
  },
  courseDesc: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    marginBottom: '20px',
    flex: 1,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontWeight: '500',
  },
  cardFooter: {
    marginTop: 'auto',
  },
  loadingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '24px',
  },
  skeletonCard: {
    height: '280px',
    backgroundColor: '#FFFFFF',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    opacity: 0.6,
  },
  errorBox: {
    padding: '32px',
    textAlign: 'center',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: 'var(--radius-md)',
    color: '#DC2626',
  },
  emptyBox: {
    padding: '60px 24px',
    textAlign: 'center',
    color: 'var(--text-secondary)',
  },
};
