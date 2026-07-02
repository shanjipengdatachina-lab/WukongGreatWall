import request from './index'
import type { Student, PaginationParams, PaginatedResponse } from '@/types'

export function getStudents(params: PaginationParams & Record<string, any>) {
  return request.get<PaginatedResponse<Student>>('/students', { params })
}

export function getStudent(id: number) {
  return request.get<Student>(`/students/${id}`)
}

export function createStudent(data: Partial<Student>) {
  return request.post<Student>('/students', data)
}

export function updateStudent(id: number, data: Partial<Student>) {
  return request.put<Student>(`/students/${id}`, data)
}

export function importStudents(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/students/import', formData)
}
