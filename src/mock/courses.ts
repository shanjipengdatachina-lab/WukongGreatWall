import type { Course, CourseResource, PaginatedResponse } from './types'

const courses: Course[] = [
  {
    id: 'C001',
    title: 'UE5基础入门与场景搭建',
    cover: '',
    description: '本课程系统讲解Unreal Engine 5的基础操作与场景搭建技术，涵盖Nanite虚拟几何体、Lumen动态光照等核心特性。',
    teacher: '刘建国',
    university: '唐山工业职业技术大学',
    studentCount: 25,
    chapterCount: 6,
    chapters: [
      { id: 'CH001', title: 'UE5界面与工作流概述', order: 1, duration: '45分钟', resourceCount: 3 },
      { id: 'CH002', title: '静态网格体与材质基础', order: 2, duration: '60分钟', resourceCount: 5 },
      { id: 'CH003', title: 'Lumen动态全局光照', order: 3, duration: '50分钟', resourceCount: 4 },
      { id: 'CH004', title: 'Nanite虚拟几何体技术', order: 4, duration: '55分钟', resourceCount: 3 },
      { id: 'CH005', title: '地形与植被系统', order: 5, duration: '70分钟', resourceCount: 6 },
      { id: 'CH006', title: '场景渲染与输出', order: 6, duration: '40分钟', resourceCount: 2 },
    ],
    status: 'published',
    createdAt: '2025-11-15',
    updatedAt: '2026-06-20',
  },
  {
    id: 'C002',
    title: 'Houdini程序化特效制作',
    cover: '',
    description: '深入学习Houdini程序化建模与特效制作，包括粒子系统、流体模拟、刚体破碎等高级技术。',
    teacher: '王建军',
    university: '河北工业大学',
    studentCount: 18,
    chapterCount: 5,
    chapters: [
      { id: 'CH007', title: 'Houdini基础与节点思维', order: 1, duration: '50分钟', resourceCount: 4 },
      { id: 'CH008', title: '程序化建模入门', order: 2, duration: '65分钟', resourceCount: 5 },
      { id: 'CH009', title: '粒子与流体模拟', order: 3, duration: '75分钟', resourceCount: 6 },
      { id: 'CH010', title: '刚体与布料解算', order: 4, duration: '60分钟', resourceCount: 4 },
      { id: 'CH011', title: '综合项目实战', order: 5, duration: '90分钟', resourceCount: 7 },
    ],
    status: 'published',
    createdAt: '2025-12-01',
    updatedAt: '2026-06-15',
  },
  {
    id: 'C003',
    title: '数字人文研究方法与实践',
    cover: '',
    description: '探索数字技术与人文研究的交叉融合，涵盖文本挖掘、网络分析、GIS空间分析等数字人文核心方法。',
    teacher: '张雅文',
    university: '河北大学',
    studentCount: 22,
    chapterCount: 4,
    chapters: [
      { id: 'CH012', title: '数字人文概论', order: 1, duration: '40分钟', resourceCount: 3 },
      { id: 'CH013', title: '文本挖掘与远读技术', order: 2, duration: '55分钟', resourceCount: 5 },
      { id: 'CH014', title: '社交网络分析', order: 3, duration: '50分钟', resourceCount: 4 },
      { id: 'CH015', title: 'GIS与空间人文', order: 4, duration: '60分钟', resourceCount: 6 },
    ],
    status: 'published',
    createdAt: '2026-01-10',
    updatedAt: '2026-06-25',
  },
  {
    id: 'C004',
    title: '数据可视化与交互设计',
    cover: '',
    description: '学习数据可视化基本原理与交互设计方法，掌握ECharts、D3.js等主流可视化工具。',
    teacher: '陈明华',
    university: '华北理工大学',
    studentCount: 20,
    chapterCount: 5,
    chapters: [
      { id: 'CH016', title: '可视化设计基础理论', order: 1, duration: '45分钟', resourceCount: 3 },
      { id: 'CH017', title: 'ECharts图表库实战', order: 2, duration: '60分钟', resourceCount: 5 },
      { id: 'CH018', title: 'D3.js高级可视化', order: 3, duration: '70分钟', resourceCount: 6 },
      { id: 'CH019', title: '交互设计原则与模式', order: 4, duration: '50分钟', resourceCount: 4 },
      { id: 'CH020', title: '数据大屏综合项目', order: 5, duration: '80分钟', resourceCount: 8 },
    ],
    status: 'published',
    createdAt: '2026-02-20',
    updatedAt: '2026-06-28',
  },
  {
    id: 'C005',
    title: 'Blender三维建模与渲染',
    cover: '',
    description: '从零开始学习Blender三维建模，涵盖多边形建模、雕刻、材质贴图、灯光渲染等完整工作流。',
    teacher: '赵永刚',
    university: '燕山大学',
    studentCount: 19,
    chapterCount: 6,
    chapters: [
      { id: 'CH021', title: 'Blender界面与操作基础', order: 1, duration: '50分钟', resourceCount: 4 },
      { id: 'CH022', title: '多边形建模技法', order: 2, duration: '65分钟', resourceCount: 5 },
      { id: 'CH023', title: '数字雕刻入门', order: 3, duration: '55分钟', resourceCount: 3 },
      { id: 'CH024', title: 'PBR材质与纹理绘制', order: 4, duration: '70分钟', resourceCount: 6 },
      { id: 'CH025', title: '灯光与Cycles渲染', order: 5, duration: '60分钟', resourceCount: 4 },
      { id: 'CH026', title: '长城城楼建模实战', order: 6, duration: '90分钟', resourceCount: 7 },
    ],
    status: 'published',
    createdAt: '2026-03-05',
    updatedAt: '2026-06-30',
  },
  {
    id: 'C006',
    title: '虚拟现实技术与应用',
    cover: '',
    description: '全面介绍VR/AR/MR技术原理与应用实践，基于Unreal Engine和Unity引擎进行VR交互开发。',
    teacher: '孙立新',
    university: '河北科技大学',
    studentCount: 16,
    chapterCount: 5,
    chapters: [
      { id: 'CH027', title: '虚拟现实技术概论', order: 1, duration: '40分钟', resourceCount: 3 },
      { id: 'CH028', title: 'VR硬件与交互设备', order: 2, duration: '45分钟', resourceCount: 4 },
      { id: 'CH029', title: 'UE5 VR项目搭建', order: 3, duration: '60分钟', resourceCount: 5 },
      { id: 'CH030', title: 'VR交互逻辑设计', order: 4, duration: '65分钟', resourceCount: 6 },
      { id: 'CH031', title: '文化遗产VR体验项目', order: 5, duration: '80分钟', resourceCount: 8 },
    ],
    status: 'published',
    createdAt: '2026-03-15',
    updatedAt: '2026-07-01',
  },
  {
    id: 'C007',
    title: '交互设计思维与方法',
    cover: '',
    description: '培养交互设计思维，学习用户研究方法、信息架构设计、交互原型制作等核心技能。',
    teacher: '林芳华',
    university: '鲁迅美术学院',
    studentCount: 14,
    chapterCount: 4,
    chapters: [
      { id: 'CH032', title: '设计思维与双钻模型', order: 1, duration: '45分钟', resourceCount: 3 },
      { id: 'CH033', title: '用户研究与需求分析', order: 2, duration: '55分钟', resourceCount: 5 },
      { id: 'CH034', title: '信息架构与交互流程', order: 3, duration: '50分钟', resourceCount: 4 },
      { id: 'CH035', title: '原型设计与可用性测试', order: 4, duration: '60分钟', resourceCount: 6 },
    ],
    status: 'draft',
    createdAt: '2026-04-01',
    updatedAt: '2026-06-18',
  },
]

