import request from './index'
import type { Course, Chapter, CourseResource, PaginationParams, PaginatedResponse } from '@/types'

export function getCourses(params: PaginationParams & Record<string, any>) {
  return request.get<PaginatedResponse<Course>>('/courses', { params })
}

export function getCourse(id: number) {
  return request.get<Course>(`/courses/${id}`)
}

export function createCourse(data: Partial<Course>) {
  return request.post<Course>('/courses', data)
}

export function updateCourse(id: number, data: Partial<Course>) {
  return request.put<Course>(`/courses/${id}`, data)
}

export function deleteCourse(id: number) {
  return request.delete(`/courses/${id}`)
}

export function createChapter(data: Partial<Chapter>) {
  return request.post<Chapter>('/chapters', data)
}

export function updateChapter(id: number, data: Partial<Chapter>) {
  return request.put<Chapter>(`/chapters/${id}`, data)
}

export function deleteChapter(id: number) {
  return request.delete(`/chapters/${id}`)
}

export function getResources(params: PaginationParams & Record<string, any>) {
  return request.get<PaginatedResponse<CourseResource>>('/resources', { params })
}

export function createResource(data: Partial<CourseResource>) {
  return request.post<CourseResource>('/resources', data)
}

export function deleteResource(id: number) {
  return request.delete(`/resources/${id}`)
}
