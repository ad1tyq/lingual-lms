import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate(-1);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div style={styles.container}>
      <div style={styles.cardWrapper}>
        <button
          type="button"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
          className="btn-back"
          style={{ marginBottom: '18px' }}
          title="Go back to previous page"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div style={styles.card} className="animate-fade">
        <div style={styles.header}>
          <div style={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5c-4 0-7.5 2.5-7.5 7 0 4.5 3.5 8 7.5 8s7.5-3.5 7.5-8c0-4.5-3.5-7-7.5-7z" fill="#FFFFFF" fillOpacity="0.25" />
              <path d="M4.5 12c0-4.5 3.5-7 7.5-7s7.5 2.5 7.5 7c0 4.5-3.5 8-7.5 8s-7.5-3.5-7.5-8z" />
              <path d="M6 7.5L4 2.5l5 2.5" />
              <path d="M18 7.5l2-5-5 2.5" />
              <circle cx="9" cy="12" r="1.2" fill="#FFFFFF" />
              <circle cx="15" cy="12" r="1.2" fill="#FFFFFF" />
              <path d="M10.5 14.5c.7.5 2.3.5 3 0" />
            </svg>
          </div>
          <h1 style={styles.title}>{mode === 'login' ? 'Welcome to Nyantaro' : 'Nyantaro'}</h1>
          <p style={styles.subtitle}>
            {mode === 'login'
              ? 'Sign in to access your saved language lectures and cultural learning progress'
              : 'Start your immersion across Japanese, Korean, Spanish, and French cultures'}
          </p>
        </div>

        {/* Tab switcher with smooth sliding indicator */}
        <div style={styles.tabs}>
          <div
            style={{
              ...styles.tabIndicator,
              transform: mode === 'login' ? 'translateX(0%)' : 'translateX(100%)',
            }}
          />
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            style={{
              ...styles.tab,
              color: mode === 'login' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: mode === 'login' ? 700 : 600,
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            style={{
              ...styles.tab,
              color: mode === 'register' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: mode === 'register' ? 700 : 600,
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>{mode === 'login' ? 'Email or Username' : 'Email Address'}</label>
            <div style={styles.inputWrapper}>
              <Mail size={16} style={styles.inputIcon} />
              <input
                type={mode === 'login' ? 'text' : 'email'}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={mode === 'login' ? 'admin or admin@nyantaro.com' : 'you@example.com'}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={16} style={styles.inputIcon} />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={styles.input}
              />
            </div>
            <div
              style={{
                maxHeight: mode === 'register' ? '28px' : '0px',
                opacity: mode === 'register' ? 1 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease',
              }}
            >
              <span style={styles.hint}>Must be at least 6 characters</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-orenji"
            style={{ width: '100%', padding: '12px', marginTop: '6px' }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
            <span>{mode === 'login' ? 'Sign In to Account' : 'Create Free Account'}</span>
          </button>
        </form>



        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <Link
            to="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--orenji-primary)',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <span>Admin Portal -&gt;</span>
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 140px)',
    padding: '40px 24px',
  },
  cardWrapper: {
    width: '100%',
    maxWidth: '440px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '16px',
  },
  card: {
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    boxShadow: 'var(--shadow-card)',
    width: '100%',
    maxWidth: '440px',
    padding: '36px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  logoIcon: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    background: 'var(--orenji-gradient)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    boxShadow: '0 4px 16px rgba(234, 88, 12, 0.25)',
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  tabs: {
    display: 'flex',
    backgroundColor: 'var(--bg-subtle)',
    borderRadius: '10px',
    padding: '4px',
    marginBottom: '24px',
    border: '1px solid var(--border-subtle)',
    position: 'relative',
    userSelect: 'none',
  },
  tabIndicator: {
    position: 'absolute',
    top: '4px',
    bottom: '4px',
    left: '4px',
    width: 'calc(50% - 4px)',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
    transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  tab: {
    flex: 1,
    padding: '9px',
    fontSize: '14px',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    position: 'relative',
    zIndex: 2,
    transition: 'color 0.2s ease',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: 'var(--text-muted)',
  },
  input: {
    width: '100%',
    padding: '12px 14px 12px 42px',
    backgroundColor: 'var(--bg-subtle)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    transition: 'border-color 0.2s',
  },
  hint: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  errorAlert: {
    backgroundColor: 'var(--danger-bg)',
    color: '#DC2626',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '16px',
    border: '1px solid #FECACA',
  },
};