const resources: CourseResource[] = [
  { id: 'CR001', courseId: 'C001', courseTitle: 'UE5基础入门与场景搭建', chapterId: 'CH001', chapterTitle: 'UE5界面与工作流概述', title: 'UE5官方界面指南', type: 'pdf', url: '', fileSize: '2.3MB', uploadTime: '2025-11-16', downloadCount: 156 },
  { id: 'CR002', courseId: 'C001', courseTitle: 'UE5基础入门与场景搭建', chapterId: 'CH001', chapterTitle: 'UE5界面与工作流概述', title: 'Epic官方学习资源链接', type: 'link', url: '', fileSize: '-', uploadTime: '2025-11-16', downloadCount: 89 },
  { id: 'CR003', courseId: 'C001', courseTitle: 'UE5基础入门与场景搭建', chapterId: 'CH002', chapterTitle: '静态网格体与材质基础', title: '长城城墙材质球示例', type: 'project', url: '', fileSize: '156MB', uploadTime: '2025-11-20', downloadCount: 203 },
  { id: 'CR004', courseId: 'C001', courseTitle: 'UE5基础入门与场景搭建', chapterId: 'CH003', chapterTitle: 'Lumen动态全局光照', title: '光照场景演示文件', type: 'project', url: '', fileSize: '320MB', uploadTime: '2025-11-25', downloadCount: 178 },
  { id: 'CR005', courseId: 'C002', courseTitle: 'Houdini程序化特效制作', chapterId: 'CH007', chapterTitle: 'Houdini基础与节点思维', title: 'Houdini节点速查表', type: 'pdf', url: '', fileSize: '1.8MB', uploadTime: '2025-12-02', downloadCount: 134 },
  { id: 'CR006', courseId: 'C002', courseTitle: 'Houdini程序化特效制作', chapterId: 'CH008', chapterTitle: '程序化建模入门', title: '长城烽火台程序化生成', type: 'project', url: '', fileSize: '45MB', uploadTime: '2025-12-08', downloadCount: 167 },
  { id: 'CR007', courseId: 'C003', courseTitle: '数字人文研究方法与实践', chapterId: 'CH012', chapterTitle: '数字人文概论', title: '数字人文经典论文选读', type: 'pdf', url: '', fileSize: '5.6MB', uploadTime: '2026-01-12', downloadCount: 98 },
  { id: 'CR008', courseId: 'C004', courseTitle: '数据可视化与交互设计', chapterId: 'CH017', chapterTitle: 'ECharts图表库实战', title: '长城数据可视化看板', type: 'project', url: '', fileSize: '12MB', uploadTime: '2026-02-25', downloadCount: 145 },
  { id: 'CR009', courseId: 'C005', courseTitle: 'Blender三维建模与渲染', chapterId: 'CH022', chapterTitle: '多边形建模技法', title: '长城砖石参考图集', type: 'pdf', url: '', fileSize: '8.2MB', uploadTime: '2026-03-10', downloadCount: 112 },
  { id: 'CR010', courseId: 'C005', courseTitle: 'Blender三维建模与渲染', chapterId: 'CH026', chapterTitle: '长城城楼建模实战', title: '城楼模型源文件', type: 'project', url: '', fileSize: '267MB', uploadTime: '2026-03-20', downloadCount: 189 },
  { id: 'CR011', courseId: 'C006', courseTitle: '虚拟现实技术与应用', chapterId: 'CH029', chapterTitle: 'UE5 VR项目搭建', title: 'VR项目模板', type: 'project', url: '', fileSize: '450MB', uploadTime: '2026-03-22', downloadCount: 95 },
  { id: 'CR012', courseId: 'C006', courseTitle: '虚拟现实技术与应用', chapterId: 'CH031', chapterTitle: '文化遗产VR体验项目', title: '长城VR漫游参考链接', type: 'link', url: '', fileSize: '-', uploadTime: '2026-04-01', downloadCount: 67 },
]

export function mockCourses(page = 1, pageSize = 10): PaginatedResponse<Course> {
  const total = courses.length
  const start = (page - 1) * pageSize
  const items = courses.slice(start, start + pageSize)
  return { total, page, pageSize, items }
}

export function mockCourseResources(page = 1, pageSize = 10): PaginatedResponse<CourseResource> {
  const total = resources.length
  const start = (page - 1) * pageSize
  const items = resources.slice(start, start + pageSize)
  return { total, page, pageSize, items }
}
