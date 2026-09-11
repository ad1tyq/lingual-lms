import { request } from './client';
import type { Course, CreateCourseData, CreateLessonData } from '../types/course';
import type { LessonSummary, LessonDetail } from '../types/lesson';

export async function getCourses(category?: string): Promise<Course[]> {
  return request<Course[]>('/api/courses', {
    method: 'GET',
    params: { category },
  });
}

export async function getCourseById(courseId: number): Promise<Course> {
  return request<Course>(`/api/courses/${courseId}`, {
    method: 'GET',
  });
}

export async function getCourseLessons(courseId: number): Promise<LessonSummary[]> {
  return request<LessonSummary[]>(`/api/courses/${courseId}/lessons`, {
    method: 'GET',
  });
}

export async function createCourse(data: CreateCourseData): Promise<Course> {
  return request<Course>('/api/courses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCourse(courseId: number, data: CreateCourseData): Promise<Course> {
  return request<Course>(`/api/courses/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCourse(courseId: number): Promise<void> {
  return request<void>(`/api/courses/${courseId}`, {
    method: 'DELETE',
  });
}

export async function addLessonToCourse(courseId: number, data: CreateLessonData): Promise<LessonDetail> {
  return request<LessonDetail>(`/api/courses/${courseId}/lessons`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteLesson(lessonId: number): Promise<void> {
  return request<void>(`/api/lessons/${lessonId}`, {
    method: 'DELETE',
  });
}
