'use strict';
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('achievements', [
      { code: 'FIRST_STEP', name: '初入长城', description: '首次登录系统', category: '里程碑', xp_reward: 10, condition_type: 'first_login', condition_value: 1, sort_order: 1, created_at: new Date() },
      { code: 'FIRST_SUBMIT', name: '学以致用', description: '首次提交作业', category: '学习', xp_reward: 20, condition_type: 'submission_count', condition_value: 1, sort_order: 2, created_at: new Date() },
      { code: 'PERFECT_SCORE', name: '满分达人', description: '作业获得满分', category: '学习', xp_reward: 30, condition_type: 'total_xp', condition_value: 200, sort_order: 3, created_at: new Date() },
      { code: 'WEEK_STREAK', name: '周周不息', description: '连续学习7天', category: '学习', xp_reward: 50, condition_type: 'streak_days', condition_value: 7, sort_order: 4, created_at: new Date() },
      { code: 'MONTH_STREAK', name: '月月精进', description: '连续学习30天', category: '学习', xp_reward: 100, condition_type: 'streak_days', condition_value: 30, sort_order: 5, created_at: new Date() },
      { code: 'COLLABORATOR', name: '协作先锋', description: '参与3个课题', category: '协作', xp_reward: 30, condition_type: 'topic_count', condition_value: 3, sort_order: 6, created_at: new Date() },
      { code: 'CREATOR_5', name: '创作新星', description: '上传5件作品', category: '创作', xp_reward: 30, condition_type: 'file_count', condition_value: 5, sort_order: 7, created_at: new Date() },
      { code: 'CREATOR_10', name: '创作达人', description: '上传10件作品', category: '创作', xp_reward: 50, condition_type: 'file_count', condition_value: 10, sort_order: 8, created_at: new Date() },
      { code: 'HELPER', name: '乐于助人', description: '发出20条批注反馈', category: '协作', xp_reward: 40, condition_type: 'total_xp', condition_value: 500, sort_order: 9, created_at: new Date() },
      { code: 'GRADUATE', name: '顺利结业', description: '完成全部必修课程', category: '里程碑', xp_reward: 100, condition_type: 'total_xp', condition_value: 7500, sort_order: 10, created_at: new Date() }
    ], {});

    const studentIds = [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
    for (const userId of studentIds) {
      const xp = Math.floor(Math.random() * 800) + 50;
      const level = xp >= 350 ? 4 : xp >= 150 ? 3 : xp >= 50 ? 2 : 1;
      const titles = ['学童','学子','学正','学士'];
      await queryInterface.bulkInsert('game_xp', [{
        user_id: userId, total_xp: xp, level, level_title: titles[level-1],
        streak_days: Math.floor(Math.random() * 10) + 1,
        longest_streak: Math.floor(Math.random() * 12) + 3,
        last_active_date: new Date().toISOString().split('T')[0],
        last_checkin_date: new Date().toISOString().split('T')[0],
        created_at: new Date(), updated_at: new Date()
      }], {});

      await queryInterface.bulkInsert('game_xp_logs', [
        { user_id: userId, action: 'daily_checkin', xp: 5, description: '每日签到', created_at: new Date() },
        { user_id: userId, action: 'chapter_complete', xp: 10, description: '完成课程章节学习', reference_type: 'chapter', reference_id: 1, created_at: new Date(Date.now() - 86400000) },
        { user_id: userId, action: 'submit_assignment', xp: 20, description: '提交作业', reference_type: 'assignment', reference_id: 1, created_at: new Date(Date.now() - 172800000) },
      ], {});
    }

    const achIds = [1,2,3,4,5,6,7,8,9,10];
    for (const userId of studentIds) {
      for (const achId of achIds) {
        const unlocked = achId <= 2 || (achId === 4 && userId % 3 === 0);
        await queryInterface.bulkInsert('user_achievements', [{
          user_id: userId, achievement_id: achId,
          progress: unlocked ? 1 : 0, target: achId <= 4 ? 1 : achId * 2,
          unlocked, unlocked_at: unlocked ? new Date() : null,
          created_at: new Date(), updated_at: new Date()
        }], {});
      }
    }
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('user_achievements', null, {});
    await queryInterface.bulkDelete('game_xp_logs', null, {});
    await queryInterface.bulkDelete('game_xp', null, {});
    await queryInterface.bulkDelete('achievements', null, {});
  }
};
