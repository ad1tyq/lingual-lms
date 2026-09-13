export interface Course {
  id: number;
  targetLanguage?: string;
  language: string;
  category?: string;
  title: string;
  description: string;
  japaneseTag?: string;
  totalLessons: number;
  freeLessonsCount: number;
}

export interface CreateCourseData {
  targetLanguage?: string;
  category: string;
  title: string;
  description: string;
  japaneseTag?: string;
}

export interface CreateLessonData {
  title: string;
  videoUrl: string;
  isFree: boolean;
  sequenceNo?: number;
}
