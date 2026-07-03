'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ted_profiles', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false, unique: true },
      display_name: { type: Sequelize.STRING(50), allowNull: false },
      title: Sequelize.STRING(100),
      cover_image: Sequelize.STRING(500),
      location: Sequelize.STRING(100),
      bio_full: Sequelize.TEXT,
      research_fields: Sequelize.TEXT,
      keywords: Sequelize.TEXT,
      social_links: Sequelize.TEXT,
      education: Sequelize.TEXT,
      achievements: Sequelize.TEXT,
      featured_works: Sequelize.TEXT,
      course_progress: Sequelize.TEXT,
      visible_fields: { type: Sequelize.TEXT, allowNull: false },
      status: { type: Sequelize.ENUM('draft', 'published', 'archived'), allowNull: false, defaultValue: 'draft' },
      published_at: Sequelize.DATE,
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    }, { charset: 'utf8mb4', collate: 'utf8mb4_general_ci' });
    await queryInterface.addConstraint('ted_profiles', { fields: ['user_id'], type: 'foreign key', name: 'ted_profiles_user_id_fk', references: { table: 'users', field: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('ted_profiles'); }
};
