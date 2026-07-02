import type { Topic, TopicMember, TopicAnnouncement, PaginatedResponse } from './types'

const topics: Topic[] = [
  {
    id: 'T001',
    title: '数字长城文化遗产数字化保护研究',
    description: '本课题围绕长城文化遗产的数字化保护需求，研究三维扫描建模、数字存档、虚拟修复等关键技术，构建完整的数字化保护技术体系。',
    leader: '张明远',
    leaderUniversity: '唐山工业职业技术大学',
    memberCount: 8,
    taskCount: 15,
    outcomeCount: 3,
    status: 'active',
    startDate: '2026-03-01',
    endDate: '2026-12-31',
    createdAt: '2026-02-20',
  },
  {
    id: 'T002',
    title: 'UE5在文化遗产可视化中的应用',
    description: '探索Unreal Engine 5在文化遗产可视化展示中的创新应用，利用Nanite、Lumen等新技术实现长城场景的高质量实时渲染与交互体验。',
    leader: '冯建平',
    leaderUniversity: '唐山工业职业技术大学',
    memberCount: 6,
    taskCount: 12,
    outcomeCount: 2,
    status: 'active',
    startDate: '2026-03-15',
    endDate: '2026-11-30',
    createdAt: '2026-03-01',
  },
  {
    id: 'T003',
    title: 'AI辅助数字人文研究',
    description: '利用人工智能技术辅助长城相关文献的数字化处理与深度分析，探索NLP、计算机视觉等技术在数字人文领域的应用模式。',
    leader: '周雨晴',
    leaderUniversity: '河北大学',
    memberCount: 5,
    taskCount: 10,
    outcomeCount: 1,
    status: 'active',
    startDate: '2026-04-01',
    endDate: '2026-12-31',
    createdAt: '2026-03-20',
  },
  {
    id: 'T004',
    title: '长城沿线虚拟现实体验开发',
    description: '基于VR/AR技术开发长城沿线重点关隘的虚拟现实体验内容，提供沉浸式的长城文化传承与教育体验。',
    leader: '吴天宇',
    leaderUniversity: '河北师范大学',
    memberCount: 7,
    taskCount: 14,
    outcomeCount: 2,
    status: 'active',
    startDate: '2026-04-15',
    endDate: '2026-11-30',
    createdAt: '2026-04-01',
  },
  {
    id: 'T005',
    title: '长城文化数据可视化平台设计',
    description: '设计开发面向公众的长城文化数据可视化平台，整合地理信息、历史文献、考古发现等多维数据进行可视化呈现。',
    leader: '褚明辉',
    leaderUniversity: '河北科技大学',
    memberCount: 5,
    taskCount: 11,
    outcomeCount: 1,
    status: 'active',
    startDate: '2026-05-01',
    endDate: '2026-12-31',
    createdAt: '2026-04-20',
  },
  {
    id: 'T006',
    title: '长城建筑结构三维重建技术研究',
    description: '利用Blender和摄影测量技术，对长城典型建筑结构进行高精度三维重建，为数字化保护提供精确的建筑模型数据。',
    leader: '孙文博',
    leaderUniversity: '燕山大学',
    memberCount: 4,
    taskCount: 9,
    outcomeCount: 1,
    status: 'active',
    startDate: '2026-05-15',
    endDate: '2026-10-31',
    createdAt: '2026-05-01',
  },
  {
    id: 'T007',
    title: '长城文化遗产交互教育平台',
    description: '设计面向中小学生的长城文化遗产交互教育平台，通过游戏化学习方式提升青少年对长城文化的认知和兴趣。',
    leader: '赵晓琳',
    leaderUniversity: '河北经贸大学',
    memberCount: 6,
    taskCount: 13,
    outcomeCount: 0,
    status: 'active',
    startDate: '2026-06-01',
    endDate: '2026-12-31',
    createdAt: '2026-05-20',
  },
  {
    id: 'T008',
    title: '长城影视特效技术应用研究',
    description: '研究Houdini等特效软件在长城题材影视制作中的应用，探索程序化生成技术在历史场景还原中的创新实践。',
    leader: '许梦洁',
    leaderUniversity: '河北工程大学',
    memberCount: 4,
    taskCount: 8,
    outcomeCount: 0,
    status: 'active',
    startDate: '2026-06-15',
    endDate: '2026-11-30',
    createdAt: '2026-06-01',
  },
]

