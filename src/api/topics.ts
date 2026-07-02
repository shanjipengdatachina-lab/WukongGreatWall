import request from './index'
import type { Topic, TopicMember, TopicAnnouncement, PaginationParams, PaginatedResponse } from '@/types'

export function getTopics(params: PaginationParams & Record<string, any>) {
  return request.get<PaginatedResponse<Topic>>('/topics', { params })
}

export function getTopic(id: number) {
  return request.get<Topic>(`/topics/${id}`)
}

export function createTopic(data: Partial<Topic>) {
  return request.post<Topic>('/topics', data)
}

export function updateTopic(id: number, data: Partial<Topic>) {
  return request.put<Topic>(`/topics/${id}`, data)
}

export function getTopicMembers(topicId: number, params: PaginationParams) {
  return request.get<PaginatedResponse<TopicMember>>(`/topics/${topicId}/members`, { params })
}

export function approveMember(topicId: number, memberId: number) {
  return request.post(`/topics/${topicId}/members/${memberId}/approve`)
}

export function removeMember(topicId: number, memberId: number) {
  return request.delete(`/topics/${topicId}/members/${memberId}`)
}

export function getTopicAnnouncements(topicId: number) {
  return request.get<TopicAnnouncement[]>(`/topics/${topicId}/announcements`)
}

export function createAnnouncement(topicId: number, data: Partial<TopicAnnouncement>) {
  return request.post(`/topics/${topicId}/announcements`, data)
}
