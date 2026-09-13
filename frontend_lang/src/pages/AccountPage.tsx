import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { getPaymentHistory } from '../api/payments';
import type { PaymentRecord } from '../types/payment';
import { Crown, Sparkles, Receipt, ShieldCheck, Clock, CheckCircle, ArrowLeft } from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user } = useAuth();
  const { openPaywall } = useModal();
  const navigate = useNavigate();
  const [history, setHistory] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadPayments();
  }, [user?.subscriptionStatus]);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await getPaymentHistory();
      setHistory(data);
    } catch {
      // Non-blocking
    } finally {
      setLoading(false);
    }
  };

  const isPro = user?.subscriptionStatus === 'PRO';

  return (
    <div style={styles.container}>
      <button
        type="button"
        onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
        className="btn-back"
        style={{ marginBottom: '20px' }}
        title="Go back"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <div style={styles.header}>
        <h1 style={styles.title}>Account & Subscription</h1>
        <p style={styles.subtitle}>Manage your learning membership, tier status, and billing transactions.</p>
      </div>

      <div style={styles.grid}>
        {/* Profile Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>User Profile</h2>
          <div style={styles.profileRow}>
            <span style={styles.label}>Email Address</span>
            <span style={styles.val}>{user?.email}</span>
          </div>
          <div style={styles.profileRow}>
            <span style={styles.label}>Account ID</span>
            <span style={styles.val}>#{user?.id}</span>
          </div>
          <div style={styles.profileRow}>
            <span style={styles.label}>Account Status</span>
            <span style={{ color: '#10B981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={16} /> Active & Verified
            </span>
          </div>
        </div>

        {/* Subscription Tier Card */}
        <div style={{ ...styles.card, border: isPro ? '1px solid var(--border-orenji)' : '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={styles.cardTitle}>Membership Tier</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: 2 }}>
                {isPro
                  ? 'All Japanese culture categories and video lectures unlocked.'
                  : 'Currently on free tier with 1-2 free preview lectures per category.'}
              </p>
            </div>
            {isPro ? (
              <span className="badge-pro" style={{ padding: '6px 12px' }}>
                <Crown size={14} /> PRO Active
              </span>
            ) : (
              <span className="badge-free" style={{ padding: '6px 12px' }}>FREE Tier</span>
            )}
          </div>

          <div style={{ marginTop: 24 }}>
            {!isPro ? (
              <button
                onClick={() => openPaywall('Upgrade to PRO to unlock all Japanese culture & language lectures!')}
                className="btn-orenji"
                style={{ width: '100%', padding: '12px' }}
              >
                <Sparkles size={16} />
                <span>Upgrade to PRO ($19.99/mo)</span>
              </button>
            ) : (
              <div style={styles.proPerksBox}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--orenji-primary)', fontSize: '14px', fontWeight: 700 }}>
                  <CheckCircle size={16} /> Full Unlimited Japanese Learning Pass Unlocked
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 4 }}>
                  Includes all Japanese categories (Language, Food, Travel, Traditions, Pop Culture), Google Drive links, and future lecture uploads.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div style={{ ...styles.card, marginTop: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Receipt size={20} color="var(--blue-primary)" />
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Billing History & Receipts</h2>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading payment records...</p>
        ) : history.length === 0 ? (
          <div style={styles.emptyTransactions}>
            <Clock size={32} color="var(--text-muted)" />
            <p style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: '14px' }}>
              No payments made yet. When you purchase a PRO membership, receipts will appear here.
            </p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Transaction ID</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((tx) => (
                  <tr key={tx.id} style={styles.tr}>
                    <td style={styles.td}><code>{tx.transactionId}</code></td>
                    <td style={{ ...styles.td, fontWeight: 600, color: 'var(--text-primary)' }}>${tx.amount.toFixed(2)}</td>
                    <td style={styles.td}>
                      <span
                        className={tx.status === 'SUCCESS' ? 'badge-free' : 'badge-pro'}
                        style={{ fontSize: '11px' }}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td style={{ ...styles.td, color: 'var(--text-muted)' }}>
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 24px 80px',
  },
  header: {
    marginBottom: '36px',
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
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '28px',
    boxShadow: 'var(--shadow-card)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '16px',
  },
  profileRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid var(--border-subtle)',
    fontSize: '14px',
  },
  label: {
    color: 'var(--text-muted)',
  },
  val: {
    color: 'var(--text-primary)',
    fontWeight: '500',
  },
  proPerksBox: {
    backgroundColor: 'var(--orenji-light)',
    border: '1px solid var(--orenji-border)',
    borderRadius: 'var(--radius-md)',
    padding: '16px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '14px',
  },
  th: {
    padding: '12px 16px',
    color: 'var(--text-muted)',
    fontWeight: '600',
    fontSize: '12px',
    textTransform: 'uppercase',
    borderBottom: '1px solid var(--border-subtle)',
  },
  tr: {
    borderBottom: '1px solid var(--border-subtle)',
  },
  td: {
    padding: '14px 16px',
    color: 'var(--text-secondary)',
  },
  emptyTransactions: {
    textAlign: 'center',
    padding: '40px 20px',
  },
};
