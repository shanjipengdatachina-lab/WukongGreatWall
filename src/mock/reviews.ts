import type { SubmissionDetail } from './types'

const submissionDetails: Record<string, SubmissionDetail> = {
  SUB001: {
    id: 'SUB001',
    assignmentId: 'A001',
    studentId: 'S001',
    studentName: '张明远',
    scholarId: 'S2026-0001',
    university: '唐山工业职业技术大学',
    status: 'reviewed',
    score: 88,
    submitTime: '2026-07-02 10:30:00',
    reviewTime: '2026-07-02 14:00:00',
    assignmentTitle: '长城城墙材质制作',
    courseTitle: 'UE5基础入门与场景搭建',
    files: [
      { id: 'F001', fileName: '长城城墙材质.uasset', fileSize: '45MB', fileType: 'uasset', url: '' },
      { id: 'F001B', fileName: '材质制作说明.pdf', fileSize: '2MB', fileType: 'pdf', url: '' },
    ],
    versions: [
      { id: 'V001', version: 1, fileName: '城墙材质_v1.uasset', fileSize: '38MB', submitTime: '2026-07-01 20:00:00', url: '' },
      { id: 'V002', version: 2, fileName: '城墙材质_v2.uasset', fileSize: '42MB', submitTime: '2026-07-02 09:00:00', url: '' },
      { id: 'V003', version: 3, fileName: '长城城墙材质.uasset', fileSize: '45MB', submitTime: '2026-07-02 10:30:00', url: '' },
    ],
    annotations: [
      { id: 'AN001', page: 1, x: 120, y: 250, content: '此处砖石纹理的粗糙度参数建议适当提高，增强年代感', author: '刘建国', createdAt: '2026-07-02 13:00:00' },
      { id: 'AN002', page: 2, x: 80, y: 180, content: '苔藓覆盖层的混合效果很好，可以适当增加随机性', author: '刘建国', createdAt: '2026-07-02 13:15:00' },
      { id: 'AN003', page: 3, x: 200, y: 300, content: '风化效果表现到位，但颜色过渡可以更自然', author: '刘建国', createdAt: '2026-07-02 13:30:00' },
    ],
    comments: [
      { id: 'CM001', author: '刘建国', avatar: '', content: '整体材质效果不错，砖石的质感和风化的处理都很有水平。需要优化的是砖缝处的阴影层次。', createdAt: '2026-07-02 14:00:00' },
      { id: 'CM002', author: '张明远', avatar: '', content: '谢谢老师指导！我会根据标注意见调整砖缝阴影和粗糙度参数。', createdAt: '2026-07-02 14:30:00' },
      { id: 'CM003', author: '刘建国', avatar: '', content: '修改后可以在下周四之前重新提交，我会再次审核。', createdAt: '2026-07-02 15:00:00' },
    ],
  },
  SUB005: {
    id: 'SUB005',
    assignmentId: 'A004',
    studentId: 'S008',
    studentName: '周雨晴',
    scholarId: 'S2026-0008',
    university: '河北大学',
    status: 'reviewed',
    score: 95,
    submitTime: '2026-06-25 15:30:00',
    reviewTime: '2026-06-28 10:00:00',
    assignmentTitle: '长城文献文本分析',
    courseTitle: '数字人文研究方法与实践',
    files: [
      { id: 'F006', fileName: '长城文献分析报告.pdf', fileSize: '8MB', fileType: 'pdf', url: '' },
      { id: 'F007', fileName: '文本分析代码.ipynb', fileSize: '2MB', fileType: 'ipynb', url: '' },
      { id: 'F007B', fileName: '分析数据集.csv', fileSize: '1MB', fileType: 'csv', url: '' },
    ],
    versions: [
      { id: 'V010', version: 1, fileName: '文献分析报告_v1.pdf', fileSize: '6MB', submitTime: '2026-06-22 18:00:00', url: '' },
      { id: 'V011', version: 2, fileName: '长城文献分析报告.pdf', fileSize: '8MB', submitTime: '2026-06-25 15:30:00', url: '' },
    ],
    annotations: [
      { id: 'AN010', page: 5, x: 150, y: 200, content: '词频分析结果很有说服力，建议补充TF-IDF权重分析', author: '张雅文', createdAt: '2026-06-27 09:00:00' },
      { id: 'AN011', page: 12, x: 100, y: 350, content: '主题模型的数量选择建议增加困惑度计算来优化', author: '张雅文', createdAt: '2026-06-27 09:30:00' },
    ],
    comments: [
      { id: 'CM010', author: '张雅文', avatar: '', content: '非常出色的文献分析报告！数据收集全面，分析方法科学，可视化呈现美观。特别是对明代长城文献的时间序列分析很有深度。', createdAt: '2026-06-28 10:00:00' },
      { id: 'CM011', author: '周雨晴', avatar: '', content: '感谢张老师的肯定和宝贵意见！我会按照标注建议补充TF-IDF分析和困惑度优化。', createdAt: '2026-06-28 11:00:00' },
    ],
  },
  SUB003: {
    id: 'SUB003',
    assignmentId: 'A001',
    studentId: 'S006',
    studentName: '刘美琪',
    scholarId: 'S2026-0006',
    university: '鲁迅美术学院',
    status: 'reviewing',
    score: null,
    submitTime: '2026-07-02 08:45:00',
    reviewTime: null,
    assignmentTitle: '长城城墙材质制作',
    courseTitle: 'UE5基础入门与场景搭建',
    files: [
      { id: 'F003', fileName: '材质设计说明.pdf', fileSize: '3MB', fileType: 'pdf', url: '' },
      { id: 'F004', fileName: '材质球文件.zip', fileSize: '38MB', fileType: 'zip', url: '' },
    ],
    versions: [
      { id: 'V020', version: 1, fileName: '材质球文件.zip', fileSize: '38MB', submitTime: '2026-07-02 08:45:00', url: '' },
    ],
    annotations: [],
    comments: [
      { id: 'CM020', author: '刘美琪', avatar: '', content: '老师好，这是我完成的城墙材质制作作业，在设计上参考了八达岭长城的实际砖石纹理，加入了岁月侵蚀的痕迹表现。请审阅。', createdAt: '2026-07-02 08:50:00' },
    ],
  },
}

export function mockSubmission(id: string): SubmissionDetail | null {
  return submissionDetails[id] || null
}
