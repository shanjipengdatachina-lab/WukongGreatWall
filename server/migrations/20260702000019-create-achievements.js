'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('achievements', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      code: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      name: { type: Sequelize.STRING(50), allowNull: false },
      description: { type: Sequelize.STRING(255), allowNull: false },
      icon: Sequelize.STRING(500),
      category: { type: Sequelize.ENUM('学习', '创作', '协作', '里程碑'), allowNull: false, defaultValue: '学习' },
      xp_reward: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      condition_type: { type: Sequelize.STRING(50), allowNull: false },
      condition_value: { type: Sequelize.INTEGER, allowNull: false },
      sort_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    }, { charset: 'utf8mb4', collate: 'utf8mb4_general_ci' });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('achievements'); }
};
