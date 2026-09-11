import { request } from './client';
import type { CourseProgress, ProgressResponse } from '../types/progress';

export async function markLessonComplete(lessonId: number): Promise<ProgressResponse> {
  return request<ProgressResponse>(`/api/progress/${lessonId}/complete`, {
    method: 'POST',
  });
}

export async function getCourseProgress(courseId: number): Promise<CourseProgress> {
  return request<CourseProgress>(`/api/progress/courses/${courseId}`, {
    method: 'GET',
  });
}
