export interface LessonSummary {
  id: number;
  courseId: number;
  title: string;
  sequenceNo: number;
  free: boolean;
  locked: boolean;
  videoUrl: string | null;
  completed: boolean | null;
}

export interface LessonDetail {
  id: number;
  courseId: number;
  courseTitle: string;
  title: string;
  sequenceNo: number;
  free: boolean;
  videoUrl: string;
  completed: boolean;
  lastWatchedAt?: string;
}
