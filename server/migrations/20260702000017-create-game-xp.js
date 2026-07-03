'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('game_xp', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false, unique: true },
      total_xp: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      level: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      level_title: { type: Sequelize.STRING(20), allowNull: false, defaultValue: '学童' },
      streak_days: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      longest_streak: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      last_active_date: Sequelize.DATEONLY,
      last_checkin_date: Sequelize.DATEONLY,
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    }, { charset: 'utf8mb4', collate: 'utf8mb4_general_ci' });
    await queryInterface.addConstraint('game_xp', { fields: ['user_id'], type: 'foreign key', name: 'game_xp_user_id_fk', references: { table: 'users', field: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('game_xp'); }
};
