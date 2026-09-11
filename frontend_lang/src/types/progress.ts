export interface ProgressResponse {
  lessonId: number;
  completed: boolean;
  lastWatchedAt: string;
}

export interface CourseProgress {
  courseId: number;
  totalLessons: number;
  completedLessons: number;
  completionPercentage: number;
  completedLessonIds: number[];
}
