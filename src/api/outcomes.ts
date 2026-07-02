import request from './index'
import type { Outcome, PaginationParams, PaginatedResponse } from '@/types'

export function getOutcomes(params: PaginationParams & Record<string, any>) {
  return request.get<PaginatedResponse<Outcome>>('/outcomes', { params })
}

export function createOutcome(data: Partial<Outcome>) {
  return request.post<Outcome>('/outcomes', data)
}

export function updateOutcome(id: number, data: Partial<Outcome>) {
  return request.put<Outcome>(`/outcomes/${id}`, data)
}

export function deleteOutcome(id: number) {
  return request.delete(`/outcomes/${id}`)
}
