import request from './index'
import type { Assignment, Submission, PaginationParams, PaginatedResponse } from '@/types'

export function getAssignments(params: PaginationParams & Record<string, any>) {
  return request.get<PaginatedResponse<Assignment>>('/assignments', { params })
}

export function createAssignment(data: Partial<Assignment>) {
  return request.post<Assignment>('/assignments', data)
}

export function updateAssignment(id: number, data: Partial<Assignment>) {
  return request.put<Assignment>(`/assignments/${id}`, data)
}

export function deleteAssignment(id: number) {
  return request.delete(`/assignments/${id}`)
}

export function getSubmissions(assignmentId: number, params: PaginationParams) {
  return request.get<PaginatedResponse<Submission>>(`/assignments/${assignmentId}/submissions`, { params })
}
