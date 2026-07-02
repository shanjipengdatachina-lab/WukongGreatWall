import request from './index'
import type { Annotation, Comment } from '@/types'

export function getSubmission(id: number) {
  return request.get(`/submissions/${id}`)
}

export function createAnnotation(submissionId: number, data: Partial<Annotation>) {
  return request.post(`/submissions/${submissionId}/annotations`, data)
}

export function createComment(submissionId: number, data: Partial<Comment>) {
  return request.post(`/submissions/${submissionId}/comments`, data)
}

export function approveSubmission(submissionId: number) {
  return request.post(`/submissions/${submissionId}/approve`)
}

export function rejectSubmission(submissionId: number, reason: string) {
  return request.post(`/submissions/${submissionId}/reject`, { reason })
}
