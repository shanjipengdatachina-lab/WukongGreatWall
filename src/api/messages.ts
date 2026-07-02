import request from './index'
import type { Message, PaginationParams, PaginatedResponse } from '@/types'

export function getMessages(params: PaginationParams) {
  return request.get<PaginatedResponse<Message>>('/messages', { params })
}

export function markAsRead(id: number) {
  return request.put(`/messages/${id}/read`)
}
