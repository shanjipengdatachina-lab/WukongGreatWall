import request from './index'
import type { Role, Dictionary, SystemConfig, AuditLog, PaginationParams, PaginatedResponse } from '@/types'

export function getRoles() {
  return request.get<Role[]>('/settings/roles')
}

export function createRole(data: Partial<Role>) {
  return request.post<Role>('/settings/roles', data)
}

export function updateRole(id: number, data: Partial<Role>) {
  return request.put<Role>(`/settings/roles/${id}`, data)
}

export function getDictionaries() {
  return request.get<Dictionary[]>('/settings/dictionaries')
}

export function createDictionary(data: Partial<Dictionary>) {
  return request.post<Dictionary>('/settings/dictionaries', data)
}

export function updateDictionary(id: number, data: Partial<Dictionary>) {
  return request.put<Dictionary>(`/settings/dictionaries/${id}`, data)
}

export function getSystemConfig() {
  return request.get<SystemConfig>('/settings/system')
}

export function updateSystemConfig(data: Partial<SystemConfig>) {
  return request.put<SystemConfig>('/settings/system', data)
}

export function getAuditLogs(params: PaginationParams & Record<string, any>) {
  return request.get<PaginatedResponse<AuditLog>>('/settings/audit-logs', { params })
}