const members: TopicMember[] = [
  { id: 'TM001', topicId: 'T001', studentId: 'S001', studentName: '张明远', scholarId: 'S2026-0001', university: '唐山工业职业技术大学', role: '负责人', joinDate: '2026-03-01', taskCount: 5, completedTaskCount: 3 },
  { id: 'TM002', topicId: 'T001', studentId: 'S004', studentName: '赵晓琳', scholarId: 'S2026-0004', university: '河北经贸大学', role: '核心成员', joinDate: '2026-03-01', taskCount: 4, completedTaskCount: 2 },
  { id: 'TM003', topicId: 'T001', studentId: 'S006', studentName: '刘美琪', scholarId: 'S2026-0006', university: '鲁迅美术学院', role: '核心成员', joinDate: '2026-03-02', taskCount: 3, completedTaskCount: 2 },
  { id: 'TM004', topicId: 'T001', studentId: 'S014', studentName: '卫诗涵', scholarId: 'S2026-0014', university: '唐山学院', role: '参与成员', joinDate: '2026-03-05', taskCount: 2, completedTaskCount: 1 },
  { id: 'TM005', topicId: 'T001', studentId: 'S026', studentName: '张蕊希', scholarId: 'S2026-0026', university: '河北工业大学', role: '参与成员', joinDate: '2026-03-10', taskCount: 1, completedTaskCount: 0 },
  { id: 'TM006', topicId: 'T002', studentId: 'S011', studentName: '冯建平', scholarId: 'S2026-0011', university: '唐山工业职业技术大学', role: '负责人', joinDate: '2026-03-15', taskCount: 4, completedTaskCount: 2 },
  { id: 'TM007', topicId: 'T002', studentId: 'S010', studentName: '郑晓萌', scholarId: 'S2026-0010', university: '石家庄铁道大学', role: '核心成员', joinDate: '2026-03-15', taskCount: 3, completedTaskCount: 1 },
  { id: 'TM008', topicId: 'T002', studentId: 'S023', studentName: '何嘉禾', scholarId: 'S2026-0023', university: '河北科技大学', role: '参与成员', joinDate: '2026-03-20', taskCount: 2, completedTaskCount: 1 },
  { id: 'TM009', topicId: 'T003', studentId: 'S008', studentName: '周雨晴', scholarId: 'S2026-0008', university: '河北大学', role: '负责人', joinDate: '2026-04-01', taskCount: 3, completedTaskCount: 2 },
  { id: 'TM010', topicId: 'T003', studentId: 'S016', studentName: '沈佳怡', scholarId: 'S2026-0016', university: '沧州师范学院', role: '核心成员', joinDate: '2026-04-01', taskCount: 3, completedTaskCount: 1 },
  { id: 'TM011', topicId: 'T003', studentId: 'S025', studentName: '施正阳', scholarId: 'S2026-0025', university: '华北理工大学', role: '参与成员', joinDate: '2026-04-05', taskCount: 2, completedTaskCount: 0 },
  { id: 'TM012', topicId: 'T004', studentId: 'S009', studentName: '吴天宇', scholarId: 'S2026-0009', university: '河北师范大学', role: '负责人', joinDate: '2026-04-15', taskCount: 4, completedTaskCount: 1 },
  { id: 'TM013', topicId: 'T004', studentId: 'S024', studentName: '吕若兰', scholarId: 'S2026-0024', university: '石家庄铁道大学', role: '核心成员', joinDate: '2026-04-15', taskCount: 3, completedTaskCount: 1 },
  { id: 'TM014', topicId: 'T004', studentId: 'S015', studentName: '蒋鹏飞', scholarId: 'S2026-0015', university: '华北理工大学', role: '参与成员', joinDate: '2026-04-20', taskCount: 2, completedTaskCount: 0 },
  { id: 'TM015', topicId: 'T005', studentId: 'S013', studentName: '褚明辉', scholarId: 'S2026-0013', university: '河北科技大学', role: '负责人', joinDate: '2026-05-01', taskCount: 3, completedTaskCount: 1 },
  { id: 'TM016', topicId: 'T005', studentId: 'S002', studentName: '李思雨', scholarId: 'S2026-0002', university: '河北工业大学', role: '核心成员', joinDate: '2026-05-01', taskCount: 3, completedTaskCount: 2 },
  { id: 'TM017', topicId: 'T006', studentId: 'S007', studentName: '孙文博', scholarId: 'S2026-0007', university: '燕山大学', role: '负责人', joinDate: '2026-05-15', taskCount: 3, completedTaskCount: 1 },
  { id: 'TM018', topicId: 'T006', studentId: 'S018', studentName: '杨柳青', scholarId: 'S2026-0018', university: '唐山工业职业技术大学', role: '核心成员', joinDate: '2026-05-15', taskCount: 2, completedTaskCount: 0 },
  { id: 'TM019', topicId: 'T007', studentId: 'S004', studentName: '赵晓琳', scholarId: 'S2026-0004', university: '河北经贸大学', role: '负责人', joinDate: '2026-06-01', taskCount: 3, completedTaskCount: 0 },
  { id: 'TM020', topicId: 'T007', studentId: 'S021', studentName: '尤思远', scholarId: 'S2026-0021', university: '唐山师范学院', role: '核心成员', joinDate: '2026-06-01', taskCount: 2, completedTaskCount: 0 },
  { id: 'TM021', topicId: 'T008', studentId: 'S022', studentName: '许梦洁', scholarId: 'S2026-0022', university: '河北工程大学', role: '负责人', joinDate: '2026-06-15', taskCount: 2, completedTaskCount: 0 },
  { id: 'TM022', topicId: 'T008', studentId: 'S028', studentName: '曹雅楠', scholarId: 'S2026-0028', university: '唐山工业职业技术大学', role: '核心成员', joinDate: '2026-06-15', taskCount: 2, completedTaskCount: 0 },
]

