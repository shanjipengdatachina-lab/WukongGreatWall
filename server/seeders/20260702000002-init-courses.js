'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('courses', [
      {
        id: 1,
        name: '数字长城技术培训基础课程',
        code: 'DC-001',
        description: '国家艺术基金数字长城技术培训基础课程，涵盖数字艺术、新媒体技术、文化遗产数字化等核心内容。',
        status: 'published',
        start_date: '2026-07-01',
        end_date: '2026-12-31',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: '数字艺术创作实践',
        code: 'DC-002',
        description: '数字艺术创作实践课程，包括数字绘画、3D建模、动画制作等实践内容。',
        status: 'published',
        start_date: '2026-07-15',
        end_date: '2026-11-30',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: '文化遗产数字化保护',
        code: 'DC-003',
        description: '文化遗产数字化保护技术课程，学习数字化采集、处理、存储和展示技术。',
        status: 'published',
        start_date: '2026-08-01',
        end_date: '2026-12-15',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

    await queryInterface.bulkInsert('course_chapters', [
      { id: 1, course_id: 1, title: '数字长城项目概述', order: 1 },
      { id: 2, course_id: 1, title: '数字艺术基础理论', order: 2 },
      { id: 3, course_id: 1, title: '新媒体技术导论', order: 3 },
      { id: 4, course_id: 2, title: '数字绘画基础', order: 1 },
      { id: 5, course_id: 2, title: '3D建模技术', order: 2 },
      { id: 6, course_id: 2, title: '动画制作实践', order: 3 },
      { id: 7, course_id: 3, title: '数字化采集技术', order: 1 },
      { id: 8, course_id: 3, title: '数据处理与存储', order: 2 },
      { id: 9, course_id: 3, title: '数字展示技术', order: 3 }
    ], {});

    await queryInterface.bulkInsert('assignments', [
      {
        id: 1,
        course_id: 1,
        chapter_id: 1,
        title: '项目调研报告',
        description: '调研数字长城项目背景、技术架构和发展前景，撰写不少于2000字的调研报告。',
        deadline: '2026-07-20',
        status: 'published',
        max_score: 100,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        course_id: 2,
        chapter_id: 4,
        title: '数字绘画练习',
        description: '完成一幅数字绘画作品，主题为长城意象，要求原创，分辨率不低于1920x1080。',
        deadline: '2026-07-25',
        status: 'published',
        max_score: 100,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        course_id: 3,
        chapter_id: 7,
        title: '数字化采集方案设计',
        description: '设计一份文化遗产数字化采集方案，包括采集设备、流程和数据处理方法。',
        deadline: '2026-08-10',
        status: 'published',
        max_score: 100,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('assignments', null, {});
    await queryInterface.bulkDelete('course_chapters', null, {});
    await queryInterface.bulkDelete('courses', null, {});
  }
};
