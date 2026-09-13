import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CultureMascot } from '../components/CultureMascot';
import {
  ArrowRight, Video, BookOpen, Utensils, Compass, Film,
  Award
} from 'lucide-react';

interface LanguageCardData {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  tagline: string;
  description: string;
  badge: string;
  tags: string[];
  courseCount: number;
  lessonCount: number;
  primaryColor: string;
  accentBg: string;
}

const LANGUAGES_DATA: LanguageCardData[] = [
  {
    id: 'japanese',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    tagline: 'Living Nihon Culture',
    description: 'Master practical conversations, food traditions, tea ceremony etiquette, and cultural navigation.',
    badge: 'Nihon Culture',
    tags: ['Culinary & Izakaya', 'Manners & Shinto', 'Tokyo Exploration', 'Kanji Nuances'],
    courseCount: 6,
    lessonCount: 8,
    primaryColor: '#EA580C',
    accentBg: 'rgba(234, 88, 12, 0.08)',
  },
  {
    id: 'korean',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    tagline: 'Modern Hallyu & Traditions',
    description: 'Immerse yourself in K-Wave, culinary street food, Joseon heritage, and modern Hangul fluency.',
    badge: 'K-Culture & Hangul',
    tags: ['K-Drama & K-Pop', 'Street Food & Hansik', 'Seoul Transit & Life', 'Honorifics & Tone'],
    courseCount: 4,
    lessonCount: 6,
    primaryColor: '#DC2626',
    accentBg: 'rgba(220, 38, 38, 0.08)',
  },
  {
    id: 'spanish',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    tagline: 'Fiestas, Flamenco & Living Spanish',
    description: 'Experience Andalusian rhythms, tapas culture, vibrant festivals, and conversational fluidity.',
    badge: 'Cultura Hispánica',
    tags: ['Tapas & Gastronomy', 'Festivales & Danza', 'Madrid & Barcelona', 'Idiomatic Sayings'],
    courseCount: 4,
    lessonCount: 6,
    primaryColor: '#D97706',
    accentBg: 'rgba(217, 119, 6, 0.08)',
  },
  {
    id: 'french',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    tagline: 'Art de Vivre & Gastronomy',
    description: 'Delve into Parisian cafe philosophy, French cinema, haute cuisine, and elegant French expression.',
    badge: 'Culture Française',
    tags: ['Cuisine & Wine', 'Culture & Cinema', 'Voyage Paris & Riviera', 'Langue Pronunciation'],
    courseCount: 4,
    lessonCount: 6,
    primaryColor: '#2563EB',
    accentBg: 'rgba(37, 99, 235, 0.08)',
  },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContainer}>
          <h1 style={styles.mainHeading}>
            Master World Languages Through{' '}
            <span style={{ color: 'var(--orenji-primary)' }}>Living Authentic Culture</span>
          </h1>

          <p style={styles.mainSub}>
            Step beyond boring flashcards. Learn Japanese, Korean, Spanish, and French by diving headfirst into food traditions,
            travel navigation, cinema, music, and cultural etiquette taught through HD video masterclasses.
          </p>
        </div>
      </section>

      {/* Language Hub Grid */}
      <section style={styles.languageHubSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Choose Your Cultural Gateway</h2>
          <p style={styles.sectionSubtitle}>
            Select the culture you wish to explore. Each language features dedicated cultural mascots, categorized video lessons,
            free preview lectures, and native script badges.
          </p>
        </div>

        <div style={styles.cardsGrid}>
          {LANGUAGES_DATA.map((lang) => (
            <div
              key={lang.id}
              style={styles.card}
              className="card-hover-lift"
              onClick={() => navigate(`/languages/${lang.id}`)}
            >
              {/* Card Top Header with Mascot & Flag */}
              <div style={styles.cardHeader}>
                <div style={styles.mascotWrapper}>
                  <CultureMascot language={lang.name} size={76} />
                </div>
                <div style={styles.flagHeaderRow}>
                  <div style={styles.flagBox}>
                    <span style={{ fontSize: '26px', lineHeight: 1 }}>{lang.flag}</span>
                  </div>
                  <div className="catalog-kanji-badge" style={styles.cardBadge}>
                    {lang.badge}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div style={styles.cardBody}>
                <div style={styles.languageNameRow}>
                  <h3 style={styles.languageTitle}>Nyantaro</h3>
                  <span style={styles.nativeTitle}>{lang.nativeName}</span>
                </div>

                <div style={styles.tagline}>{lang.tagline}</div>
                <p style={styles.description}>{lang.description}</p>

                {/* Cultural Tags */}
                <div style={styles.tagsRow}>
                  {lang.tags.map((tag) => (
                    <span key={tag} style={styles.tagPill}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div style={styles.cardFooter}>
                <div style={styles.metaRow}>
                  <div style={styles.metaItem}>
                    <BookOpen size={14} color="var(--orenji-primary)" />
                    <span>{lang.courseCount} Modules</span>
                  </div>
                  <div style={styles.metaItem}>
                    <Video size={14} color="var(--orenji-primary)" />
                    <span>{lang.lessonCount} Video Lectures</span>
                  </div>
                </div>

                <Link
                  to={`/languages/${lang.id}`}
                  className="btn-orenji"
                  style={styles.cardActionBtn}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Enter Nyantaro {lang.nativeName}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cultural Pedagogy Pillars */}
      <section style={styles.pillarsSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Why Culture Makes Fluency Stick</h2>
          <p style={styles.sectionSubtitle}>
            Traditional language apps teach isolated words you quickly forget. We anchor every word in sensory cultural experiences.
          </p>
        </div>

        <div style={styles.pillarsGrid}>
          <div style={styles.pillarCard}>
            <div style={{ ...styles.pillarIcon, backgroundColor: '#FFEDD5', color: 'var(--orenji-primary)' }}>
              <Utensils size={24} />
            </div>
            <h3 style={styles.pillarTitle}>Gastronomy & Culinary Arts</h3>
            <p style={styles.pillarText}>
              Learn dining etiquette, ordering food, regional ingredients, and conversation at the izakaya, tapas bar, or bistro.
            </p>
          </div>

          <div style={styles.pillarCard}>
            <div style={{ ...styles.pillarIcon, backgroundColor: '#FEF3C7', color: '#D97706' }}>
              <Film size={24} />
            </div>
            <h3 style={styles.pillarTitle}>Entertainment & Modern Media</h3>
            <p style={styles.pillarText}>
              Decipher dialogue from Anime, K-Dramas, Spanish cinema, and French classic films to acquire natural slang and humor.
            </p>
          </div>

          <div style={styles.pillarCard}>
            <div style={{ ...styles.pillarIcon, backgroundColor: '#EFF6FF', color: '#2563EB' }}>
              <Compass size={24} />
            </div>
            <h3 style={styles.pillarTitle}>Transit & Travel Navigation</h3>
            <p style={styles.pillarText}>
              Navigate train stations, bullet trains, historic shrines, markets, and regional neighborhoods like a local traveler.
            </p>
          </div>

          <div style={styles.pillarCard}>
            <div style={{ ...styles.pillarIcon, backgroundColor: '#ECFDF5', color: '#059669' }}>
              <Award size={24} />
            </div>
            <h3 style={styles.pillarTitle}>Native Script & Grammar Breakdown</h3>
            <p style={styles.pillarText}>
              Master Kanji, Hangul, accents, and pronunciation subtleties with clear stroke orders and linguistic breakdowns.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section style={styles.statsSection}>
        <div style={styles.statsContainer}>
          <div style={styles.statBox}>
            <div style={styles.statNum}>4</div>
            <div style={styles.statLabel}>Living Cultural Academies</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statNum}>42+</div>
            <div style={styles.statLabel}>HD Curated Video Masterclasses</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statNum}>100%</div>
            <div style={styles.statLabel}>Authentic Native Immersion</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statNum}>Free & PRO</div>
            <div style={styles.statLabel}>Flexible Preview & Full Access</div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section style={styles.ctaBanner}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to begin your cultural immersion?</h2>
          <p style={styles.ctaSub}>
            Pick any language above, watch free preview lectures instantly, or upgrade to PRO for unrestricted access across all 4 cultures.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
            <Link to="/languages/japanese" className="btn-orenji" style={{ padding: '12px 24px', fontSize: '15px' }}>
              <span>Start with Nyantaro 日本語</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/languages/korean" className="btn-secondary" style={{ padding: '12px 24px', fontSize: '15px' }}>
              <span>Start with Nyantaro 한국어</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: 'calc(100vh - 70px)',
    backgroundColor: 'var(--bg-app)',
    color: 'var(--text-primary)',
  },
  heroSection: {
    padding: '60px 24px 40px',
    background: 'radial-gradient(ellipse at 50% 10%, rgba(234, 88, 12, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
    borderBottom: '1px solid var(--border-subtle)',
    textAlign: 'center',
  },
  heroContainer: {
    maxWidth: '920px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  mainHeading: {
    fontSize: 'clamp(32px, 5vw, 52px)',
    fontWeight: 900,
    lineHeight: 1.15,
    letterSpacing: '-0.03em',
    color: 'var(--text-primary)',
    margin: '0 0 18px 0',
  },
  mainSub: {
    fontSize: '17px',
    lineHeight: 1.6,
    color: 'var(--text-secondary)',
    maxWidth: '740px',
    margin: '0',
  },
  languageHubSection: {
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '60px 24px',
  },
  sectionHeader: {
    textAlign: 'center',
    maxWidth: '700px',
    margin: '0 auto 48px auto',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: 'var(--text-primary)',
    margin: '0 0 12px 0',
  },
  sectionSubtitle: {
    fontSize: '16px',
    lineHeight: 1.6,
    color: 'var(--text-secondary)',
    margin: 0,
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid var(--border-subtle)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  cardHeader: {
    padding: '20px 20px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    borderBottom: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--bg-subtle)',
    overflow: 'hidden',
  },
  mascotWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  flagHeaderRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: '6px',
    flex: 1,
    minWidth: 0,
  },
  flagBox: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3px 8px',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--border-subtle)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  cardBadge: {
    fontSize: '11px',
    padding: '3px 8px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
  cardBody: {
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  languageNameRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '10px',
    marginBottom: '6px',
  },
  languageTitle: {
    fontSize: '22px',
    fontWeight: 800,
    margin: 0,
    color: 'var(--text-primary)',
  },
  nativeTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--orenji-primary)',
    fontFamily: "'Noto Sans JP', sans-serif",
  },
  tagline: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '10px',
  },
  description: {
    fontSize: '13px',
    lineHeight: 1.5,
    color: 'var(--text-secondary)',
    margin: '0 0 16px 0',
    flex: 1,
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  tagPill: {
    fontSize: '11px',
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: '6px',
    backgroundColor: 'var(--bg-subtle)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-secondary)',
  },
  cardFooter: {
    padding: '16px 20px 20px',
    borderTop: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  cardActionBtn: {
    width: '100%',
    justifyContent: 'center',
    padding: '10px 16px',
    fontSize: '13px',
    borderRadius: '10px',
  },
  pillarsSection: {
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid var(--border-subtle)',
    borderBottom: '1px solid var(--border-subtle)',
    padding: '70px 24px',
  },
  pillarsGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
  },
  pillarCard: {
    padding: '24px',
    borderRadius: '14px',
    border: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--bg-subtle)',
  },
  pillarIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  pillarTitle: {
    fontSize: '18px',
    fontWeight: 700,
    margin: '0 0 8px 0',
    color: 'var(--text-primary)',
  },
  pillarText: {
    fontSize: '13px',
    lineHeight: 1.6,
    color: 'var(--text-secondary)',
    margin: 0,
  },
  statsSection: {
    padding: '50px 24px',
    backgroundColor: 'var(--bg-app)',
  },
  statsContainer: {
    maxWidth: '1080px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
    textAlign: 'center',
  },
  statBox: {
    padding: '20px',
  },
  statNum: {
    fontSize: '38px',
    fontWeight: 900,
    color: 'var(--orenji-primary)',
    marginBottom: '4px',
    letterSpacing: '-0.02em',
  },
  statLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  ctaBanner: {
    padding: '70px 24px',
    background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(234, 88, 12, 0.05) 100%)',
    borderTop: '1px solid var(--border-subtle)',
    textAlign: 'center',
  },
  ctaContent: {
    maxWidth: '680px',
    margin: '0 auto',
  },
  ctaTitle: {
    fontSize: '28px',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: 'var(--text-primary)',
    margin: '0 0 12px 0',
  },
  ctaSub: {
    fontSize: '15px',
    lineHeight: 1.6,
    color: 'var(--text-secondary)',
    margin: 0,
  },
};
