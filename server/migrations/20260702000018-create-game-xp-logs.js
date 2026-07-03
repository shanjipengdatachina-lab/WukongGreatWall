'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('game_xp_logs', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      action: { type: Sequelize.STRING(50), allowNull: false },
      xp: { type: Sequelize.INTEGER, allowNull: false },
      description: { type: Sequelize.STRING(255), allowNull: false },
      reference_type: Sequelize.STRING(50),
      reference_id: Sequelize.INTEGER,
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    }, { charset: 'utf8mb4', collate: 'utf8mb4_general_ci' });
    await queryInterface.addConstraint('game_xp_logs', { fields: ['user_id'], type: 'foreign key', name: 'game_xp_logs_user_id_fk', references: { table: 'users', field: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('game_xp_logs'); }
};
