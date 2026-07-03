import { Sequelize } from 'sequelize';
import { config } from './index';

export const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
      timezone: '+08:00'
    },
    define: {
      timestamps: true,
      underscored: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci'
    },
    logging: config.env === 'development' ? console.log : false
  }
);
