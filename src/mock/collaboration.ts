import type { MapNode, MapLink, GraphNode, GraphLink } from './types'

export function mockMapData(): { nodes: MapNode[]; links: MapLink[] } {
  const nodes: MapNode[] = [
    { id: 'U001', name: '唐山工业职业技术大学', type: 'university', longitude: 118.18, latitude: 39.63, value: 8 },
    { id: 'U002', name: '河北工业大学', type: 'university', longitude: 117.40, latitude: 39.06, value: 5 },
    { id: 'U003', name: '沧州师范学院', type: 'university', longitude: 116.84, latitude: 38.30, value: 3 },
    { id: 'U004', name: '河北经贸大学', type: 'university', longitude: 114.47, latitude: 38.09, value: 4 },
    { id: 'U005', name: '华北理工大学', type: 'university', longitude: 118.15, latitude: 39.62, value: 6 },
    { id: 'U006', name: '鲁迅美术学院', type: 'university', longitude: 123.43, latitude: 41.80, value: 2 },
    { id: 'U007', name: '燕山大学', type: 'university', longitude: 119.55, latitude: 39.92, value: 5 },
    { id: 'U008', name: '河北大学', type: 'university', longitude: 115.50, latitude: 38.87, value: 4 },
    { id: 'U009', name: '河北师范大学', type: 'university', longitude: 114.52, latitude: 38.04, value: 3 },
    { id: 'U010', name: '石家庄铁道大学', type: 'university', longitude: 114.48, latitude: 38.05, value: 3 },
    { id: 'U011', name: '河北科技大学', type: 'university', longitude: 114.53, latitude: 38.04, value: 3 },
    { id: 'U012', name: '唐山学院', type: 'university', longitude: 118.17, latitude: 39.64, value: 2 },
    { id: 'U013', name: '唐山师范学院', type: 'university', longitude: 118.17, latitude: 39.63, value: 2 },
    { id: 'U014', name: '河北工程大学', type: 'university', longitude: 114.50, latitude: 36.60, value: 2 },
    { id: 'TP001', name: '数字长城文化遗产数字化保护研究', type: 'topic', longitude: 118.18, latitude: 39.65, value: 8 },
    { id: 'TP002', name: 'UE5在文化遗产可视化中的应用', type: 'topic', longitude: 118.16, latitude: 39.63, value: 6 },
    { id: 'TP003', name: 'AI辅助数字人文研究', type: 'topic', longitude: 115.51, latitude: 38.88, value: 5 },
  ]

  const links: MapLink[] = [
    { source: 'U001', target: 'TP001', value: 5, type: 'lead' },
    { source: 'U001', target: 'TP002', value: 4, type: 'lead' },
    { source: 'U004', target: 'TP001', value: 3, type: 'member' },
    { source: 'U006', target: 'TP001', value: 2, type: 'member' },
    { source: 'U012', target: 'TP001', value: 1, type: 'member' },
    { source: 'U002', target: 'TP001', value: 1, type: 'member' },
    { source: 'U010', target: 'TP002', value: 1, type: 'member' },
    { source: 'U011', target: 'TP002', value: 1, type: 'member' },
    { source: 'U008', target: 'TP003', value: 2, type: 'lead' },
    { source: 'U003', target: 'TP003', value: 1, type: 'member' },
    { source: 'U005', target: 'TP003', value: 1, type: 'member' },
  ]

  return { nodes, links }
}

