import type { TopicTask, PaginatedResponse } from './types'

const tasks: TopicTask[] = [
  { id: 'TT001', topicId: 'T001', topicTitle: '数字长城文化遗产数字化保护研究', title: '长城三维扫描数据采集方案设计', description: '制定八达岭段长城三维扫描的数据采集方案，包括设备选型、扫描路径规划和精度要求。', assigneeId: 'S001', assigneeName: '张明远', assigneeUniversity: '唐山工业职业技术大学', priority: 'high', status: 'done', progress: 100, deadline: '2026-04-15', createdAt: '2026-03-05', completedAt: '2026-04-10' },
  { id: 'TT002', topicId: 'T001', topicTitle: '数字长城文化遗产数字化保护研究', title: '数字存档标准规范研究', description: '调研国内外文化遗产数字化存档标准，撰写适用于长城文化遗产的数字存档规范草案。', assigneeId: 'S004', assigneeName: '赵晓琳', assigneeUniversity: '河北经贸大学', priority: 'high', status: 'done', progress: 100, deadline: '2026-04-30', createdAt: '2026-03-05', completedAt: '2026-04-25' },
  { id: 'TT003', topicId: 'T001', topicTitle: '数字长城文化遗产数字化保护研究', title: '虚拟修复技术算法研究', description: '研究基于深度学习的文物虚拟修复算法，针对长城砖石缺损进行修复实验。', assigneeId: 'S006', assigneeName: '刘美琪', assigneeUniversity: '鲁迅美术学院', priority: 'urgent', status: 'in_progress', progress: 65, deadline: '2026-07-30', createdAt: '2026-04-01', completedAt: null },
  { id: 'TT004', topicId: 'T001', topicTitle: '数字长城文化遗产数字化保护研究', title: '数字化保护案例收集', description: '收集整理国内外文化遗产数字化保护的典型案例，撰写案例分析报告。', assigneeId: 'S014', assigneeName: '卫诗涵', assigneeUniversity: '唐山学院', priority: 'medium', status: 'review', progress: 90, deadline: '2026-06-30', createdAt: '2026-04-10', completedAt: null },
  { id: 'TT005', topicId: 'T001', topicTitle: '数字长城文化遗产数字化保护研究', title: '中期研究报告撰写', description: '撰写课题中期研究报告，包含研究进展、阶段性成果和下阶段计划。', assigneeId: 'S001', assigneeName: '张明远', assigneeUniversity: '唐山工业职业技术大学', priority: 'high', status: 'in_progress', progress: 40, deadline: '2026-07-15', createdAt: '2026-06-15', completedAt: null },
  { id: 'TT006', topicId: 'T002', topicTitle: 'UE5在文化遗产可视化中的应用', title: '八达岭长城场景搭建', description: '在UE5中搭建八达岭长城核心段场景，包含主要敌楼和城墙结构。', assigneeId: 'S011', assigneeName: '冯建平', assigneeUniversity: '唐山工业职业技术大学', priority: 'urgent', status: 'in_progress', progress: 70, deadline: '2026-07-20', createdAt: '2026-03-20', completedAt: null },
  { id: 'TT007', topicId: 'T002', topicTitle: 'UE5在文化遗产可视化中的应用', title: 'Lumen光照系统调优', description: '针对长城场景的光照特点，对Lumen动态光照进行精细调优，实现黄昏、正午等多时段光照效果。', assigneeId: 'S010', assigneeName: '郑晓萌', assigneeUniversity: '石家庄铁道大学', priority: 'high', status: 'todo', progress: 0, deadline: '2026-08-15', createdAt: '2026-04-01', completedAt: null },
  { id: 'TT008', topicId: 'T002', topicTitle: 'UE5在文化遗产可视化中的应用', title: '交互UI系统开发', description: '开发场景中的交互UI系统，包括信息展示面板、时间切换控件和导览功能。', assigneeId: 'S023', assigneeName: '何嘉禾', assigneeUniversity: '河北科技大学', priority: 'medium', status: 'in_progress', progress: 55, deadline: '2026-08-30', createdAt: '2026-05-01', completedAt: null },
  { id: 'TT009', topicId: 'T003', topicTitle: 'AI辅助数字人文研究', title: '长城文献数据采集', description: '爬取并整理知网、万方等数据库中与长城相关的学术文献，建立文献数据库。', assigneeId: 'S008', assigneeName: '周雨晴', assigneeUniversity: '河北大学', priority: 'high', status: 'done', progress: 100, deadline: '2026-05-15', createdAt: '2026-04-05', completedAt: '2026-05-10' },
  { id: 'TT010', topicId: 'T003', topicTitle: 'AI辅助数字人文研究', title: 'NLP文本分析模型训练', description: '使用BERT等预训练模型对长城文献进行命名实体识别和关系抽取训练。', assigneeId: 'S016', assigneeName: '沈佳怡', assigneeUniversity: '沧州师范学院', priority: 'urgent', status: 'in_progress', progress: 45, deadline: '2026-08-01', createdAt: '2026-05-20', completedAt: null },
  { id: 'TT011', topicId: 'T003', topicTitle: 'AI辅助数字人文研究', title: '图像识别模型应用', description: '应用计算机视觉模型对长城历史照片进行自动分类和标注。', assigneeId: 'S025', assigneeName: '施正阳', assigneeUniversity: '华北理工大学', priority: 'medium', status: 'todo', progress: 0, deadline: '2026-09-01', createdAt: '2026-06-01', completedAt: null },
  { id: 'TT012', topicId: 'T004', topicTitle: '长城沿线虚拟现实体验开发', title: 'VR场景框架搭建', description: '搭建VR体验的基础场景框架，包含场景管理、手柄交互和移动系统。', assigneeId: 'S009', assigneeName: '吴天宇', assigneeUniversity: '河北师范大学', priority: 'urgent', status: 'in_progress', progress: 60, deadline: '2026-07-01', createdAt: '2026-04-20', completedAt: null },
  { id: 'TT013', topicId: 'T004', topicTitle: '长城沿线虚拟现实体验开发', title: '音频导览系统设计', description: '设计长城VR体验的音频导览系统，包含背景音乐、环境音效和语音解说。', assigneeId: 'S024', assigneeName: '吕若兰', assigneeUniversity: '石家庄铁道大学', priority: 'medium', status: 'todo', progress: 0, deadline: '2026-08-15', createdAt: '2026-05-10', completedAt: null },
  { id: 'TT014', topicId: 'T005', topicTitle: '长城文化数据可视化平台设计', title: '数据接口设计与开发', description: '设计和开发数据可视化平台的后端API接口，支持数据查询、筛选和聚合。', assigneeId: 'S013', assigneeName: '褚明辉', assigneeUniversity: '河北科技大学', priority: 'high', status: 'done', progress: 100, deadline: '2026-06-15', createdAt: '2026-05-05', completedAt: '2026-06-10' },
  { id: 'TT015', topicId: 'T005', topicTitle: '长城文化数据可视化平台设计', title: '前端可视化组件开发', description: '开发地图组件、时间轴组件和统计图表组件等核心可视化组件。', assigneeId: 'S002', assigneeName: '李思雨', assigneeUniversity: '河北工业大学', priority: 'high', status: 'in_progress', progress: 50, deadline: '2026-08-01', createdAt: '2026-06-15', completedAt: null },
  { id: 'TT016', topicId: 'T006', topicTitle: '长城建筑结构三维重建技术研究', title: '摄影测量数据采集', description: '对居庸关城楼进行多角度摄影测量数据采集，生成初始点云数据。', assigneeId: 'S007', assigneeName: '孙文博', assigneeUniversity: '燕山大学', priority: 'high', status: 'done', progress: 100, deadline: '2026-06-15', createdAt: '2026-05-20', completedAt: '2026-06-12' },
  { id: 'TT017', topicId: 'T006', topicTitle: '长城建筑结构三维重建技术研究', title: '三维模型精细化处理', description: '对初始重建模型进行精细化处理，包括拓扑优化、UV展开和纹理映射。', assigneeId: 'S018', assigneeName: '杨柳青', assigneeUniversity: '唐山工业职业技术大学', priority: 'high', status: 'in_progress', progress: 35, deadline: '2026-08-15', createdAt: '2026-06-20', completedAt: null },
  { id: 'TT018', topicId: 'T007', topicTitle: '长城文化遗产交互教育平台', title: '需求分析与产品设计', description: '进行目标用户调研，完成产品需求分析和交互原型设计。', assigneeId: 'S004', assigneeName: '赵晓琳', assigneeUniversity: '河北经贸大学', priority: 'high', status: 'in_progress', progress: 80, deadline: '2026-07-15', createdAt: '2026-06-05', completedAt: null },
  { id: 'TT019', topicId: 'T008', topicTitle: '长城影视特效技术应用研究', title: '烽火台烟雾特效开发', description: '利用Houdini开发长城烽火台的程序化烟雾特效系统。', assigneeId: 'S022', assigneeName: '许梦洁', assigneeUniversity: '河北工程大学', priority: 'urgent', status: 'in_progress', progress: 30, deadline: '2026-08-01', createdAt: '2026-06-20', completedAt: null },
  { id: 'TT020', topicId: 'T008', topicTitle: '长城影视特效技术应用研究', title: '破碎特效模拟实验', description: '进行城墙砖石破碎特效的模拟实验，研究参数对效果的影响。', assigneeId: 'S028', assigneeName: '曹雅楠', assigneeUniversity: '唐山工业职业技术大学', priority: 'medium', status: 'todo', progress: 0, deadline: '2026-09-01', createdAt: '2026-07-01', completedAt: null },
]

export function mockTopicTasks(page = 1, pageSize = 10, filters?: { status?: string; topicId?: string; priority?: string; assigneeId?: string }): PaginatedResponse<TopicTask> {
  let filtered = [...tasks]
  if (filters?.status) {
    filtered = filtered.filter(t => t.status === filters.status)
  }
  if (filters?.topicId) {
    filtered = filtered.filter(t => t.topicId === filters.topicId)
  }
  if (filters?.priority) {
    filtered = filtered.filter(t => t.priority === filters.priority)
  }
  if (filters?.assigneeId) {
    filtered = filtered.filter(t => t.assigneeId === filters.assigneeId)
  }
  const total = filtered.length
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)
  return { total, page, pageSize, items }
}
