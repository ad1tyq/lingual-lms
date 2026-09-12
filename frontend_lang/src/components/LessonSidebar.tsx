import React from 'react';
import { Play, Lock, CheckCircle2, Circle } from 'lucide-react';
import type { LessonSummary } from '../types/lesson';
import { ProgressBar } from './ProgressBar';

interface LessonSidebarProps {
  courseTitle: string;
  lessons: LessonSummary[];
  activeLessonId?: number;
  onSelectLesson: (lesson: LessonSummary) => void;
  completedCount: number;
  totalCount: number;
}

export const LessonSidebar: React.FC<LessonSidebarProps> = ({
  courseTitle,
  lessons,
  activeLessonId,
  onSelectLesson,
  completedCount,
  totalCount,
}) => {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.header}>
        <h2 style={styles.courseTitle}>{courseTitle}</h2>
        <div style={{ marginTop: 14 }}>
          <ProgressBar completed={completedCount} total={totalCount} />
        </div>
      </div>

      <div style={styles.list}>
        {lessons.map((lesson) => {
          const isActive = lesson.id === activeLessonId;
          const isLocked = lesson.locked;

          return (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson)}
              style={{
                ...styles.item,
                ...(isActive ? styles.itemActive : {}),
                ...(isLocked ? styles.itemLocked : {}),
              }}
            >
              <div style={styles.itemLeft}>
                <span style={styles.sequence}>#{lesson.sequenceNo}</span>
                <div style={styles.iconWrapper}>
                  {lesson.completed ? (
                    <CheckCircle2 size={16} color="#059669" />
                  ) : isLocked ? (
                    <Lock size={15} color="var(--orenji-primary)" />
                  ) : isActive ? (
                    <Play size={15} color="var(--orenji-primary)" fill="var(--orenji-primary)" />
                  ) : (
                    <Circle size={15} color="var(--text-muted)" />
                  )}
                </div>
                <span style={{ ...styles.itemTitle, ...(isActive ? styles.itemTitleActive : {}) }}>
                  {lesson.title}
                </span>
              </div>

              <div>
                {lesson.free ? (
                  <span className="badge-free" style={{ fontSize: '10px' }}>Free</span>
                ) : isLocked ? (
                  <span className="badge-pro" style={{ fontSize: '10px' }}>PRO</span>
                ) : (
                  <span className="badge-orenji" style={{ fontSize: '10px' }}>Unlocked</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: '380px',
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 'calc(100vh - 120px)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-card)',
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--bg-subtle)',
  },
  courseTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    lineHeight: 1.3,
  },
  list: {
    padding: '10px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 14px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    textAlign: 'left',
    transition: 'all 0.2s ease',
    width: '100%',
    cursor: 'pointer',
  },
  itemActive: {
    backgroundColor: 'var(--orenji-light)',
    borderColor: 'var(--orenji-border)',
    boxShadow: '0 1px 4px var(--orenji-glow)',
  },
  itemLocked: {
    opacity: 0.9,
  },
  itemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    maxWidth: '75%',
  },
  sequence: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    width: '24px',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  itemTitleActive: {
    color: 'var(--orenji-primary)',
    fontWeight: '700',
  },
};
