import request from './index'
import type { Invitation, PaginationParams, PaginatedResponse } from '@/types'

export function getInvitations(params: PaginationParams & Record<string, any>) {
  return request.get<PaginatedResponse<Invitation>>('/invitations', { params })
}

export function updateInvitation(id: number, data: Partial<Invitation>) {
  return request.put<Invitation>(`/invitations/${id}`, data)
}
