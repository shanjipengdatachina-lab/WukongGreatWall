'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_achievements', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      achievement_id: { type: Sequelize.INTEGER, allowNull: false },
      progress: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      target: { type: Sequelize.INTEGER, allowNull: false },
      unlocked: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      unlocked_at: Sequelize.DATE,
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    }, { charset: 'utf8mb4', collate: 'utf8mb4_general_ci' });
    await queryInterface.addConstraint('user_achievements', { fields: ['user_id'], type: 'foreign key', name: 'user_achievements_user_id_fk', references: { table: 'users', field: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    await queryInterface.addConstraint('user_achievements', { fields: ['achievement_id'], type: 'foreign key', name: 'user_achievements_achievement_id_fk', references: { table: 'achievements', field: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('user_achievements'); }
};
