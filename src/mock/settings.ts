import type { Role, Dictionary, SystemConfig, AuditLog, PaginatedResponse } from './types'

export function mockRoles(): Role[] {
  return [
    {
      id: 'ROLE001', name: '超级管理员', code: 'super_admin',
      description: '拥有系统所有功能和数据权限，可管理系统配置、用户角色和全部数据。',
      permissions: ['*'],
      userCount: 1,
      createdAt: '2025-06-01',
    },
    {
      id: 'ROLE002', name: '管理员', code: 'admin',
      description: '可管理学员、课程、课题等核心业务数据，但不可修改系统级配置。',
      permissions: ['student:view', 'student:edit', 'student:delete', 'course:view', 'course:edit', 'course:delete', 'assignment:view', 'assignment:edit', 'topic:view', 'topic:edit', 'review:view', 'review:edit'],
      userCount: 3,
      createdAt: '2025-06-01',
    },
    {
      id: 'ROLE003', name: '评审员', code: 'reviewer',
      description: '负责学员作业和课题成果的评审工作，可查看分配给自己评审的材料并给出评审意见。',
      permissions: ['assignment:view', 'review:view', 'review:edit', 'outcome:view', 'outcome:edit', 'topic:view'],
      userCount: 5,
      createdAt: '2025-07-01',
    },
    {
      id: 'ROLE004', name: '学员', code: 'student',
      description: '系统主要使用者，可学习课程、提交作业、参与课题研究、上传成果和下载资源。',
      permissions: ['course:view', 'assignment:view', 'assignment:submit', 'topic:view', 'task:view', 'task:edit', 'outcome:view', 'outcome:submit', 'resource:view', 'resource:download', 'message:view', 'message:send'],
      userCount: 29,
      createdAt: '2025-06-01',
    },
  ]
}

export function mockDictionaries(): Dictionary[] {
  return [
    {
      id: 'DICT001', code: 'research_direction', name: '研究方向',
      items: [
        { id: 'DI001', label: 'UE5可视化开发', value: 'ue5_visualization', sort: 1, status: 'enabled' },
        { id: 'DI002', label: 'Houdini特效制作', value: 'houdini_vfx', sort: 2, status: 'enabled' },
        { id: 'DI003', label: '数字人文研究', value: 'digital_humanities', sort: 3, status: 'enabled' },
        { id: 'DI004', label: '可视化设计', value: 'visual_design', sort: 4, status: 'enabled' },
        { id: 'DI005', label: 'Blender建模', value: 'blender_modeling', sort: 5, status: 'enabled' },
        { id: 'DI006', label: '虚拟现实应用', value: 'vr_application', sort: 6, status: 'enabled' },
        { id: 'DI007', label: '交互设计', value: 'interaction_design', sort: 7, status: 'enabled' },
        { id: 'DI008', label: '数字文化遗产保护', value: 'heritage_preservation', sort: 8, status: 'enabled' },
        { id: 'DI009', label: '游戏引擎开发', value: 'game_engine_development', sort: 9, status: 'enabled' },
        { id: 'DI010', label: '影视特效', value: 'film_vfx', sort: 10, status: 'enabled' },
        { id: 'DI011', label: 'AI辅助设计', value: 'ai_design', sort: 11, status: 'enabled' },
      ],
    },
    {
      id: 'DICT002', code: 'school_type', name: '院校类型',
      items: [
        { id: 'DI012', label: '职业本科', value: 'vocational_undergraduate', sort: 1, status: 'enabled' },
        { id: 'DI013', label: '普通本科', value: 'regular_undergraduate', sort: 2, status: 'enabled' },
        { id: 'DI014', label: '双一流建设高校', value: 'double_first_class', sort: 3, status: 'enabled' },
        { id: 'DI015', label: '艺术类院校', value: 'art_academy', sort: 4, status: 'enabled' },
        { id: 'DI016', label: '师范类院校', value: 'normal_college', sort: 5, status: 'enabled' },
      ],
    },
    {
      id: 'DICT003', code: 'task_status', name: '任务状态',
      items: [
        { id: 'DI017', label: '待开始', value: 'todo', sort: 1, status: 'enabled' },
        { id: 'DI018', label: '进行中', value: 'in_progress', sort: 2, status: 'enabled' },
        { id: 'DI019', label: '待审核', value: 'review', sort: 3, status: 'enabled' },
        { id: 'DI020', label: '已完成', value: 'done', sort: 4, status: 'enabled' },
      ],
    },
    {
      id: 'DICT004', code: 'outcome_type', name: '成果类型',
      items: [
        { id: 'DI021', label: '渲染图', value: 'render', sort: 1, status: 'enabled' },
        { id: 'DI022', label: '文档报告', value: 'document', sort: 2, status: 'enabled' },
        { id: 'DI023', label: '视频', value: 'video', sort: 3, status: 'enabled' },
        { id: 'DI024', label: '三维模型', value: 'model', sort: 4, status: 'enabled' },
      ],
    },
    {
      id: 'DICT005', code: 'message_type', name: '消息类型',
      items: [
        { id: 'DI025', label: '系统通知', value: 'system', sort: 1, status: 'enabled' },
        { id: 'DI026', label: '作业提醒', value: 'assignment', sort: 2, status: 'enabled' },
        { id: 'DI027', label: '评审通知', value: 'review', sort: 3, status: 'enabled' },
        { id: 'DI028', label: '课题消息', value: 'topic', sort: 4, status: 'enabled' },
        { id: 'DI029', label: '通用通知', value: 'notification', sort: 5, status: 'enabled' },
      ],
    },
  ]
}