export function mockGraphData(topicId: string): { nodes: GraphNode[]; links: GraphLink[] } {
  const graphMap: Record<string, { nodes: GraphNode[]; links: GraphLink[] }> = {
    T001: {
      nodes: [
        { id: 'S001', name: '张明远', type: 'student', symbolSize: 50, university: '唐山工业职业技术大学' },
        { id: 'S004', name: '赵晓琳', type: 'student', symbolSize: 40, university: '河北经贸大学' },
        { id: 'S006', name: '刘美琪', type: 'student', symbolSize: 40, university: '鲁迅美术学院' },
        { id: 'S014', name: '卫诗涵', type: 'student', symbolSize: 30, university: '唐山学院' },
        { id: 'S026', name: '张蕊希', type: 'student', symbolSize: 25, university: '河北工业大学' },
        { id: 'T001', name: '数字长城文化遗产数字化保护研究', type: 'topic', symbolSize: 60, university: '' },
        { id: 'OUT001', name: '三维扫描点云数据集', type: 'outcome', symbolSize: 35, university: '' },
        { id: 'OUT002', name: '数字存档标准规范', type: 'outcome', symbolSize: 30, university: '' },
        { id: 'OUT003', name: '虚拟修复综述论文', type: 'outcome', symbolSize: 28, university: '' },
        { id: 'OUT011', name: '数字化保护宣传片', type: 'outcome', symbolSize: 30, university: '' },
        { id: 'RES001', name: '三维扫描原始数据', type: 'resource', symbolSize: 22, university: '' },
        { id: 'RES002', name: '修复算法代码库', type: 'resource', symbolSize: 20, university: '' },
      ],
      links: [
        { source: 'S001', target: 'T001', type: 'member' },
        { source: 'S004', target: 'T001', type: 'member' },
        { source: 'S006', target: 'T001', type: 'member' },
        { source: 'S014', target: 'T001', type: 'member' },
        { source: 'S026', target: 'T001', type: 'member' },
        { source: 'T001', target: 'OUT001', type: 'contribute' },
        { source: 'T001', target: 'OUT002', type: 'contribute' },
        { source: 'T001', target: 'OUT003', type: 'contribute' },
        { source: 'T001', target: 'OUT011', type: 'contribute' },
        { source: 'S001', target: 'RES001', type: 'reference' },
        { source: 'S006', target: 'RES002', type: 'reference' },
        { source: 'S001', target: 'S004', type: 'collaborate' },
        { source: 'S001', target: 'S006', type: 'collaborate' },
        { source: 'S004', target: 'S014', type: 'collaborate' },
      ],
    },
    T002: {
      nodes: [
        { id: 'S011', name: '冯建平', type: 'student', symbolSize: 50, university: '唐山工业职业技术大学' },
        { id: 'S010', name: '郑晓萌', type: 'student', symbolSize: 40, university: '石家庄铁道大学' },
        { id: 'S023', name: '何嘉禾', type: 'student', symbolSize: 35, university: '河北科技大学' },
        { id: 'T002', name: 'UE5在文化遗产可视化中的应用', type: 'topic', symbolSize: 60, university: '' },
        { id: 'OUT004', name: 'UE5场景Demo视频', type: 'outcome', symbolSize: 35, university: '' },
        { id: 'OUT005', name: '材质与光照技术报告', type: 'outcome', symbolSize: 30, university: '' },
        { id: 'RES003', name: 'UE5场景工程文件', type: 'resource', symbolSize: 22, university: '' },
      ],
      links: [
        { source: 'S011', target: 'T002', type: 'member' },
        { source: 'S010', target: 'T002', type: 'member' },
        { source: 'S023', target: 'T002', type: 'member' },
        { source: 'T002', target: 'OUT004', type: 'contribute' },
        { source: 'T002', target: 'OUT005', type: 'contribute' },
        { source: 'S011', target: 'RES003', type: 'reference' },
        { source: 'S011', target: 'S010', type: 'collaborate' },
        { source: 'S011', target: 'S023', type: 'collaborate' },
      ],
    },
  }

  const defaultGraph: { nodes: GraphNode[]; links: GraphLink[] } = {
    nodes: [
      { id: 'T_DEFAULT', name: '课题协作网络', type: 'topic', symbolSize: 50, university: '' },
      { id: 'S_D1', name: '成员A', type: 'student', symbolSize: 35, university: '唐山工业职业技术大学' },
      { id: 'S_D2', name: '成员B', type: 'student', symbolSize: 35, university: '河北工业大学' },
    ],
    links: [
      { source: 'S_D1', target: 'T_DEFAULT', type: 'member' },
      { source: 'S_D2', target: 'T_DEFAULT', type: 'member' },
      { source: 'S_D1', target: 'S_D2', type: 'collaborate' },
    ],
  }

  return graphMap[topicId] || defaultGraph
}
