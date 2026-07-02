import type { Invitation, PaginatedResponse } from './types'

const invitations: Invitation[] = [
  {
    id: 'INV001', schoolName: '唐山工业职业技术大学', contactPerson: '刘建国', contactPhone: '13803159901',
    contactEmail: 'liujianguo@tsvc.edu.cn', invitedStudents: 8, status: 'accepted',
    inviteDate: '2025-07-15', responseDate: '2025-07-20', notes: '数字媒体技术专业2024级学员已全部入驻系统。',
  },
  {
    id: 'INV002', schoolName: '河北工业大学', contactPerson: '王建军', contactPhone: '13903119902',
    contactEmail: 'wangjianjun@hebut.edu.cn', invitedStudents: 5, status: 'accepted',
    inviteDate: '2025-07-20', responseDate: '2025-07-25', notes: '包括计算机科学和工业设计两个专业的学员。',
  },
  {
    id: 'INV003', schoolName: '沧州师范学院', contactPerson: '张国强', contactPhone: '13703179903',
    contactEmail: 'zhangguoqiang@cztc.edu.cn', invitedStudents: 3, status: 'accepted',
    inviteDate: '2025-08-01', responseDate: '2025-08-05', notes: '美术学和计算机科学专业各一人，物联网工程专业一人。',
  },
  {
    id: 'INV004', schoolName: '河北经贸大学', contactPerson: '李明辉', contactPhone: '13603119904',
    contactEmail: 'liminghui@heuet.edu.cn', invitedStudents: 4, status: 'accepted',
    inviteDate: '2025-08-10', responseDate: '2025-08-12', notes: '文化产业管理和旅游管理专业学员已在平台上开展研究。',
  },
  {
    id: 'INV005', schoolName: '华北理工大学', contactPerson: '陈文博', contactPhone: '13503159905',
    contactEmail: 'chenwenbo@ncst.edu.cn', invitedStudents: 6, status: 'accepted',
    inviteDate: '2025-08-05', responseDate: '2025-08-08', notes: '涵盖软件工程、采矿工程和冶金工程等多专业学员。',
  },
  {
    id: 'INV006', schoolName: '鲁迅美术学院', contactPerson: '林芳华', contactPhone: '13803149906',
    contactEmail: 'linfanghua@lumei.edu.cn', invitedStudents: 2, status: 'accepted',
    inviteDate: '2025-08-15', responseDate: '2025-08-18', notes: '视觉传达设计专业学员，在可视化设计方向表现突出。',
  },
  {
    id: 'INV007', schoolName: '燕山大学', contactPerson: '赵永刚', contactPhone: '13903359907',
    contactEmail: 'zhaoyonggang@ysu.edu.cn', invitedStudents: 5, status: 'accepted',
    inviteDate: '2025-08-20', responseDate: '2025-08-22', notes: '机械设计和艺术设计专业学员已完成建模课程学习。',
  },
  {
    id: 'INV008', schoolName: '河北大学', contactPerson: '张雅文', contactPhone: '13703129908',
    contactEmail: 'zhangyawen@hbu.edu.cn', invitedStudents: 4, status: 'accepted',
    inviteDate: '2025-08-25', responseDate: '2025-08-28', notes: '历史学、新闻传播学和电子信息专业学员参与数字人文研究。',
  },
  {
    id: 'INV009', schoolName: '河北师范大学', contactPerson: '孙志远', contactPhone: '13603119909',
    contactEmail: 'sunzhiyuan@hebtu.edu.cn', invitedStudents: 3, status: 'accepted',
    inviteDate: '2025-09-01', responseDate: '2025-09-03', notes: '教育技术学专业学员负责VR教育应用方向研究。',
  },
  {
    id: 'INV010', schoolName: '石家庄铁道大学', contactPerson: '周建华', contactPhone: '13503119910',
    contactEmail: 'zhoujianhua@stdu.edu.cn', invitedStudents: 3, status: 'accepted',
    inviteDate: '2025-09-05', responseDate: '2025-09-07', notes: '建筑学和交通运输专业学员参与UE5场景和VR体验开发。',
  },
  {
    id: 'INV011', schoolName: '河北科技大学', contactPerson: '马晓东', contactPhone: '13703119911',
    contactEmail: 'maxiaodong@hebust.edu.cn', invitedStudents: 3, status: 'accepted',
    inviteDate: '2025-09-10', responseDate: '2025-09-12', notes: '电子信息工程和动画专业学员已完成多项课题任务。',
  },
  {
    id: 'INV012', schoolName: '唐山学院', contactPerson: '高建军', contactPhone: '13603159912',
    contactEmail: 'gaojianjun@tsc.edu.cn', invitedStudents: 2, status: 'pending',
    inviteDate: '2026-06-15', responseDate: null, notes: '环境设计专业意向学员，正在沟通合作细节。',
  },
  {
    id: 'INV013', schoolName: '唐山师范学院', contactPerson: '黄丽华', contactPhone: '13803159913',
    contactEmail: 'huanglihua@tstc.edu.cn', invitedStudents: 3, status: 'pending',
    inviteDate: '2026-06-20', responseDate: null, notes: '教育学专业意向学员，计划参与交互教育平台课题。',
  },
  {
    id: 'INV014', schoolName: '河北工程大学', contactPerson: '赵永强', contactPhone: '13903109914',
    contactEmail: 'zhaoyongqiang@hebeu.edu.cn', invitedStudents: 2, status: 'rejected',
    inviteDate: '2026-05-20', responseDate: '2026-05-25', notes: '因教学计划冲突，暂时无法参与本年度课题。',
  },
  {
    id: 'INV015', schoolName: '邯郸学院', contactPerson: '刘宏伟', contactPhone: '13703109915',
    contactEmail: 'liuhongwei@hdc.edu.cn', invitedStudents: 3, status: 'pending',
    inviteDate: '2026-07-01', responseDate: null, notes: '新拓展合作院校，历史学和考古学专业意向学员。',
  },
]

export function mockInvitations(page = 1, pageSize = 10): PaginatedResponse<Invitation> {
  const total = invitations.length
  const start = (page - 1) * pageSize
  const items = invitations.slice(start, start + pageSize)
  return { total, page, pageSize, items }
}