export function mockSystemConfig(): SystemConfig {
  return {
    siteName: '万里长城数字长卷学员管理平台',
    siteLogo: '/favicon.svg',
    maxFileSize: 500,
    allowedFileTypes: ['pdf', 'doc', 'docx', 'zip', 'rar', '7z', 'jpg', 'png', 'mp4', 'blend', 'fbx', 'obj', 'ply', 'uasset', 'hip'],
    enableRegistration: false,
    enableNotification: true,
    maintenanceMode: false,
    defaultPageSize: 10,
    sessionTimeout: 120,
  }
}

const auditLogs: AuditLog[] = [
  { id: 'LOG001', userId: 'U_ADMIN', userName: '系统管理员', action: '用户登录', module: '系统', detail: '管理员通过密码登录系统', ip: '192.168.1.100', userAgent: 'Chrome/126.0', status: 'success', createdAt: '2026-07-02 08:00:00' },
  { id: 'LOG002', userId: 'U_ADMIN', userName: '系统管理员', action: '新增学员', module: '学员管理', detail: '导入学员严思源(S2026-0029)信息', ip: '192.168.1.100', userAgent: 'Chrome/126.0', status: 'success', createdAt: '2026-07-02 08:15:00' },
  { id: 'LOG003', userId: 'U_R001', userName: '刘建国', action: '发布作业', module: '课程管理', detail: '在UE5基础课程中发布"山海关城楼精细建模"作业', ip: '192.168.1.50', userAgent: 'Chrome/126.0', status: 'success', createdAt: '2026-07-02 09:00:00' },
  { id: 'LOG004', userId: 'S001', userName: '张明远', action: '提交作业', module: '作业管理', detail: '提交"长城城墙材质制作"作业第3版', ip: '10.0.1.25', userAgent: 'Chrome/126.0', status: 'success', createdAt: '2026-07-02 10:30:00' },
  { id: 'LOG005', userId: 'U_R001', userName: '刘建国', action: '评审作业', module: '评审管理', detail: '完成对张明远"长城城墙材质制作"作业的评审，评分88分', ip: '192.168.1.50', userAgent: 'Chrome/126.0', status: 'success', createdAt: '2026-07-02 14:00:00' },
  { id: 'LOG006', userId: 'S011', userName: '冯建平', action: '上传成果', module: '成果管理', detail: '上传课题成果"UE5材质与光照技术报告"', ip: '10.0.1.30', userAgent: 'Edge/126.0', status: 'success', createdAt: '2026-07-02 14:30:00' },
  { id: 'LOG007', userId: 'U_ADMIN', userName: '系统管理员', action: '配置修改', module: '系统配置', detail: '修改默认分页大小为每页15条', ip: '192.168.1.100', userAgent: 'Chrome/126.0', status: 'success', createdAt: '2026-07-02 15:00:00' },
  { id: 'LOG008', userId: 'S013', userName: '褚明辉', action: '完成任务', module: '课题任务', detail: '标记"数据接口设计与开发"任务为已完成', ip: '10.0.1.40', userAgent: 'Chrome/126.0', status: 'success', createdAt: '2026-07-02 15:30:00' },
  { id: 'LOG009', userId: 'S008', userName: '周雨晴', action: '下载资源', module: '资源管理', detail: '下载"数字人文经典论文选读"PDF文档', ip: '10.0.1.35', userAgent: 'Chrome/126.0', status: 'success', createdAt: '2026-07-02 16:00:00' },
  { id: 'LOG010', userId: 'U_UNKNOWN', userName: '未知用户', action: '登录尝试', module: '系统', detail: '从IP 45.33.32.99尝试使用无效密码登录管理员账户失败', ip: '45.33.32.99', userAgent: 'Python-requests/2.31', status: 'failure', createdAt: '2026-07-02 16:15:00' },
  { id: 'LOG011', userId: 'U_R003', userName: '孙立新', action: '资源上传', module: '课程管理', detail: '上传VR课程第5章新增参考资源"HTC Vive最佳实践指南"', ip: '192.168.1.55', userAgent: 'Chrome/126.0', status: 'success', createdAt: '2026-07-02 16:30:00' },
  { id: 'LOG012', userId: 'S001', userName: '张明远', action: '发布公告', module: '课题管理', detail: '在"数字长城文化遗产数字化保护研究"课题中发布"中期检查安排"公告', ip: '10.0.1.25', userAgent: 'Chrome/126.0', status: 'success', createdAt: '2026-07-02 17:00:00' },
  { id: 'LOG013', userId: 'U_ADMIN', userName: '系统管理员', action: '角色修改', module: '系统管理', detail: '调整"评审员"角色权限，新增成果管理查看权限', ip: '192.168.1.100', userAgent: 'Chrome/126.0', status: 'success', createdAt: '2026-07-01 18:00:00' },
  { id: 'LOG014', userId: 'S004', userName: '赵晓琳', action: '成员管理', module: '课题管理', detail: '邀请张蕊希加入"数字长城文化遗产数字化保护研究"课题', ip: '10.0.1.28', userAgent: 'Chrome/126.0', status: 'success', createdAt: '2026-07-01 19:00:00' },
  { id: 'LOG015', userId: 'U_R002', userName: '王建军', action: '发布课程', module: '课程管理', detail: '发布新课程"Houdini程序化特效制作"', ip: '192.168.1.52', userAgent: 'Edge/126.0', status: 'success', createdAt: '2026-07-01 20:00:00' },
]

export function mockAuditLogs(page = 1, pageSize = 10): PaginatedResponse<AuditLog> {
  const total = auditLogs.length
  const start = (page - 1) * pageSize
  const items = auditLogs.slice(start, start + pageSize)
  return { total, page, pageSize, items }
}
