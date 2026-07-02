import type { Outcome, PaginatedResponse } from './types'

const outcomes: Outcome[] = [
  {
    id: 'OUT001', topicId: 'T001', topicTitle: '数字长城文化遗产数字化保护研究',
    title: '八达岭段长城三维扫描点云数据集', description: '利用激光雷达对八达岭段约2公里长城墙体进行三维扫描，生成高精度点云数据集，包含约5亿个点。',
    type: 'model', authors: ['张明远', '赵晓琳', '卫诗涵'], fileUrl: '', fileSize: '3.2GB', thumbnail: '',
    status: 'approved', createdAt: '2026-05-20', updatedAt: '2026-06-10',
  },
  {
    id: 'OUT002', topicId: 'T001', topicTitle: '数字长城文化遗产数字化保护研究',
    title: '长城数字存档标准规范（初稿）', description: '参考CIDOC-CRM等国际标准，撰写的长城文化遗产数字存档标准规范初稿，包含数据采集、存储、元数据等多个章节。',
    type: 'document', authors: ['赵晓琳', '张明远'], fileUrl: '', fileSize: '12MB', thumbnail: '',
    status: 'submitted', createdAt: '2026-06-05', updatedAt: '2026-06-15',
  },
  {
    id: 'OUT003', topicId: 'T001', topicTitle: '数字长城文化遗产数字化保护研究',
    title: '虚拟修复技术综述论文',
    description: '关于AI技术在长城文物虚拟修复中应用的研究综述论文，已完成初稿撰写。',
    type: 'document', authors: ['刘美琪', '张蕊希'], fileUrl: '', fileSize: '8MB', thumbnail: '',
    status: 'draft', createdAt: '2026-06-20', updatedAt: '2026-06-30',
  },
  {
    id: 'OUT004', topicId: 'T002', topicTitle: 'UE5在文化遗产可视化中的应用',
    title: '八达岭长城UE5场景Demo视频',
    description: '基于UE5搭建的八达岭长城核心段场景的Demo展示视频，展示了Lumen动态光照效果和Nanite细节表现，片长3分28秒。',
    type: 'video', authors: ['冯建平', '郑晓萌', '何嘉禾'], fileUrl: '', fileSize: '520MB', thumbnail: '',
    status: 'submitted', createdAt: '2026-06-25', updatedAt: '2026-07-01',
  },
  {
    id: 'OUT005', topicId: 'T002', topicTitle: 'UE5在文化遗产可视化中的应用',
    title: '长城材质与光照技术报告',
    description: '系统总结UE5中长城材质制作和光照系统的技术要点与最佳实践，包含详细参数说明和渲染效果对比。',
    type: 'document', authors: ['冯建平', '何嘉禾'], fileUrl: '', fileSize: '15MB', thumbnail: '',
    status: 'draft', createdAt: '2026-06-28', updatedAt: '2026-07-02',
  },
  {
    id: 'OUT006', topicId: 'T003', topicTitle: 'AI辅助数字人文研究',
    title: '长城文献主题模型分析报告',
    description: '对1980-2025年间约2000篇长城相关学术文献进行LDA主题建模分析，识别出8个主要研究主题及其演化趋势。',
    type: 'document', authors: ['周雨晴', '沈佳怡'], fileUrl: '', fileSize: '18MB', thumbnail: '',
    status: 'approved', createdAt: '2026-06-10', updatedAt: '2026-06-25',
  },
  {
    id: 'OUT007', topicId: 'T004', topicTitle: '长城沿线虚拟现实体验开发',
    title: '居庸关VR体验Demo',
    description: '居庸关城楼的VR沉浸式体验Demo APK，支持HTC Vive和Meta Quest 2设备。',
    type: 'model', authors: ['吴天宇', '吕若兰'], fileUrl: '', fileSize: '1.8GB', thumbnail: '',
    status: 'draft', createdAt: '2026-06-15', updatedAt: '2026-07-01',
  },
  {
    id: 'OUT008', topicId: 'T004', topicTitle: '长城沿线虚拟现实体验开发',
    title: 'VR体验设计文档',
    description: '详细的VR体验设计方案，包含用户旅程地图、交互流程图、场景设计说明和音频设计方案。',
    type: 'document', authors: ['吴天宇', '吕若兰'], fileUrl: '', fileSize: '22MB', thumbnail: '',
    status: 'submitted', createdAt: '2026-06-20', updatedAt: '2026-06-30',
  },
  {
    id: 'OUT009', topicId: 'T005', topicTitle: '长城文化数据可视化平台设计',
    title: '数据可视化平台原型Demo',
    description: '基于Vue3+ECharts开发的长城文化数据可视化平台前端原型，包含地图可视化、统计图表和时间轴等核心模块。',
    type: 'render', authors: ['褚明辉', '李思雨'], fileUrl: '', fileSize: '45MB', thumbnail: '',
    status: 'draft', createdAt: '2026-06-25', updatedAt: '2026-07-02',
  },
  {
    id: 'OUT010', topicId: 'T006', topicTitle: '长城建筑结构三维重建技术研究',
    title: '居庸关城楼三维重建模型',
    description: '基于摄影测量技术完成的居庸关城楼高精度三维重建模型（Blender格式），包含约50万三角面。',
    type: 'model', authors: ['孙文博', '杨柳青'], fileUrl: '', fileSize: '650MB', thumbnail: '',
    status: 'submitted', createdAt: '2026-06-28', updatedAt: '2026-07-02',
  },
  {
    id: 'OUT011', topicId: 'T001', topicTitle: '数字长城文化遗产数字化保护研究',
    title: '长城数字化保护宣传片',
    description: '制作的长城数字化保护概念宣传视频，展示了三维扫描、虚拟修复等技术的应用成果，片长5分12秒。',
    type: 'video', authors: ['张明远', '刘美琪'], fileUrl: '', fileSize: '780MB', thumbnail: '',
    status: 'draft', createdAt: '2026-06-30', updatedAt: '2026-07-02',
  },
]

export function mockOutcomes(page = 1, pageSize = 10, filters?: { type?: string; status?: string; topicId?: string }): PaginatedResponse<Outcome> {
  let filtered = [...outcomes]
  if (filters?.type) {
    filtered = filtered.filter(o => o.type === filters.type)
  }
  if (filters?.status) {
    filtered = filtered.filter(o => o.status === filters.status)
  }
  if (filters?.topicId) {
    filtered = filtered.filter(o => o.topicId === filters.topicId)
  }
  const total = filtered.length
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)
  return { total, page, pageSize, items }
}
