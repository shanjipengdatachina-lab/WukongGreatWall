'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('files', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      original_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      path: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      size: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      mime_type: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      file_type: {
        type: Sequelize.ENUM('avatar', 'course', 'assignment', 'submission', 'topic', 'other'),
        allowNull: false,
        defaultValue: 'other'
      },
      reference_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      uploaded_by: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      storage_type: {
        type: Sequelize.ENUM('local', 'oss', 'cos', 'minio'),
        allowNull: false,
        defaultValue: 'local'
      },
      oss_path: {
        type: Sequelize.STRING(500),
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

    await queryInterface.addConstraint('files', {
      fields: ['uploaded_by'],
      type: 'foreign key',
      name: 'files_uploaded_by_fk',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('files');
  }
};
