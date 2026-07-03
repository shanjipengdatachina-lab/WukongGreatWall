'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('assignments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      course_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      chapter_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      deadline: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('draft', 'published', 'closed'),
        allowNull: false,
        defaultValue: 'draft'
      },
      max_score: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 100
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false
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

    await queryInterface.addConstraint('assignments', {
      fields: ['course_id'],
      type: 'foreign key',
      name: 'assignments_course_id_fk',
      references: {
        table: 'courses',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('assignments', {
      fields: ['chapter_id'],
      type: 'foreign key',
      name: 'assignments_chapter_id_fk',
      references: {
        table: 'course_chapters',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('assignments', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'assignments_created_by_fk',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('assignments');
  }
};
