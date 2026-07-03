'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('institutions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
        unique: true
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      type: {
        type: Sequelize.ENUM('university', 'college', 'institute', 'enterprise', 'other'),
        allowNull: false,
        defaultValue: 'university'
      },
      province: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      city: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      address: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      logo: {
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('institutions');
  }
};
