'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('submissions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      assignment_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      version: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      status: {
        type: Sequelize.ENUM('draft', 'submitted', 'reviewed', 'revised'),
        allowNull: false,
        defaultValue: 'draft'
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      reviewed_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      reviewed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci'
    });

    await queryInterface.addConstraint('submissions', {
      fields: ['assignment_id'],
      type: 'foreign key',
      name: 'submissions_assignment_id_fk',
      references: {
        table: 'assignments',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('submissions', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'submissions_user_id_fk',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('submissions', {
      fields: ['reviewed_by'],
      type: 'foreign key',
      name: 'submissions_reviewed_by_fk',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('submissions');
  }
};
