import type { Message, PaginatedResponse } from './types'

const messages: Message[] = [
  {
    id: 'MSG001', title: '新作业发布通知', content: 'UE5基础入门课程发布了新作业"长城城墙材质制作"，截止日期为2026年7月15日，请及时完成并提交。',
    type: 'assignment', senderId: 'U_R001', senderName: '刘建国', receiverId: 'S001', receiverName: '张明远',
    isRead: true, isStarred: false, createdAt: '2026-06-20 09:00:00', readAt: '2026-06-20 10:30:00',
  },
  {
    id: 'MSG002', title: '作业评审结果通知', content: '您的作业"长城城墙材质制作"已通过评审，最终得分88分。老师评语：整体材质效果不错，砖石的质感和风化的处理都很有水平。',
    type: 'review', senderId: 'U_R001', senderName: '刘建国', receiverId: 'S001', receiverName: '张明远',
    isRead: true, isStarred: true, createdAt: '2026-07-02 14:00:00', readAt: '2026-07-02 14:30:00',
  },
  {
    id: 'MSG003', title: '课题中期检查提醒', content: '数字长城文化遗产数字化保护研究课题将于7月15日进行中期检查，请提前准备汇报材料和阶段性成果展示。',
    type: 'topic', senderId: 'S001', senderName: '张明远', receiverId: 'S004', receiverName: '赵晓琳',
    isRead: false, isStarred: false, createdAt: '2026-07-02 08:00:00', readAt: null,
  },
  {
    id: 'MSG004', title: '系统升级维护通知', content: '系统将于2026年7月3日凌晨2:00-4:00进行升级维护，届时系统将暂停访问，请提前保存好当前工作。',
    type: 'system', senderId: 'U_ADMIN', senderName: '系统管理员', receiverId: 'S001', receiverName: '张明远',
    isRead: true, isStarred: false, createdAt: '2026-07-01 18:00:00', readAt: '2026-07-01 19:00:00',
  },
  {
    id: 'MSG005', title: '课程开课通知', content: '您报名的"数字人文研究方法与实践"课程已正式开课，授课老师为张雅文，请及时登录系统开始学习。',
    type: 'notification', senderId: 'U_ADMIN', senderName: '系统管理员', receiverId: 'S008', receiverName: '周雨晴',
    isRead: true, isStarred: false, createdAt: '2026-01-10 10:00:00', readAt: '2026-01-10 11:00:00',
  },
  {
    id: 'MSG006', title: '任务分配通知', content: '您被分配了课题任务"NLP文本分析模型训练"，优先级紧急，截止日期2026年8月1日。请查看任务详情并开始工作。',
    type: 'topic', senderId: 'S008', senderName: '周雨晴', receiverId: 'S016', receiverName: '沈佳怡',
    isRead: true, isStarred: false, createdAt: '2026-05-20 14:00:00', readAt: '2026-05-20 15:30:00',
  },
  {
    id: 'MSG007', title: '作业即将到期提醒', content: '您还有作业"高精度长城砖石资产优化"未提交，该作业已于2026年6月25日到期，状态已标记为逾期，请尽快补交。',
    type: 'assignment', senderId: 'U_R001', senderName: '刘建国', receiverId: 'S005', receiverName: '陈志强',
    isRead: false, isStarred: false, createdAt: '2026-06-26 08:00:00', readAt: null,
  },
  {
    id: 'MSG008', title: '欢迎加入平台', content: '欢迎加入万里长城数字长卷学员管理平台！您可以在课程中心选择感兴趣的课程，参与课题研究，提交研究成果。如需帮助，请联系平台管理员。',
    type: 'system', senderId: 'U_ADMIN', senderName: '系统管理员', receiverId: 'S029', receiverName: '严思源',
    isRead: true, isStarred: false, createdAt: '2025-09-01 09:00:00', readAt: '2025-09-01 10:00:00',
  },
  {
    id: 'MSG009', title: '评审任务提醒', content: '您有新评审任务需要处理：学员冯建平提交了UE5场景Demo视频，请于3个工作日内完成评审。',
    type: 'review', senderId: 'U_ADMIN', senderName: '系统管理员', receiverId: 'U_R001', receiverName: '刘建国',
    isRead: false, isStarred: false, createdAt: '2026-06-25 16:00:00', readAt: null,
  },
  {
    id: 'MSG010', title: '课题成员邀请', content: '赵晓琳邀请您加入"长城文化遗产交互教育平台"课题，该课题聚焦于面向中小学生的交互教育内容开发。请在课题看板中确认加入。',
    type: 'topic', senderId: 'S004', senderName: '赵晓琳', receiverId: 'S021', receiverName: '尤思远',
    isRead: true, isStarred: true, createdAt: '2026-06-05 10:00:00', readAt: '2026-06-05 14:00:00',
  },
  {
    id: 'MSG011', title: '资源共享通知', content: '孙文博在课题"长城建筑结构三维重建技术研究"中共享了"建模参考素材"资源，包含山海关和居庸关高清参考图片。',
    type: 'notification', senderId: 'S007', senderName: '孙文博', receiverId: 'S018', receiverName: '杨柳青',
    isRead: true, isStarred: false, createdAt: '2026-06-01 09:30:00', readAt: '2026-06-01 10:00:00',
  },
  {
    id: 'MSG012', title: '上周学习统计', content: '上周学习报告：您完成了3个课程章节的学习，提交了1份作业，参与了2次课题讨论。学习进度良好，请继续保持！',
    type: 'notification', senderId: 'U_ADMIN', senderName: '系统管理员', receiverId: 'S002', receiverName: '李思雨',
    isRead: true, isStarred: false, createdAt: '2026-06-30 08:00:00', readAt: '2026-06-30 09:00:00',
  },
  {
    id: 'MSG013', title: 'VR设备借用通知', content: 'VR头显设备已到货，HTC Vive Pro 2和Meta Quest 2各两台。有VR开发需求的课题组成员可联系管理员借用。',
    type: 'notification', senderId: 'S009', senderName: '吴天宇', receiverId: 'S024', receiverName: '吕若兰',
    isRead: false, isStarred: false, createdAt: '2026-05-01 10:00:00', readAt: null,
  },
  {
    id: 'MSG014', title: '平台更新公告', content: '平台已更新至v2.1版本，新增功能包括：课题协作图谱可视化、批量作业评审、数据字典管理和消息中心优化。',
    type: 'system', senderId: 'U_ADMIN', senderName: '系统管理员', receiverId: 'S001', receiverName: '张明远',
    isRead: true, isStarred: false, createdAt: '2026-06-15 10:00:00', readAt: '2026-06-15 12:00:00',
  },
  {
    id: 'MSG015', title: '文档审核结果', content: '您提交的成果"居庸关城楼三维重建模型"已通过审核，被评为优秀成果。审核人评语：模型精度高，贴图细节丰富，可作为后续课题的参考标准。',
    type: 'review', senderId: 'U_R002', senderName: '王建军', receiverId: 'S007', receiverName: '孙文博',
    isRead: true, isStarred: true, createdAt: '2026-07-01 16:00:00', readAt: '2026-07-02 09:00:00',
  },
]

export function mockMessages(page = 1, pageSize = 10): PaginatedResponse<Message> {
  const total = messages.length
  const start = (page - 1) * pageSize
  const items = messages.slice(start, start + pageSize)
  return { total, page, pageSize, items }
}
