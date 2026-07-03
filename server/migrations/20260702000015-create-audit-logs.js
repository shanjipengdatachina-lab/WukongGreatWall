'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('audit_logs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      action: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      resource_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      resource_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      details: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      ip_address: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci'
    });

    await queryInterface.addConstraint('audit_logs', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'audit_logs_user_id_fk',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('audit_logs');
  }
};
