import request from './index'
import type { TopicTask, PaginationParams, PaginatedResponse } from '@/types'

export function getTopicTasks(params: PaginationParams & Record<string, any>) {
  return request.get<PaginatedResponse<TopicTask>>('/topic-tasks', { params })
}

export function createTopicTask(data: Partial<TopicTask>) {
  return request.post<TopicTask>('/topic-tasks', data)
}

export function claimTask(taskId: number) {
  return request.post(`/topic-tasks/${taskId}/claim`)
}
