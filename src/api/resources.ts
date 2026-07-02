import request from './index'
import type { Resource, PaginationParams, PaginatedResponse } from '@/types'

export function getResources(params: PaginationParams & Record<string, any>) {
  return request.get<PaginatedResponse<Resource>>('/resources', { params })
}

export function deleteResource(id: number) {
  return request.delete(`/resources/${id}`)
}

export function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/files/upload', formData)
}
