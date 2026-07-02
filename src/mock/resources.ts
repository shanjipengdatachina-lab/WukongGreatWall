import type { Resource, PaginatedResponse } from './types'

const resources: Resource[] = [
  { id: 'R001', title: 'UE5官方界面快速入门指南', type: 'document', module: 'course', moduleId: 'C001', moduleTitle: 'UE5基础入门与场景搭建', fileSize: '2.3MB', format: 'pdf', uploader: '刘建国', uploadTime: '2025-11-16 10:00:00', downloadCount: 156, url: '' },
  { id: 'R002', title: '长城城墙材质球示例工程', type: 'project', module: 'course', moduleId: 'C001', moduleTitle: 'UE5基础入门与场景搭建', fileSize: '156MB', format: 'zip', uploader: '刘建国', uploadTime: '2025-11-20 14:30:00', downloadCount: 203, url: '' },
  { id: 'R003', title: 'Lumen光照场景演示文件', type: 'project', module: 'course', moduleId: 'C001', moduleTitle: 'UE5基础入门与场景搭建', fileSize: '320MB', format: 'zip', uploader: '刘建国', uploadTime: '2025-11-25 09:00:00', downloadCount: 178, url: '' },
  { id: 'R004', title: 'Houdini节点速查表', type: 'document', module: 'course', moduleId: 'C002', moduleTitle: 'Houdini程序化特效制作', fileSize: '1.8MB', format: 'pdf', uploader: '王建军', uploadTime: '2025-12-02 11:00:00', downloadCount: 134, url: '' },
  { id: 'R005', title: '长城烽火台程序化生成工程', type: 'project', module: 'course', moduleId: 'C002', moduleTitle: 'Houdini程序化特效制作', fileSize: '45MB', format: 'zip', uploader: '王建军', uploadTime: '2025-12-08 15:00:00', downloadCount: 167, url: '' },
  { id: 'R006', title: '数字人文经典论文选读', type: 'document', module: 'course', moduleId: 'C003', moduleTitle: '数字人文研究方法与实践', fileSize: '5.6MB', format: 'pdf', uploader: '张雅文', uploadTime: '2026-01-12 10:30:00', downloadCount: 98, url: '' },
  { id: 'R007', title: '长城数据可视化看板源码', type: 'project', module: 'course', moduleId: 'C004', moduleTitle: '数据可视化与交互设计', fileSize: '12MB', format: 'zip', uploader: '陈明华', uploadTime: '2026-02-25 14:00:00', downloadCount: 145, url: '' },
  { id: 'R008', title: '长城砖石参考图集（高清）', type: 'image', module: 'course', moduleId: 'C005', moduleTitle: 'Blender三维建模与渲染', fileSize: '48MB', format: 'zip', uploader: '赵永刚', uploadTime: '2026-03-10 09:30:00', downloadCount: 112, url: '' },
  { id: 'R009', title: '城楼模型源文件（Blender）', type: 'model', module: 'course', moduleId: 'C005', moduleTitle: 'Blender三维建模与渲染', fileSize: '267MB', format: 'blend', uploader: '赵永刚', uploadTime: '2026-03-20 16:00:00', downloadCount: 189, url: '' },
  { id: 'R010', title: 'VR项目模板工程', type: 'project', module: 'course', moduleId: 'C006', moduleTitle: '虚拟现实技术与应用', fileSize: '450MB', format: 'zip', uploader: '孙立新', uploadTime: '2026-03-22 10:00:00', downloadCount: 95, url: '' },
  { id: 'R011', title: '长城城墙材质作业（张明远）', type: 'project', module: 'assignment', moduleId: 'A001', moduleTitle: '长城城墙材质制作', fileSize: '45MB', format: 'zip', uploader: '张明远', uploadTime: '2026-07-02 10:30:00', downloadCount: 3, url: '' },
  { id: 'R012', title: '长城文献分析报告终稿', type: 'document', module: 'assignment', moduleId: 'A004', moduleTitle: '长城文献文本分析', fileSize: '8MB', format: 'pdf', uploader: '周雨晴', uploadTime: '2026-06-25 15:30:00', downloadCount: 8, url: '' },
  { id: 'R013', title: '八达岭三维扫描点云LOD版', type: 'model', module: 'topic', moduleId: 'T001', moduleTitle: '数字长城文化遗产数字化保护研究', fileSize: '980MB', format: 'ply', uploader: '张明远', uploadTime: '2026-05-20 08:00:00', downloadCount: 45, url: '' },
  { id: 'R014', title: '虚拟修复算法实验代码', type: 'project', module: 'topic', moduleId: 'T001', moduleTitle: '数字长城文化遗产数字化保护研究', fileSize: '85MB', format: 'zip', uploader: '刘美琪', uploadTime: '2026-06-15 10:00:00', downloadCount: 23, url: '' },
  { id: 'R015', title: 'UE5场景渲染参数配置', type: 'document', module: 'topic', moduleId: 'T002', moduleTitle: 'UE5在文化遗产可视化中的应用', fileSize: '3.5MB', format: 'pdf', uploader: '冯建平', uploadTime: '2026-06-20 14:30:00', downloadCount: 31, url: '' },
  { id: 'R016', title: '长城文化数据接口文档', type: 'document', module: 'topic', moduleId: 'T005', moduleTitle: '长城文化数据可视化平台设计', fileSize: '2.8MB', format: 'pdf', uploader: '褚明辉', uploadTime: '2026-06-15 11:00:00', downloadCount: 18, url: '' },
  { id: 'R017', title: '居庸关摄影测量原始照片', type: 'image', module: 'topic', moduleId: 'T006', moduleTitle: '长城建筑结构三维重建技术研究', fileSize: '1.5GB', format: 'zip', uploader: '孙文博', uploadTime: '2026-06-10 16:00:00', downloadCount: 27, url: '' },
  { id: 'R018', title: 'VR体验设计文档终稿', type: 'document', module: 'outcome', moduleId: 'OUT008', moduleTitle: 'VR体验设计文档', fileSize: '22MB', format: 'pdf', uploader: '吴天宇', uploadTime: '2026-06-30 15:00:00', downloadCount: 12, url: '' },
  { id: 'R019', title: '长城文献语料库（清洗版）', type: 'other', module: 'topic', moduleId: 'T003', moduleTitle: 'AI辅助数字人文研究', fileSize: '320MB', format: 'zip', uploader: '周雨晴', uploadTime: '2026-05-10 09:00:00', downloadCount: 34, url: '' },
  { id: 'R020', title: '数字化保护宣传片分镜脚本', type: 'document', module: 'topic', moduleId: 'T001', moduleTitle: '数字长城文化遗产数字化保护研究', fileSize: '4.2MB', format: 'pdf', uploader: '刘美琪', uploadTime: '2026-06-28 14:00:00', downloadCount: 15, url: '' },
]

export function mockResources(page = 1, pageSize = 10, filters?: { type?: string; module?: string }): PaginatedResponse<Resource> {
  let filtered = [...resources]
  if (filters?.type) {
    filtered = filtered.filter(r => r.type === filters.type)
  }
  if (filters?.module) {
    filtered = filtered.filter(r => r.module === filters.module)
  }
  const total = filtered.length
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)
  return { total, page, pageSize, items }
}
