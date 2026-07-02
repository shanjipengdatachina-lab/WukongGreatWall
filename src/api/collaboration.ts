import request from './index'
import type { CollaborationNode, CollaborationLink } from '@/types'

export function getMapData() {
  return request.get<{ nodes: CollaborationNode[], links: CollaborationLink[] }>('/collaboration/map')
}

export function getGraphData(params?: { topicId?: number }) {
  return request.get<{ nodes: CollaborationNode[], links: CollaborationLink[] }>('/collaboration/graph', { params })
}
