import type { Assignment, Submission, PaginatedResponse } from './types'

const assignments: Assignment[] = [
  {
    id: 'A001', courseId: 'C001', courseTitle: 'UE5基础入门与场景搭建', chapterId: 'CH002',
    chapterTitle: '静态网格体与材质基础', title: '长城城墙材质制作', description: '利用UE5材质编辑器制作长城城墙的PBR材质，包含青砖纹理、风化效果和苔藓覆盖层。',
    type: '个人作业', status: 'reviewing', deadline: '2026-07-15',
    submitRate: 88, reviewRate: 45, totalStudents: 25, submittedCount: 22, reviewedCount: 10,
    createdAt: '2026-06-20',
  },
  {
    id: 'A002', courseId: 'C001', courseTitle: 'UE5基础入门与场景搭建', chapterId: 'CH005',
    chapterTitle: '地形与植被系统', title: '长城沿线地形还原', description: '使用UE5地形工具还原八达岭段长城周边地形，添加植被和岩石。',
    type: '小组作业', status: 'submitted', deadline: '2026-07-20',
    submitRate: 76, reviewRate: 0, totalStudents: 25, submittedCount: 19, reviewedCount: 0,
    createdAt: '2026-06-25',
  },
  {
    id: 'A003', courseId: 'C002', courseTitle: 'Houdini程序化特效制作', chapterId: 'CH009',
    chapterTitle: '粒子与流体模拟', title: '长城烽火台烟雾模拟', description: '利用Houdini粒子系统模拟长城烽火台的烟火效果，包含风力影响和光照反应。',
    type: '课题作业', status: 'pending', deadline: '2026-08-05',
    submitRate: 30, reviewRate: 0, totalStudents: 18, submittedCount: 5, reviewedCount: 0,
    createdAt: '2026-07-01',
  },
  {
    id: 'A004', courseId: 'C003', courseTitle: '数字人文研究方法与实践', chapterId: 'CH013',
    chapterTitle: '文本挖掘与远读技术', title: '长城文献文本分析', description: '收集历代长城相关文献，使用Python进行文本挖掘和词频分析，生成主题模型。',
    type: '个人作业', status: 'reviewed', deadline: '2026-06-30',
    submitRate: 95, reviewRate: 90, totalStudents: 22, submittedCount: 21, reviewedCount: 19,
    createdAt: '2026-06-01',
  },
  {
    id: 'A005', courseId: 'C004', courseTitle: '数据可视化与交互设计', chapterId: 'CH017',
    chapterTitle: 'ECharts图表库实战', title: '长城数据可视化看板', description: '设计并实现一个长城相关数据的可视化看板，包含地图、时间轴和统计图表。',
    type: '小组作业', status: 'reviewing', deadline: '2026-07-25',
    submitRate: 65, reviewRate: 30, totalStudents: 20, submittedCount: 13, reviewedCount: 6,
    createdAt: '2026-06-28',
  },
  {
    id: 'A006', courseId: 'C005', courseTitle: 'Blender三维建模与渲染', chapterId: 'CH026',
    chapterTitle: '长城城楼建模实战', title: '山海关城楼精细建模', description: '基于历史资料参考图，完成山海关城楼的精细三维模型制作，包含门窗、飞檐等细节。',
    type: '课题作业', status: 'submitted', deadline: '2026-08-10',
    submitRate: 42, reviewRate: 0, totalStudents: 19, submittedCount: 8, reviewedCount: 0,
    createdAt: '2026-07-02',
  },
  {
    id: 'A007', courseId: 'C005', courseTitle: 'Blender三维建模与渲染', chapterId: 'CH024',
    chapterTitle: 'PBR材质与纹理绘制', title: '长城砖石纹理绘制', description: '使用Substance Painter或Blender内置工具，绘制长城砖石的高清PBR纹理贴图。',
    type: '个人作业', status: 'reviewing', deadline: '2026-07-18',
    submitRate: 84, reviewRate: 50, totalStudents: 19, submittedCount: 16, reviewedCount: 8,
    createdAt: '2026-06-22',
  },
  {
    id: 'A008', courseId: 'C006', courseTitle: '虚拟现实技术与应用', chapterId: 'CH031',
    chapterTitle: '文化遗产VR体验项目', title: '长城敌楼VR交互漫游', description: '开发一个长城敌楼内部的VR交互漫游体验，包含场景切换、信息展示和交互控制。',
    type: '课题作业', status: 'pending', deadline: '2026-08-15',
    submitRate: 25, reviewRate: 0, totalStudents: 16, submittedCount: 4, reviewedCount: 0,
    createdAt: '2026-07-01',
  },
  {
    id: 'A009', courseId: 'C001', courseTitle: 'UE5基础入门与场景搭建', chapterId: 'CH004',
    chapterTitle: 'Nanite虚拟几何体技术', title: '高精度长城砖石资产优化', description: '使用Nanite技术优化高精度长城砖石模型，在保持细节的同时提升渲染性能。',
    type: '个人作业', status: 'overdue', deadline: '2026-06-25',
    submitRate: 72, reviewRate: 60, totalStudents: 25, submittedCount: 18, reviewedCount: 11,
    createdAt: '2026-06-05',
  },
  {
    id: 'A010', courseId: 'C006', courseTitle: '虚拟现实技术与应用', chapterId: 'CH029',
    chapterTitle: 'UE5 VR项目搭建', title: '长城VR场景导入与优化', description: '将长城场景模型导入UE5 VR模板，进行LOD优化、碰撞设置和性能调优。',
    type: '个人作业', status: 'submitted', deadline: '2026-07-10',
    submitRate: 75, reviewRate: 0, totalStudents: 16, submittedCount: 12, reviewedCount: 0,
    createdAt: '2026-06-15',
  },
  {
    id: 'A011', courseId: 'C002', courseTitle: 'Houdini程序化特效制作', chapterId: 'CH011',
    chapterTitle: '综合项目实战', title: '长城防御场景综合特效', description: '综合运用所学Houdini技术，制作包含火焰、烟雾、碎片等元素的完整长城防御场景特效。',
    type: '课题作业', status: 'pending', deadline: '2026-08-30',
    submitRate: 10, reviewRate: 0, totalStudents: 18, submittedCount: 2, reviewedCount: 0,
    createdAt: '2026-07-01',
  },
  {
    id: 'A012', courseId: 'C004', courseTitle: '数据可视化与交互设计', chapterId: 'CH020',
    chapterTitle: '数据大屏综合项目', title: '万里长城数字长卷大屏', description: '设计并实现"万里长城数字长卷"综合数据大屏，整合多维数据展示长城文化。',
    type: '课题作业', status: 'pending', deadline: '2026-09-01',
    submitRate: 5, reviewRate: 0, totalStudents: 20, submittedCount: 1, reviewedCount: 0,
    createdAt: '2026-07-02',
  },
]

