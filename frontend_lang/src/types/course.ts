export interface Course {
  id: number;
  language: string;
  category?: string;
  title: string;
  description: string;
  totalLessons: number;
  freeLessonsCount: number;
}

export interface CreateCourseData {
  category: string;
  title: string;
  description: string;
}

export interface CreateLessonData {
  title: string;
  videoUrl: string;
  isFree: boolean;
  sequenceNo?: number;
}
