import React from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
  percentage?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total, percentage }) => {
  const percent = percentage !== undefined ? percentage : total > 0 ? (completed / total) * 100 : 0;
  const rounded = Math.round(percent);

  return (
    <div style={styles.container}>
      <div style={styles.infoRow}>
        <span style={styles.label}>Course Progress</span>
        <span style={styles.stat}>
          {completed} of {total} lectures ({rounded}%)
        </span>
      </div>
      <div style={styles.track}>
        <div
          style={{
            ...styles.fill,
            width: `${Math.min(100, Math.max(0, rounded))}%`,
          }}
        />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    fontSize: '12px',
    fontWeight: '600',
  },
  label: {
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  stat: {
    color: 'var(--text-primary)',
  },
  track: {
    width: '100%',
    height: '8px',
    backgroundColor: 'var(--bg-elevated)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
    border: '1px solid var(--border-subtle)',
  },
  fill: {
    height: '100%',
    background: 'linear-gradient(90deg, #6366F1 0%, #10B981 100%)',
    borderRadius: 'var(--radius-full)',
    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
};
