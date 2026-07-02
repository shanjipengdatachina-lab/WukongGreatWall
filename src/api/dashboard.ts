import request from './index'
import type { DashboardOverview, DashboardTrend } from '@/types'

export function getDashboardOverview() {
  return request.get<DashboardOverview>('/dashboard/overview')
}

export function getDashboardTrend(params?: { range?: string }) {
  return request.get<DashboardTrend>('/dashboard/trend', { params })
}