const submissions: Submission[] = [
  { id: 'SUB001', assignmentId: 'A001', studentId: 'S001', studentName: '张明远', scholarId: 'S2026-0001', university: '唐山工业职业技术大学', status: 'reviewed', score: 88, submitTime: '2026-07-02 10:30:00', reviewTime: '2026-07-02 14:00:00', files: [{ id: 'F001', fileName: '长城城墙材质.uasset', fileSize: '45MB', fileType: 'uasset', url: '' }] },
  { id: 'SUB002', assignmentId: 'A001', studentId: 'S002', studentName: '李思雨', scholarId: 'S2026-0002', university: '河北工业大学', status: 'reviewed', score: 92, submitTime: '2026-07-01 16:20:00', reviewTime: '2026-07-02 09:00:00', files: [{ id: 'F002', fileName: 'PBR材质工程.zip', fileSize: '52MB', fileType: 'zip', url: '' }] },
  { id: 'SUB003', assignmentId: 'A001', studentId: 'S006', studentName: '刘美琪', scholarId: 'S2026-0006', university: '鲁迅美术学院', status: 'reviewing', score: null, submitTime: '2026-07-02 08:45:00', reviewTime: null, files: [{ id: 'F003', fileName: '材质设计说明.pdf', fileSize: '3MB', fileType: 'pdf', url: '' }, { id: 'F004', fileName: '材质球文件.zip', fileSize: '38MB', fileType: 'zip', url: '' }] },
  { id: 'SUB004', assignmentId: 'A001', studentId: 'S011', studentName: '冯建平', scholarId: 'S2026-0011', university: '唐山工业职业技术大学', status: 'submitted', score: null, submitTime: '2026-07-02 11:00:00', reviewTime: null, files: [{ id: 'F005', fileName: '冯建平-长城材质.zip', fileSize: '41MB', fileType: 'zip', url: '' }] },
  { id: 'SUB005', assignmentId: 'A004', studentId: 'S008', studentName: '周雨晴', scholarId: 'S2026-0008', university: '河北大学', status: 'reviewed', score: 95, submitTime: '2026-06-25 15:30:00', reviewTime: '2026-06-28 10:00:00', files: [{ id: 'F006', fileName: '长城文献分析报告.pdf', fileSize: '8MB', fileType: 'pdf', url: '' }, { id: 'F007', fileName: '文本分析代码.ipynb', fileSize: '2MB', fileType: 'ipynb', url: '' }] },
  { id: 'SUB006', assignmentId: 'A004', studentId: 'S004', studentName: '赵晓琳', scholarId: 'S2026-0004', university: '河北经贸大学', status: 'reviewed', score: 78, submitTime: '2026-06-24 20:15:00', reviewTime: '2026-06-29 11:30:00', files: [{ id: 'F008', fileName: '文本分析成果.zip', fileSize: '15MB', fileType: 'zip', url: '' }] },
  { id: 'SUB007', assignmentId: 'A005', studentId: 'S013', studentName: '褚明辉', scholarId: 'S2026-0013', university: '河北科技大学', status: 'reviewing', score: null, submitTime: '2026-07-01 22:00:00', reviewTime: null, files: [{ id: 'F009', fileName: '可视化看板.zip', fileSize: '25MB', fileType: 'zip', url: '' }] },
  { id: 'SUB008', assignmentId: 'A007', studentId: 'S007', studentName: '孙文博', scholarId: 'S2026-0007', university: '燕山大学', status: 'reviewed', score: 85, submitTime: '2026-07-01 14:00:00', reviewTime: '2026-07-02 08:30:00', files: [{ id: 'F010', fileName: '长城砖石纹理贴图.zip', fileSize: '120MB', fileType: 'zip', url: '' }] },
  { id: 'SUB009', assignmentId: 'A007', studentId: 'S018', studentName: '杨柳青', scholarId: 'S2026-0018', university: '唐山工业职业技术大学', status: 'submitted', score: null, submitTime: '2026-07-02 09:15:00', reviewTime: null, files: [{ id: 'F011', fileName: 'PBR纹理集.zip', fileSize: '98MB', fileType: 'zip', url: '' }] },
  { id: 'SUB010', assignmentId: 'A002', studentId: 'S001', studentName: '张明远', scholarId: 'S2026-0001', university: '唐山工业职业技术大学', status: 'submitted', score: null, submitTime: '2026-07-01 18:30:00', reviewTime: null, files: [{ id: 'F012', fileName: '八达岭地形.umap', fileSize: '180MB', fileType: 'umap', url: '' }] },
  { id: 'SUB011', assignmentId: 'A009', studentId: 'S010', studentName: '郑晓萌', scholarId: 'S2026-0010', university: '石家庄铁道大学', status: 'reviewed', score: 72, submitTime: '2026-06-26 23:00:00', reviewTime: '2026-06-28 16:00:00', files: [{ id: 'F013', fileName: 'Nanite优化报告.pdf', fileSize: '5MB', fileType: 'pdf', url: '' }] },
  { id: 'SUB012', assignmentId: 'A010', studentId: 'S009', studentName: '吴天宇', scholarId: 'S2026-0009', university: '河北师范大学', status: 'submitted', score: null, submitTime: '2026-07-02 07:40:00', reviewTime: null, files: [{ id: 'F014', fileName: 'VR场景工程.zip', fileSize: '320MB', fileType: 'zip', url: '' }] },
]

export function mockAssignments(page = 1, pageSize = 10, filters?: { status?: string; courseId?: string; type?: string }): PaginatedResponse<Assignment> {
  let filtered = [...assignments]
  if (filters?.status) {
    filtered = filtered.filter(a => a.status === filters.status)
  }
  if (filters?.courseId) {
    filtered = filtered.filter(a => a.courseId === filters.courseId)
  }
  if (filters?.type) {
    filtered = filtered.filter(a => a.type === filters.type)
  }
  const total = filtered.length
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)
  return { total, page, pageSize, items }
}

export function mockSubmissions(assignmentId: string, page = 1, pageSize = 10): PaginatedResponse<Submission> {
  const filtered = submissions.filter(s => s.assignmentId === assignmentId)
  const total = filtered.length
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)
  return { total, page, pageSize, items }
}
