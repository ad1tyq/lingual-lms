import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import {
  Crown, Sparkles, LogOut, User as UserIcon, Shield,
  Menu, X, ChevronRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { openPaywall } = useModal();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Automatically close mobile menu upon navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isPro = user?.subscriptionStatus === 'PRO';
  const isAdmin = user && (user.role === 'ADMIN' || user.email === 'admin@nyantaro.com' || user.email === 'admin@japan.com' || user.username === 'admin');

  // Determine dynamic brand state based on current route
  const getLanguageContext = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/japanese')) {
      return {
        isLanguageSpecific: true,
        mainName: 'Nyantaro',
        sideBadge: '日本語',
        subName: 'Japanese Language & Culture',
      };
    }
    if (path.includes('/korean')) {
      return {
        isLanguageSpecific: true,
        mainName: 'Nyantaro',
        sideBadge: '한국어',
        subName: 'Korean Language & Culture',
      };
    }
    if (path.includes('/spanish')) {
      return {
        isLanguageSpecific: true,
        mainName: 'Nyantaro',
        sideBadge: 'Español',
        subName: 'Spanish Language & Culture',
      };
    }
    if (path.includes('/french')) {
      return {
        isLanguageSpecific: true,
        mainName: 'Nyantaro',
        sideBadge: 'Français',
        subName: 'French Language & Culture',
      };
    }
    return {
      isLanguageSpecific: false,
      mainName: 'Nyantaro',
      sideBadge: 'Global',
      subName: 'World Languages & Living Cultures',
    };
  };

  const langContext = getLanguageContext();

  return (
    <header style={styles.header}>
      <div className="navbar-container" style={styles.container}>
        {/* Left Section: Brand Logo (Acts as Home Page Link) */}
        <div className="navbar-left-section" style={styles.leftSection}>
          <Link to="/" className="navbar-brand" style={styles.brand} onClick={() => setMobileMenuOpen(false)}>
            <div className="navbar-logo-icon" style={styles.logoIcon}>
              {/* Cute Nyantaro Cat Vector Logo */}
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
            <div>
              <div style={styles.brandRow}>
                {langContext.isLanguageSpecific ? (
                  <>
                    <span className="navbar-logo-text" style={styles.logoText}>{langContext.mainName}</span>
                    <span className="navbar-kanji-tag" style={styles.kanjiTag}>{langContext.sideBadge}</span>
                  </>
                ) : (
                  <span className="navbar-logo-text" style={styles.logoText}>
                    Nyantaro <span style={{ color: 'var(--orenji-primary)' }}>Language Solutions</span>
                  </span>
                )}
              </div>
              <span className="navbar-logo-sub" style={styles.logoSub}>{langContext.subName}</span>
            </div>
          </Link>
        </div>

        {/* Right Section: Desktop Actions & User Navigation */}
        <div className="navbar-desktop-actions" style={styles.rightSection}>
          {user && (
            <Link
              to="/account"
              style={{
                ...styles.navLink,
                ...(location.pathname === '/account' ? styles.navLinkActive : {}),
              }}
            >
              <UserIcon size={15} />
              <span>Account</span>
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              style={{
                ...styles.navLink,
                ...(location.pathname === '/admin' ? styles.navLinkActive : {}),
                color: 'var(--orenji-primary)',
                fontWeight: 700,
                backgroundColor: location.pathname === '/admin' ? 'var(--orenji-light)' : 'rgba(234, 88, 12, 0.08)',
                border: '1px solid var(--orenji-border)',
              }}
            >
              <Shield size={15} />
              <span>Admin Studio</span>
            </Link>
          )}

          {user ? (
            <div style={styles.userSection}>
              {/* Only show PRO MEMBER badge to non-admin users to avoid crowding */}
              {!isAdmin && isPro && (
                <div className="badge-pro" style={{ padding: '5px 10px', fontSize: '11px', cursor: 'default', whiteSpace: 'nowrap' }}>
                  <Crown size={13} />
                  <span>PRO MEMBER</span>
                </div>
              )}
              {!isAdmin && !isPro && (
                <button
                  onClick={() => openPaywall('Upgrade to PRO to unlock all Nyantaro language masterclasses!')}
                  className="btn-orenji navbar-auth-btn"
                  style={{ padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                >
                  <Sparkles size={13} />
                  <span>Upgrade</span>
                </button>
              )}

              <div style={styles.userMenu}>
                <span className="navbar-user-email" style={styles.userEmail} title={user.username || user.email}>
                  <UserIcon size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                  {user.username || user.email}
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  title="Logout"
                  style={styles.logoutBtn}
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          ) : (
            <div className="navbar-auth-group" style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <Link to="/login" className="btn-secondary navbar-auth-btn" style={{ padding: '7px 13px', fontSize: '13px', whiteSpace: 'nowrap' }}>
                Sign In
              </Link>
              <Link to="/login?mode=register" className="btn-orenji navbar-auth-btn" style={{ padding: '7px 13px', fontSize: '13px', whiteSpace: 'nowrap' }}>
                Start Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Header Controls (Right side hamburger toggle) */}
        <div className="navbar-mobile-controls" style={styles.mobileControls}>
          {user && (isAdmin ? (
            <div className="badge-pro" style={{ padding: '4px 8px', fontSize: '11px', whiteSpace: 'nowrap', backgroundColor: 'var(--orenji-light)', color: 'var(--orenji-primary)', border: '1px solid var(--orenji-border)' }}>
              <Shield size={12} />
              <span>ADMIN</span>
            </div>
          ) : isPro ? (
            <div className="badge-pro" style={{ padding: '4px 8px', fontSize: '11px', whiteSpace: 'nowrap' }}>
              <Crown size={12} />
              <span>PRO</span>
            </div>
          ) : null)}

          <button
            type="button"
            className="navbar-hamburger-btn"
            style={styles.hamburgerBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          >
            {mobileMenuOpen ? <X size={22} color="var(--text-primary)" /> : <Menu size={22} color="var(--text-primary)" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer Menu */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-drawer animate-fade" style={styles.mobileDrawer}>
          <div style={styles.drawerInner}>
            {/* Cultural Gateways Section */}
            <div style={styles.drawerSectionHeader}>
              <span>Language Academies (言語選択)</span>
            </div>

            <div style={styles.drawerLinksList}>
              {[
                { id: 'japanese', flag: '🇯🇵', name: 'Nyantaro', native: '日本語', sub: 'Japanese Academy' },
                { id: 'korean', flag: '🇰🇷', name: 'Nyantaro', native: '한국어', sub: 'Korean Academy' },
                { id: 'spanish', flag: '🇪🇸', name: 'Nyantaro', native: 'Español', sub: 'Spanish Academy' },
                { id: 'french', flag: '🇫🇷', name: 'Nyantaro', native: 'Français', sub: 'French Academy' },
              ].map((lang) => {
                const isActive = location.pathname.includes(`/${lang.id}`);
                return (
                  <Link
                    key={lang.id}
                    to={`/languages/${lang.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      ...styles.drawerLinkItem,
                      ...(isActive ? styles.drawerLinkItemActive : {}),
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '22px' }}>{lang.flag}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                          {lang.name} <span style={{ color: 'var(--orenji-primary)' }}>{lang.native}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lang.sub}</div>
                      </div>
                    </div>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </Link>
                );
              })}
            </div>

            {/* Account & Admin Section */}
            {user && (
              <>
                <div style={styles.drawerSectionHeader}>
                  <span>Account & Management</span>
                </div>
                <div style={styles.drawerLinksList}>
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      ...styles.drawerLinkItem,
                      ...(location.pathname === '/account' ? styles.drawerLinkItemActive : {}),
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <UserIcon size={18} color="var(--orenji-primary)" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>My Account</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Preferences & Subscription</div>
                      </div>
                    </div>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        ...styles.drawerLinkItem,
                        ...(location.pathname === '/admin' ? styles.drawerLinkItemActive : {}),
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Shield size={18} color="var(--orenji-primary)" />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--orenji-primary)' }}>Admin Studio</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Analytics & Course Command</div>
                        </div>
                      </div>
                      <ChevronRight size={16} color="var(--text-muted)" />
                    </Link>
                  )}
                </div>
              </>
            )}

            {/* User Session / Auth Section */}
            <div style={styles.drawerAuthSection}>
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={styles.drawerUserInfo}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <UserIcon size={16} color="var(--text-secondary)" />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{user.username || user.email}</span>
                    </div>
                    {isAdmin ? (
                      <span className="badge-pro" style={{ fontSize: '10px', padding: '3px 8px', backgroundColor: 'var(--orenji-light)', color: 'var(--orenji-primary)', border: '1px solid var(--orenji-border)' }}>ADMIN</span>
                    ) : isPro ? (
                      <span className="badge-pro" style={{ fontSize: '10px', padding: '3px 8px' }}>PRO MEMBER</span>
                    ) : (
                      <span className="badge-free" style={{ fontSize: '10px', padding: '3px 8px' }}>FREE TIER</span>
                    )}
                  </div>

                  {!isAdmin && !isPro && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openPaywall('Upgrade to PRO to unlock all Nyantaro language masterclasses!');
                      }}
                      className="btn-orenji"
                      style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '13px' }}
                    >
                      <Sparkles size={15} />
                      <span>Upgrade to PRO Access</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', padding: '9px', fontSize: '13px' }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '14px' }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login?mode=register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-orenji"
                    style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '14px' }}
                  >
                    Start Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
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
    position: 'relative',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: 0,
    flexShrink: 0,
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '10px',
    minWidth: 0,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    minWidth: 0,
    flexShrink: 0,
  },
  logoIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: 'var(--orenji-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px var(--orenji-glow)',
    flexShrink: 0,
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
    whiteSpace: 'nowrap',
  },
  kanjiTag: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--orenji-primary)',
    backgroundColor: 'var(--orenji-light)',
    padding: '2px 7px',
    borderRadius: '4px',
    fontFamily: "'Noto Sans JP', sans-serif",
    border: '1px solid var(--orenji-border)',
    whiteSpace: 'nowrap',
  },
  logoSub: {
    display: 'block',
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: 'var(--radius-md)',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
  },
  navLinkActive: {
    color: 'var(--orenji-primary)',
    backgroundColor: 'var(--orenji-light)',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 6px 4px 12px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--bg-subtle)',
    border: '1px solid var(--border-subtle)',
  },
  userEmail: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    maxWidth: '140px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#FFFFFF',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  mobileControls: {
    display: 'none',
    alignItems: 'center',
    gap: '10px',
  },
  hamburgerBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'var(--bg-subtle)',
    border: '1px solid var(--border-subtle)',
    cursor: 'pointer',
  },
  mobileDrawer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--border-subtle)',
    boxShadow: '0 14px 28px rgba(0, 0, 0, 0.12)',
    maxHeight: 'calc(100vh - 70px)',
    overflowY: 'auto',
    zIndex: 99,
  },
  drawerInner: {
    padding: '20px 18px 30px',
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  drawerSectionHeader: {
    fontSize: '11px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    color: 'var(--text-muted)',
    paddingLeft: '4px',
  },
  drawerLinksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  drawerLinkItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    borderRadius: '12px',
    backgroundColor: 'var(--bg-subtle)',
    border: '1px solid var(--border-subtle)',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
  },
  drawerLinkItemActive: {
    backgroundColor: 'var(--orenji-light)',
    borderColor: 'var(--orenji-primary)',
  },
  drawerAuthSection: {
    paddingTop: '12px',
    borderTop: '1px solid var(--border-subtle)',
  },
  drawerUserInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    borderRadius: '10px',
    backgroundColor: 'var(--bg-subtle)',
    border: '1px solid var(--border-subtle)',
  },
};
