'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('annotations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      submission_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      x: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      y: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      page: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('draft', 'published'),
        allowNull: false,
        defaultValue: 'published'
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

    await queryInterface.addConstraint('annotations', {
      fields: ['submission_id'],
      type: 'foreign key',
      name: 'annotations_submission_id_fk',
      references: {
        table: 'submissions',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('annotations', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'annotations_user_id_fk',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('annotations');
  }
};
