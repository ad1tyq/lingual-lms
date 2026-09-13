import React from 'react';
import { Link } from 'react-router-dom';
import { Globe2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Main Footer Grid */}
        <div style={styles.grid}>
          {/* Brand & Socials Column */}
          <div style={styles.brandCol}>
            <Link to="/" style={styles.brandLink}>
              <div style={styles.logoIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5c-4 0-7.5 2.5-7.5 7 0 4.5 3.5 8 7.5 8s7.5-3.5 7.5-8c0-4.5-3.5-7-7.5-7z" fill="#FFFFFF" fillOpacity="0.25" />
                  <path d="M4.5 12c0-4.5 3.5-7 7.5-7s7.5 2.5 7.5 7c0 4.5-3.5 8-7.5 8s-7.5-3.5-7.5-8z" />
                  <path d="M6 7.5L4 2.5l5 2.5" />
                  <path d="M18 7.5l2-5-5 2.5" />
                  <circle cx="9" cy="12" r="1.2" fill="#FFFFFF" />
                  <circle cx="15" cy="12" r="1.2" fill="#FFFFFF" />
                  <path d="M10.5 14.5c.7.5 2.3.5 3 0" />
                </svg>
              </div>
              <span style={styles.brandName}>
                Nyantaro <span style={{ color: 'var(--orenji-primary)' }}>Language Solutions</span>
              </span>
            </Link>

            <p style={styles.brandDesc}>
              Master Japanese, Korean, Spanish, and French through living authentic culture. Dive headfirst into culinary arts,
              traditions, cinema, music, and cultural etiquette taught through masterclasses.
            </p>

            {/* Social Media Links */}
            <div style={styles.socialGroup}>
              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow Nyantaro on X"
                style={styles.socialBtn}
                className="social-hover"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Watch Nyantaro Cultural Masterclasses on YouTube"
                style={styles.socialBtn}
                className="social-hover"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow Nyantaro on Instagram"
                style={styles.socialBtn}
                className="social-hover"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              {/* Discord */}
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Join the Nyantaro Language Discord Community"
                style={styles.socialBtn}
                className="social-hover"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Language Academies Column */}
          <div style={styles.linksCol}>
            <h4 style={styles.colTitle}>Language Academies</h4>
            <ul style={styles.linksList}>
              <li>
                <Link to="/languages/japanese" style={styles.footerLink}>
                  <span>🇯🇵 Nyantaro 日本語</span>
                </Link>
              </li>
              <li>
                <Link to="/languages/korean" style={styles.footerLink}>
                  <span>🇰🇷 Nyantaro 한국어</span>
                </Link>
              </li>
              <li>
                <Link to="/languages/spanish" style={styles.footerLink}>
                  <span>🇪🇸 Nyantaro Español</span>
                </Link>
              </li>
              <li>
                <Link to="/languages/french" style={styles.footerLink}>
                  <span>🇫🇷 Nyantaro Français</span>
                </Link>
              </li>
              <li>
                <Link to="/" style={styles.footerLink}>
                  <Globe2 size={13} style={{ marginRight: 6 }} />
                  <span>All Cultural Gateways</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Learning Column */}
          <div style={styles.linksCol}>
            <h4 style={styles.colTitle}>Platform & Courses</h4>
            <ul style={styles.linksList}>
              <li>
                <Link to="/languages/japanese" style={styles.footerLink}>
                  <span>Course Catalog</span>
                </Link>
              </li>
              <li>
                <Link to="/login" style={styles.footerLink}>
                  <span>Sign In / Join</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Culture Philosophy Column */}
          <div style={styles.linksCol}>
            <h4 style={styles.colTitle}>Culture-First Method</h4>
            <ul style={styles.linksList}>
              <li>
                <span style={styles.staticText}>🍱 Gastronomy & Dining</span>
              </li>
              <li>
                <span style={styles.staticText}>⛩️ Traditions & Etiquette</span>
              </li>
              <li>
                <span style={styles.staticText}>🎬 Cinema & Pop Culture</span>
              </li>
              <li>
                <span style={styles.staticText}>🗣️ Living Idiomatic Speech</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Subfooter Bar */}
        <div style={styles.subFooter}>
          <div style={styles.copyText}>
            © {new Date().getFullYear()} Nyantaro Language Solutions. All rights reserved.
          </div>
          <div style={styles.taglineText}>
            <span>Crafted with living cultural immersion</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid var(--border-subtle)',
    marginTop: 'auto',
    padding: '48px 24px 24px',
  },
  container: {
    maxWidth: '1240px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '40px',
    marginBottom: '40px',
  },
  brandCol: {
    gridColumn: 'span 1',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  brandLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    backgroundColor: 'var(--orenji-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px var(--orenji-glow)',
    flexShrink: 0,
  },
  brandName: {
    fontSize: '18px',
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: '-0.3px',
  },
  brandDesc: {
    fontSize: '13px',
    lineHeight: 1.6,
    color: 'var(--text-secondary)',
    margin: 0,
  },
  socialGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '6px',
  },
  socialBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: 'var(--bg-subtle)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-subtle)',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
  linksCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  colTitle: {
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    color: 'var(--text-primary)',
    margin: 0,
  },
  linksList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  footerLink: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    transition: 'color 0.15s ease',
  },
  staticText: {
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
  subFooter: {
    paddingTop: '24px',
    borderTop: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  copyText: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  taglineText: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
  },
};
