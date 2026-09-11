import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react';

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

  const fillDemoAccount = () => {
    setEmail('learner@japan.com');
    setPassword('Password123!');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} className="animate-fade">
        <div style={styles.header}>
          <div style={styles.logoIcon}>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>日</span>
          </div>
          <h1 style={styles.title}>{mode === 'login' ? 'Welcome to Nihon Culture' : 'Join Nihon Culture Academy'}</h1>
          <p style={styles.subtitle}>
            {mode === 'login'
              ? 'Sign in to access your saved Japanese lectures and progress'
              : 'Start discovering Japanese language, food, travel, and traditions'}
          </p>
        </div>

        {/* Tab switcher */}
        <div style={styles.tabs}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            style={{ ...styles.tab, ...(mode === 'login' ? styles.tabActive : {}) }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            style={{ ...styles.tab, ...(mode === 'register' ? styles.tabActive : {}) }}
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
                placeholder={mode === 'login' ? 'admin or learner@japan.com' : 'learner@japan.com'}
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
            {mode === 'register' && (
              <span style={styles.hint}>Must be at least 6 characters</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-orenji"
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
            <span>{mode === 'login' ? 'Sign In to Account' : 'Create Free Account'}</span>
          </button>
        </form>

        <div style={styles.divider}>
          <span>or test with sample credentials</span>
        </div>

        <button onClick={fillDemoAccount} type="button" style={styles.demoBtn}>
          <Sparkles size={14} color="var(--orenji-primary)" />
          <span>Auto-fill Demo Learner Account</span>
        </button>

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
    borderRadius: 'var(--radius-md)',
    padding: '4px',
    marginBottom: '24px',
    border: '1px solid var(--border-subtle)',
  },
  tab: {
    flex: 1,
    padding: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabActive: {
    backgroundColor: 'var(--shiro)',
    color: 'var(--text-primary)',
    boxShadow: 'var(--shadow-sm)',
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
  divider: {
    textAlign: 'center',
    margin: '24px 0 16px',
    borderBottom: '1px solid var(--border-subtle)',
    lineHeight: '0.1em',
    color: 'var(--text-muted)',
    fontSize: '12px',
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
};
