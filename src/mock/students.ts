import type { Student, StudentDetail, PaginatedResponse } from './types'

const students: Student[] = [
  { id: 'S001', scholarId: 'S2026-0001', name: '张明远', gender: '男', university: '唐山工业职业技术大学', major: '数字媒体技术', researchDirection: 'UE5可视化开发', roleType: '学员', grade: '2024级', phone: '13803150101', email: 'zhangmingyuan@tsvc.edu.cn', courseProgress: 85, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S002', scholarId: 'S2026-0002', name: '李思雨', gender: '女', university: '河北工业大学', major: '计算机科学与技术', researchDirection: '数字人文研究', roleType: '学员', grade: '2024级', phone: '13903110202', email: 'lisiyu@hebut.edu.cn', courseProgress: 92, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S003', scholarId: 'S2026-0003', name: '王浩然', gender: '男', university: '沧州师范学院', major: '美术学', researchDirection: '交互设计', roleType: '学员', grade: '2024级', phone: '13703170303', email: 'wanghaoran@cztc.edu.cn', courseProgress: 67, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S004', scholarId: 'S2026-0004', name: '赵晓琳', gender: '女', university: '河北经贸大学', major: '文化产业管理', researchDirection: '数字文化遗产保护', roleType: '学员', grade: '2024级', phone: '13603110404', email: 'zhaoxiaolin@heuet.edu.cn', courseProgress: 78, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S005', scholarId: 'S2026-0005', name: '陈志强', gender: '男', university: '华北理工大学', major: '软件工程', researchDirection: 'AI辅助设计', roleType: '学员', grade: '2023级', phone: '13503150505', email: 'chenzhiqiang@ncst.edu.cn', courseProgress: 55, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S006', scholarId: 'S2026-0006', name: '刘美琪', gender: '女', university: '鲁迅美术学院', major: '视觉传达设计', researchDirection: '可视化设计', roleType: '学员', grade: '2024级', phone: '13803140606', email: 'liumeiqi@lumei.edu.cn', courseProgress: 100, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S007', scholarId: 'S2026-0007', name: '孙文博', gender: '男', university: '燕山大学', major: '机械设计制造及其自动化', researchDirection: 'Blender建模', roleType: '学员', grade: '2023级', phone: '13903350707', email: 'sunwenbo@ysu.edu.cn', courseProgress: 43, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S008', scholarId: 'S2026-0008', name: '周雨晴', gender: '女', university: '河北大学', major: '历史学', researchDirection: '数字人文研究', roleType: '学员', grade: '2024级', phone: '13703120808', email: 'zhouyuqing@hbu.edu.cn', courseProgress: 71, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S009', scholarId: 'S2026-0009', name: '吴天宇', gender: '男', university: '河北师范大学', major: '教育技术学', researchDirection: '虚拟现实应用', roleType: '学员', grade: '2024级', phone: '13603110909', email: 'wutianyu@hebtu.edu.cn', courseProgress: 89, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S010', scholarId: 'S2026-0010', name: '郑晓萌', gender: '女', university: '石家庄铁道大学', major: '建筑学', researchDirection: 'UE5可视化开发', roleType: '学员', grade: '2023级', phone: '13503111010', email: 'zhengxiaomeng@stdu.edu.cn', courseProgress: 60, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S011', scholarId: 'S2026-0011', name: '冯建平', gender: '男', university: '唐山工业职业技术大学', major: '动漫制作技术', researchDirection: 'Houdini特效制作', roleType: '学员', grade: '2024级', phone: '13803151111', email: 'fengjianping@tsvc.edu.cn', courseProgress: 76, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S012', scholarId: 'S2026-0012', name: '陈雪婷', gender: '女', university: '河北工业大学', major: '工业设计', researchDirection: '可视化设计', roleType: '学员', grade: '2025级', phone: '13903111212', email: 'chenxueting@hebut.edu.cn', courseProgress: 38, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S013', scholarId: 'S2026-0013', name: '褚明辉', gender: '男', university: '河北科技大学', major: '电子信息工程', researchDirection: '游戏引擎开发', roleType: '学员', grade: '2024级', phone: '13703111313', email: 'chuminghui@hebust.edu.cn', courseProgress: 94, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S014', scholarId: 'S2026-0014', name: '卫诗涵', gender: '女', university: '唐山学院', major: '环境设计', researchDirection: '数字文化遗产保护', roleType: '学员', grade: '2024级', phone: '13603151414', email: 'weishihan@tsc.edu.cn', courseProgress: 81, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S015', scholarId: 'S2026-0015', name: '蒋鹏飞', gender: '男', university: '华北理工大学', major: '采矿工程', researchDirection: '虚拟现实应用', roleType: '学员', grade: '2023级', phone: '13503151515', email: 'jiangpengfei@ncst.edu.cn', courseProgress: 52, visibility: 'hidden', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S016', scholarId: 'S2026-0016', name: '沈佳怡', gender: '女', university: '沧州师范学院', major: '计算机科学与技术', researchDirection: 'AI辅助设计', roleType: '学员', grade: '2024级', phone: '13803171616', email: 'shenjiayi@cztc.edu.cn', courseProgress: 70, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S017', scholarId: 'S2026-0017', name: '韩逸飞', gender: '男', university: '河北经贸大学', major: '旅游管理', researchDirection: '数字人文研究', roleType: '学员', grade: '2024级', phone: '13903111717', email: 'hanyifei@heuet.edu.cn', courseProgress: 65, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S018', scholarId: 'S2026-0018', name: '杨柳青', gender: '女', university: '唐山工业职业技术大学', major: '数字媒体技术', researchDirection: 'Blender建模', roleType: '学员', grade: '2025级', phone: '13703151818', email: 'yangliuqing@tsvc.edu.cn', courseProgress: 49, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S019', scholarId: 'S2026-0019', name: '朱俊杰', gender: '男', university: '燕山大学', major: '艺术设计', researchDirection: '可视化设计', roleType: '学员', grade: '2023级', phone: '13603351919', email: 'zhujunjie@ysu.edu.cn', courseProgress: 87, visibility: 'visible', status: 'inactive', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S020', scholarId: 'S2026-0020', name: '秦悦然', gender: '女', university: '河北大学', major: '新闻传播学', researchDirection: '影视特效', roleType: '学员', grade: '2024级', phone: '13503122020', email: 'qinyueran@hbu.edu.cn', courseProgress: 56, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S021', scholarId: 'S2026-0021', name: '尤思远', gender: '男', university: '唐山师范学院', major: '教育学', researchDirection: '交互设计', roleType: '学员', grade: '2024级', phone: '13803152121', email: 'yousiyuan@tstc.edu.cn', courseProgress: 73, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S022', scholarId: 'S2026-0022', name: '许梦洁', gender: '女', university: '河北工程大学', major: '土木工程', researchDirection: 'Houdini特效制作', roleType: '学员', grade: '2023级', phone: '13903102222', email: 'xumengjie@hebeu.edu.cn', courseProgress: 62, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S023', scholarId: 'S2026-0023', name: '何嘉禾', gender: '男', university: '河北科技大学', major: '动画', researchDirection: 'UE5可视化开发', roleType: '学员', grade: '2024级', phone: '13703112323', email: 'hejiahe@hebust.edu.cn', courseProgress: 90, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S024', scholarId: 'S2026-0024', name: '吕若兰', gender: '女', university: '石家庄铁道大学', major: '交通运输', researchDirection: '虚拟现实应用', roleType: '学员', grade: '2024级', phone: '13603112424', email: 'lvruolan@stdu.edu.cn', courseProgress: 47, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S025', scholarId: 'S2026-0025', name: '施正阳', gender: '男', university: '华北理工大学', major: '冶金工程', researchDirection: 'AI辅助设计', roleType: '学员', grade: '2023级', phone: '13503152525', email: 'shizhengyang@ncst.edu.cn', courseProgress: 83, visibility: 'hidden', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S026', scholarId: 'S2026-0026', name: '张蕊希', gender: '女', university: '河北工业大学', major: '环境工程', researchDirection: '数字文化遗产保护', roleType: '学员', grade: '2024级', phone: '13803112626', email: 'zhangruixi@hebut.edu.cn', courseProgress: 69, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S027', scholarId: 'S2026-0027', name: '孔德霖', gender: '男', university: '沧州师范学院', major: '物联网工程', researchDirection: '游戏引擎开发', roleType: '学员', grade: '2024级', phone: '13903172727', email: 'kongdelin@cztc.edu.cn', courseProgress: 45, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S028', scholarId: 'S2026-0028', name: '曹雅楠', gender: '女', university: '唐山工业职业技术大学', major: '影视多媒体技术', researchDirection: '影视特效', roleType: '学员', grade: '2025级', phone: '13703152828', email: 'caoyanan@tsvc.edu.cn', courseProgress: 35, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
  { id: 'S029', scholarId: 'S2026-0029', name: '严思源', gender: '男', university: '河北大学', major: '电子信息科学与技术', researchDirection: '交互设计', roleType: '学员', grade: '2024级', phone: '13603122929', email: 'yansiyuan@hbu.edu.cn', courseProgress: 58, visibility: 'visible', status: 'active', enrollmentDate: '2025-09-01', avatar: '' },
]

export function mockStudents(page = 1, pageSize = 10, filters?: { keyword?: string; university?: string; status?: string; researchDirection?: string }): PaginatedResponse<Student> {
  let filtered = [...students]

  if (filters?.keyword) {
    const kw = filters.keyword.toLowerCase()
    filtered = filtered.filter(s =>
      s.name.includes(kw) || s.scholarId.toLowerCase().includes(kw) || s.university.includes(kw),
    )
  }
  if (filters?.university) {
    filtered = filtered.filter(s => s.university === filters.university)
  }
  if (filters?.status) {
    filtered = filtered.filter(s => s.status === filters.status)
  }
  if (filters?.researchDirection) {
    filtered = filtered.filter(s => s.researchDirection === filters.researchDirection)
  }

  const total = filtered.length
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)

  return { total, page, pageSize, items }
}

export function mockStudent(id: string): StudentDetail | null {
  const s = students.find(st => st.id === id)
  if (!s) return null
  return {
    ...s,
    completedAssignments: Math.floor(Math.random() * 10) + 2,
    totalAssignments: 12,
    topicCount: Math.floor(Math.random() * 3) + 1,
    outcomeCount: Math.floor(Math.random() * 5),
    loginCount: Math.floor(Math.random() * 120) + 30,
    lastLoginTime: '2026-07-01 14:30:25',
    notes: '该学员学习态度认真，课程完成度较高，在课题研究方面表现积极。',
  }
}
