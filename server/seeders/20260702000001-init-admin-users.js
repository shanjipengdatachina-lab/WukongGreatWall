'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminPassword = await bcrypt.hash('admin@2026', 10);
    
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        username: 'admin',
        email: 'admin@wukong.com',
        password: adminPassword,
        role: 'admin',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

    await queryInterface.bulkInsert('institutions', [
      { id: 1, name: '唐山工业职业技术大学', type: 'university', province: '河北', city: '唐山' },
      { id: 2, name: '自由创作人', type: 'other', province: '-', city: '-' },
      { id: 3, name: '泉州海洋职业学院', type: 'college', province: '福建', city: '泉州' },
      { id: 4, name: '河北工艺美术职业学院', type: 'college', province: '河北', city: '保定' },
      { id: 5, name: '华北理工大学', type: 'university', province: '河北', city: '唐山' },
      { id: 6, name: '河北工业大学', type: 'university', province: '天津', city: '天津' },
      { id: 7, name: '河北经贸大学', type: 'university', province: '河北', city: '石家庄' },
      { id: 8, name: '沧州师范学院', type: 'college', province: '河北', city: '沧州' },
      { id: 9, name: '榆林大学艺术学院', type: 'college', province: '陕西', city: '榆林' },
      { id: 10, name: '唐山师范学院美术学院', type: 'college', province: '河北', city: '唐山' },
      { id: 11, name: '河北农业大学艺术学院', type: 'college', province: '河北', city: '保定' },
      { id: 12, name: '河北建材职业技术学院', type: 'college', province: '河北', city: '秦皇岛' },
      { id: 13, name: '四川旅游学院', type: 'university', province: '四川', city: '成都' },
      { id: 14, name: '自由插画师', type: 'other', province: '-', city: '-' },
      { id: 15, name: '华北理工大学艺术学院', type: 'college', province: '河北', city: '唐山' },
      { id: 16, name: '河北科技大学艺术学院', type: 'college', province: '河北', city: '石家庄' },
      { id: 17, name: '河北美术学院', type: 'university', province: '河北', city: '石家庄' },
      { id: 18, name: '河南工学院', type: 'university', province: '河南', city: '新乡' },
      { id: 19, name: '河北东方学院文物艺术学院', type: 'college', province: '河北', city: '廊坊' },
      { id: 20, name: '鲁迅美术学院', type: 'university', province: '辽宁', city: '沈阳' },
      { id: 21, name: '内蒙古艺术学院', type: 'university', province: '内蒙古', city: '呼和浩特' },
      { id: 22, name: '河北大学', type: 'university', province: '河北', city: '保定' },
      { id: 23, name: '兰州文理学院', type: 'university', province: '甘肃', city: '兰州' },
      { id: 24, name: '北华航天工业学院', type: 'university', province: '河北', city: '廊坊' }
    ], {});

    const studentPassword = await bcrypt.hash('student@123', 10);
    
    const students = [
      { student_id: '001', real_name: '艾静蕊', institution_id: 1 },
      { student_id: '002', real_name: '陈非凡', institution_id: 2 },
      { student_id: '003', real_name: '陈宇阳', institution_id: 3 },
      { student_id: '004', real_name: '董云峰', institution_id: 4 },
      { student_id: '005', real_name: '冯舒', institution_id: 5 },
      { student_id: '006', real_name: '冯一凡', institution_id: 6 },
      { student_id: '007', real_name: '韩朝阳', institution_id: 7 },
      { student_id: '008', real_name: '韩序', institution_id: 8 },
      { student_id: '009', real_name: '贺甜甜', institution_id: 9 },
      { student_id: '010', real_name: '李慧', institution_id: 10 },
      { student_id: '011', real_name: '李岩', institution_id: 8 },
      { student_id: '012', real_name: '刘晖', institution_id: 11 },
      { student_id: '013', real_name: '刘金得', institution_id: 12 },
      { student_id: '014', real_name: '刘琼春', institution_id: 13 },
      { student_id: '015', real_name: '刘雅楠', institution_id: 14 },
      { student_id: '016', real_name: '裴琳', institution_id: 15 },
      { student_id: '017', real_name: '彭东航', institution_id: 16 },
      { student_id: '018', real_name: '石鑫', institution_id: 17 },
      { student_id: '019', real_name: '孙意为', institution_id: 6 },
      { student_id: '020', real_name: '王烁', institution_id: 1 },
      { student_id: '021', real_name: '王思锴', institution_id: 18 },
      { student_id: '022', real_name: '王希希', institution_id: 19 },
      { student_id: '023', real_name: '王潇潇', institution_id: 20 },
      { student_id: '024', real_name: '王紫琦', institution_id: 21 },
      { student_id: '025', real_name: '魏巍', institution_id: 22 },
      { student_id: '026', real_name: '魏笑然', institution_id: 5 },
      { student_id: '027', real_name: '张金歌', institution_id: 23 },
      { student_id: '028', real_name: '张强', institution_id: 24 },
      { student_id: '029', real_name: '张雅楠', institution_id: 4 }
    ];

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const user = await queryInterface.bulkInsert('users', [{
        id: i + 2,
        username: `student${student.student_id}`,
        email: `student${student.student_id}@wukong.com`,
        password: studentPassword,
        role: 'student',
        status: 'active',
        scholar_id: `SCHOLAR-${student.student_id}`,
        created_at: new Date(),
        updated_at: new Date()
      }], { returning: true });

      await queryInterface.bulkInsert('profiles', [{
        id: i + 1,
        user_id: i + 2,
        real_name: student.real_name,
        student_id: student.student_id,
        institution_id: student.institution_id,
        avatar: `/uploads/avatars/${student.student_id}.jpg`,
        visible_fields: JSON.stringify(['real_name', 'institution', 'avatar']),
        created_at: new Date(),
        updated_at: new Date()
      }], {});

      await queryInterface.bulkUpdate('users', { profile_id: i + 1 }, { id: i + 2 });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('profiles', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('institutions', null, {});
  }
};
