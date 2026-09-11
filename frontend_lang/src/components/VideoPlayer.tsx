import React from 'react';
import { CheckCircle, ExternalLink, Play } from 'lucide-react';
import type { LessonDetail } from '../types/lesson';

interface VideoPlayerProps {
  lesson: LessonDetail;
  onComplete: () => void;
  isCompleting?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ lesson, onComplete, isCompleting = false }) => {
  // Convert video URL to an embeddable format (YouTube or Google Drive)
  const getEmbedUrl = (rawUrl: string): string => {
    if (!rawUrl) return '';

    // Handle YouTube watch URLs
    if (rawUrl.includes('youtube.com/watch')) {
      const match = rawUrl.match(/[?&]v=([^&]+)/);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`;
      }
    }

    // Handle short youtu.be URLs
    if (rawUrl.includes('youtu.be/')) {
      const id = rawUrl.split('youtu.be/')[1]?.split('?')[0];
      if (id) {
        return `https://www.youtube.com/embed/${id}?autoplay=0&rel=0`;
      }
    }

    // Handle Google Drive file URLs
    if (rawUrl.includes('drive.google.com/file/d/')) {
      return rawUrl.replace('/view', '/preview');
    }

    return rawUrl;
  };

  const embedUrl = getEmbedUrl(lesson.videoUrl);

  return (
    <div style={styles.container}>
      <div style={styles.videoWrapper}>
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={lesson.title}
            style={styles.iframe}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div style={styles.fallback}>
            <Play size={48} color="var(--orenji-primary)" />
            <p style={{ marginTop: 12, color: 'var(--text-secondary)' }}>Video stream unavailable or locked</p>
          </div>
        )}
      </div>

      <div style={styles.details}>
        <div>
          <div style={styles.metaRow}>
            <span style={styles.sequenceBadge}>Lecture #{lesson.sequenceNo}</span>
            {lesson.free ? (
              <span className="badge-free">Free Preview</span>
            ) : (
              <span className="badge-pro">PRO Content</span>
            )}
            <span style={styles.courseTitle}>{lesson.courseTitle}</span>
          </div>
          <h1 style={styles.title}>{lesson.title}</h1>
        </div>

        <div style={styles.actionRow}>
          <button
            onClick={onComplete}
            disabled={isCompleting || lesson.completed}
            className={lesson.completed ? 'btn-secondary' : 'btn-success'}
            style={{
              opacity: lesson.completed ? 0.9 : 1,
              cursor: lesson.completed ? 'default' : 'pointer',
            }}
          >
            <CheckCircle size={18} color={lesson.completed ? '#059669' : '#fff'} />
            <span>{lesson.completed ? 'Completed ✓' : isCompleting ? 'Saving...' : 'Mark Finished'}</span>
          </button>

          {lesson.videoUrl && (
            <a
              href={lesson.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              title="Open source stream directly"
            >
              <ExternalLink size={16} />
              <span>Direct Link</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  videoWrapper: {
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%', // 16:9 Aspect Ratio
    backgroundColor: '#0F172A',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-card)',
    border: '1px solid var(--border-subtle)',
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },
  fallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--shiro)',
  },
  details: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '24px',
    flexWrap: 'wrap',
    padding: '24px',
    backgroundColor: 'var(--shiro)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    boxShadow: 'var(--shadow-card)',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  sequenceBadge: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--blue-primary)',
    backgroundColor: 'var(--blue-light)',
    border: '1px solid var(--blue-border)',
    padding: '3px 8px',
    borderRadius: '6px',
  },
  courseTitle: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    lineHeight: 1.3,
  },
  actionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
};
