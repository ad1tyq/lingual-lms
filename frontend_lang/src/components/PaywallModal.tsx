import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import { initiateCheckout, simulateWebhookApproval } from '../api/payments';
import { Crown, Sparkles, Check, X, Shield, Zap, Loader2, Lock } from 'lucide-react';

export const PaywallModal: React.FC = () => {
  const navigate = useNavigate();
  const { isPaywallOpen, paywallMessage, closePaywall } = useModal();
  const { user, refreshUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<{ transactionId: string; amount: number } | null>(null);

  if (!isPaywallOpen) return null;

  const handleStartCheckout = async () => {
    if (!user) {
      setError('Please sign in first to upgrade your account.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await initiateCheckout({ plan: 'PRO_MONTHLY' });
      setCheckoutData({
        transactionId: response.transactionId,
        amount: response.amount,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to initiate checkout');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!checkoutData) return;
    setLoading(true);
    setError(null);
    try {
      await simulateWebhookApproval(checkoutData.transactionId);
      await refreshUser();
      setSuccess(true);
      setTimeout(() => {
        closePaywall();
        setSuccess(false);
        setCheckoutData(null);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Payment simulation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={closePaywall}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()} className="animate-fade">
        <button style={styles.closeBtn} onClick={closePaywall} title="Close">
          <X size={20} />
        </button>

        <div style={styles.header}>
          <div style={styles.badgeWrapper}>
            {!user ? <Lock size={28} color="var(--orenji-primary)" /> : <Crown size={28} color="var(--orenji-primary)" />}
          </div>
          <h2 style={styles.title}>
            {!user ? 'Account Required to Open Videos' : 'Unlock Full Japanese Academy Access'}
          </h2>
          <p style={styles.subtitle}>
            {paywallMessage || (!user 
              ? 'You cannot open or watch any videos without creating an account or logging in. Create your free account today!' 
              : 'The first 1-2 lectures are free preview. Upgrade to PRO to unlock all Japanese culture & language lectures!')}
          </p>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div style={styles.successBox}>
            <Sparkles size={40} color="#059669" />
            <h3 style={{ color: '#059669', marginTop: 12 }}>PRO Upgrade Activated! (おめでとうございます)</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: 4 }}>
              All Japanese culture modules and video lectures are now fully unlocked for your account.
            </p>
          </div>
        ) : (
          <>
            <div style={styles.features}>
              <div style={styles.featureItem}>
                <div style={styles.checkIcon}><Check size={14} color="#059669" /></div>
                <span>Unlock lectures across <strong>Language</strong>, <strong>Washoku Food</strong>, <strong>Travel</strong>, & <strong>Pop Culture</strong></span>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.checkIcon}><Check size={14} color="#059669" /></div>
                <span>Direct Google Drive & YouTube video stream access</span>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.checkIcon}><Check size={14} color="#059669" /></div>
                <span>Complete progress tracking & lesson completion checkmarks</span>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.checkIcon}><Check size={14} color="#059669" /></div>
                <span>Curated authentic Japanese cultural curriculum</span>
              </div>
            </div>

            {!user ? (
              <div style={styles.pricingCard}>
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                  <span style={styles.planName}>Start With Free Previews</span>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: 4 }}>
                    Sign in or register a free account to watch introductory lectures in every culture category!
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                  <button
                    onClick={() => {
                      closePaywall();
                      navigate('/login?mode=register');
                    }}
                    className="btn-orenji"
                    style={{ width: '100%', padding: '13px', fontSize: '15px' }}
                  >
                    <Sparkles size={16} />
                    <span>Create Free Account</span>
                  </button>
                  <button
                    onClick={() => {
                      closePaywall();
                      navigate('/login');
                    }}
                    className="btn-secondary"
                    style={{ width: '100%', padding: '11px', fontSize: '14px' }}
                  >
                    <span>Sign In to Existing Account</span>
                  </button>
                </div>
              </div>
            ) : (
              <div style={styles.pricingCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={styles.planName}>PRO Monthly Pass</span>
                    <span style={styles.planSub}>All Japanese culture categories included</span>
                  </div>
                  <div style={styles.priceTag}>
                    <span style={styles.currency}>$</span>
                    <span style={styles.amount}>19.99</span>
                    <span style={styles.period}>/mo</span>
                  </div>
                </div>

                {!checkoutData ? (
                  <button
                    onClick={handleStartCheckout}
                    disabled={loading}
                    className="btn-orenji"
                    style={{ width: '100%', marginTop: '18px', padding: '14px', fontSize: '15px' }}
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                    <span>Upgrade to PRO Now</span>
                  </button>
                ) : (
                  <div style={styles.checkoutBox}>
                    <div style={styles.txRow}>
                      <span style={{ color: 'var(--text-muted)' }}>Transaction ID:</span>
                      <code style={{ fontSize: '12px' }}>{checkoutData.transactionId}</code>
                    </div>
                    <button
                      onClick={handleSimulatePayment}
                      disabled={loading}
                      className="btn-success"
                      style={{ width: '100%', marginTop: '12px', padding: '12px' }}
                    >
                      {loading ? <Loader2 size={16} /> : <Check size={16} />}
                      <span>Confirm & Complete Payment ($19.99)</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <div style={styles.footerNote}>
              <Shield size={14} color="var(--text-muted)" />
              <span>Instant access via secure account authentication</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '20px',
  },
  modal: {
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-orenji)',
    boxShadow: 'var(--shadow-orenji)',
    width: '100%',
    maxWidth: '520px',
    padding: '32px',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  badgeWrapper: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: 'var(--orenji-light)',
    border: '1px solid var(--orenji-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    boxShadow: '0 0 25px rgba(234, 88, 12, 0.2)',
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
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
    backgroundColor: 'var(--bg-subtle)',
    padding: '16px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  checkIcon: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'var(--emerald-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pricingCard: {
    backgroundColor: 'var(--orenji-light)',
    border: '1px solid var(--orenji-border)',
    borderRadius: 'var(--radius-md)',
    padding: '20px',
    marginBottom: '18px',
  },
  planName: {
    display: 'block',
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  planSub: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  priceTag: {
    display: 'flex',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--orenji-primary)',
  },
  amount: {
    fontSize: '32px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginLeft: '2px',
  },
  period: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginLeft: '4px',
  },
  checkoutBox: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-subtle)',
  },
  txRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
  },
  successBox: {
    textAlign: 'center',
    padding: '30px 20px',
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
  footerNote: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
};
