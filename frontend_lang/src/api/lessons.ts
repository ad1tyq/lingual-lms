import { request } from './client';
import type { LessonDetail } from '../types/lesson';

export async function getLessonById(lessonId: number): Promise<LessonDetail> {
  return request<LessonDetail>(`/api/lessons/${lessonId}`, {
    method: 'GET',
  });
}
