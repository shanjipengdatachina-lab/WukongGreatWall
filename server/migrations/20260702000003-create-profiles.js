'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profiles', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      real_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      student_id: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      institution_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      avatar: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      research_direction: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      visible_fields: {
        type: Sequelize.TEXT,
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

    await queryInterface.addConstraint('profiles', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'profiles_user_id_fk',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('profiles', {
      fields: ['institution_id'],
      type: 'foreign key',
      name: 'profiles_institution_id_fk',
      references: {
        table: 'institutions',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('profiles');
  }
};
