import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { Crown, Sparkles, LogOut, User as UserIcon, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { openPaywall } = useModal();
  const navigate = useNavigate();
  const location = useLocation();

  const isPro = user?.subscriptionStatus === 'PRO';

  return (
    <header style={styles.header}>
      <div className="navbar-container" style={styles.container}>
        {/* Brand */}
        <Link to="/" className="navbar-brand" style={styles.brand}>
          <div className="navbar-logo-icon" style={styles.logoIcon}>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>日</span>
          </div>
          <div>
            <div style={styles.brandRow}>
              <span className="navbar-logo-text" style={styles.logoText}>Nihon<span style={{ color: 'var(--orenji-primary)' }}>Culture</span></span>
              <span className="navbar-kanji-tag" style={styles.kanjiTag}>日本文化</span>
            </div>
            <span className="navbar-logo-sub" style={styles.logoSub}>Japanese Language & Culture Academy</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={styles.nav}>
          {user && (
            <Link
              to="/account"
              style={{
                ...styles.navLink,
                ...(location.pathname === '/account' ? styles.navLinkActive : {}),
              }}
            >
              <UserIcon size={16} />
              <span>My Account</span>
            </Link>
          )}
          {user && (user.role === 'ADMIN' || user.email === 'admin@japan.com' || user.username === 'admin') && (
            <Link
              to="/admin"
              style={{
                ...styles.navLink,
                ...(location.pathname === '/admin' ? styles.navLinkActive : {}),
                color: 'var(--orenji-primary)',
              }}
            >
              <Shield size={16} />
              <span>Admin Studio</span>
            </Link>
          )}
        </nav>

        {/* User & Auth Actions */}
        <div style={styles.actions}>
          {user ? (
            <div style={styles.userSection}>
              {isPro ? (
                <div className="badge-pro" style={{ padding: '6px 12px', cursor: 'default', whiteSpace: 'nowrap' }}>
                  <Crown size={14} />
                  <span>PRO MEMBER</span>
                </div>
              ) : (
                <button
                  onClick={() => openPaywall('Upgrade to PRO to unlock all Japanese Culture & Language lectures!')}
                  className="btn-orenji navbar-auth-btn"
                  style={{ padding: '7px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                >
                  <Sparkles size={14} />
                  <span>Upgrade</span>
                </button>
              )}

              <div style={styles.userMenu}>
                <span className="navbar-user-email" style={styles.userEmail}>
                  <UserIcon size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  {user.email}
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  title="Logout"
                  style={styles.logoutBtn}
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="navbar-auth-group" style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <Link to="/login" className="btn-secondary navbar-auth-btn" style={{ padding: '8px 14px', fontSize: '13px', whiteSpace: 'nowrap' }}>
                Sign In
              </Link>
              <Link to="/login?mode=register" className="btn-orenji navbar-auth-btn" style={{ padding: '8px 14px', fontSize: '13px', whiteSpace: 'nowrap' }}>
                Start Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border-subtle)',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'var(--orenji-gradient)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 3px 10px rgba(234, 88, 12, 0.25)',
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    letterSpacing: '-0.5px',
    display: 'inline-block',
    lineHeight: 1.1,
  },
  kanjiTag: {
    fontSize: '11px',
    backgroundColor: 'var(--blue-light)',
    color: 'var(--blue-primary)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: '700',
  },
  logoSub: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
    fontWeight: '600',
    display: 'block',
    marginTop: '2px',
  },
  nav: {
    display: 'flex',
    gap: '12px',
  },
  navLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: '600',
    padding: '8px 14px',
    borderRadius: 'var(--radius-md)',
    transition: 'all 0.2s',
  },
  navLinkActive: {
    color: 'var(--blue-primary)',
    backgroundColor: 'var(--blue-light)',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    background: 'var(--shiro)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '4px 8px 4px 12px',
  },
  userEmail: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    fontWeight: '500',
    marginRight: '8px',
  },
  logoutBtn: {
    color: 'var(--text-muted)',
    padding: '6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
};
