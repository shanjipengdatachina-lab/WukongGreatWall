'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('topics', [
      {
        id: 1,
        name: '万里长城数字长卷创作',
        code: 'TOPIC-001',
        description: '国家艺术基金重点课题，创作数字长城长卷作品，融合传统艺术与数字技术。',
        status: 'active',
        start_date: '2026-07-01',
        end_date: '2026-12-31',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: '数字长城视觉设计',
        code: 'TOPIC-002',
        description: '数字长城项目视觉系统设计，包括品牌标识、界面设计、视觉规范等。',
        status: 'active',
        start_date: '2026-07-01',
        end_date: '2026-12-31',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: '文化遗产数字展示',
        code: 'TOPIC-003',
        description: '探索文化遗产数字化展示的新技术和新方法，开发互动展示系统。',
        status: 'active',
        start_date: '2026-07-15',
        end_date: '2026-12-31',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

    await queryInterface.bulkInsert('topic_members', [
      { topic_id: 1, user_id: 2, role: 'leader', status: 'accepted', joined_at: new Date() },
      { topic_id: 1, user_id: 3, role: 'member', status: 'accepted', joined_at: new Date() },
      { topic_id: 1, user_id: 4, role: 'member', status: 'accepted', joined_at: new Date() },
      { topic_id: 2, user_id: 5, role: 'leader', status: 'accepted', joined_at: new Date() },
      { topic_id: 2, user_id: 6, role: 'member', status: 'accepted', joined_at: new Date() },
      { topic_id: 2, user_id: 7, role: 'member', status: 'accepted', joined_at: new Date() },
      { topic_id: 3, user_id: 8, role: 'leader', status: 'accepted', joined_at: new Date() },
      { topic_id: 3, user_id: 9, role: 'member', status: 'accepted', joined_at: new Date() },
      { topic_id: 3, user_id: 10, role: 'member', status: 'accepted', joined_at: new Date() }
    ], {});

    await queryInterface.bulkInsert('topic_tasks', [
      {
        id: 1,
        topic_id: 1,
        title: '素材收集与整理',
        description: '收集长城相关的历史图片、文献资料和影像素材，建立素材库。',
        status: 'completed',
        priority: 'high',
        assignee_id: 2,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        topic_id: 1,
        title: '数字长卷分镜设计',
        description: '设计数字长卷的分镜和叙事结构，确定整体风格和色彩方案。',
        status: 'in_progress',
        priority: 'high',
        assignee_id: 3,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        topic_id: 2,
        title: '品牌标识设计',
        description: '设计数字长城项目的品牌标识和视觉系统基础元素。',
        status: 'completed',
        priority: 'high',
        assignee_id: 5,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        topic_id: 3,
        title: '互动展示技术调研',
        description: '调研当前文化遗产数字化展示的最新技术和案例。',
        status: 'in_progress',
        priority: 'medium',
        assignee_id: 8,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('topic_tasks', null, {});
    await queryInterface.bulkDelete('topic_members', null, {});
    await queryInterface.bulkDelete('topics', null, {});
  }
};