const announcements: TopicAnnouncement[] = [
  { id: 'TA001', topicId: 'T001', title: '课题启动会议通知', content: '定于3月5日14:00在数字人文实验室召开课题启动会议，请全体成员准时参加。', publisher: '张明远', publishTime: '2026-03-02 09:00:00', isTop: true },
  { id: 'TA002', topicId: 'T001', title: '第一阶段任务分配', content: '已根据研究方向完成第一阶段任务分配，各成员请在课题看板中查看各自任务详情。', publisher: '张明远', publishTime: '2026-03-06 10:30:00', isTop: false },
  { id: 'TA003', topicId: 'T001', title: '中期检查安排', content: '根据课题安排，将于7月15日进行中期检查，请各位提前准备汇报材料和阶段性成果展示。', publisher: '张明远', publishTime: '2026-06-20 15:00:00', isTop: true },
  { id: 'TA004', topicId: 'T002', title: 'UE5技术分享会', content: '本周五下午2点举办UE5技术内部分享会，由王浩然同学分享Nanite技术应用心得，欢迎大家交流讨论。', publisher: '冯建平', publishTime: '2026-03-18 11:00:00', isTop: false },
  { id: 'TA005', topicId: 'T003', title: '爬虫工具使用培训', content: '4月5日将进行Python爬虫和文本预处理工具培训，请课题组成员提前安装Anaconda环境。', publisher: '周雨晴', publishTime: '2026-04-02 08:30:00', isTop: false },
  { id: 'TA006', topicId: 'T004', title: 'VR设备借用说明', content: 'VR头显设备已到货，有需要的成员可联系管理员借用，每次借用需填写使用登记表。', publisher: '吴天宇', publishTime: '2026-05-01 10:00:00', isTop: false },
  { id: 'TA007', topicId: 'T005', title: '数据源整合通知', content: '已完成长城沿线地理数据和历史文献数据的初步整合，请成员在共享文件夹中查阅。', publisher: '褚明辉', publishTime: '2026-05-20 14:00:00', isTop: false },
  { id: 'TA008', topicId: 'T006', title: '建模参考素材共享', content: '整理了一批山海关、居庸关的高清参考图片，已上传至群共享，供建模参考使用。', publisher: '孙文博', publishTime: '2026-06-01 09:30:00', isTop: false },
]

export function mockTopics(page = 1, pageSize = 10): PaginatedResponse<Topic> {
  const total = topics.length
  const start = (page - 1) * pageSize
  const items = topics.slice(start, start + pageSize)
  return { total, page, pageSize, items }
}

export function mockTopicMembers(topicId: string, page = 1, pageSize = 10): PaginatedResponse<TopicMember> {
  const filtered = members.filter(m => m.topicId === topicId)
  const total = filtered.length
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)
  return { total, page, pageSize, items }
}

export function mockTopicAnnouncements(topicId: string): TopicAnnouncement[] {
  return announcements.filter(a => a.topicId === topicId)
}
