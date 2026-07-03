import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

export const config = {
  port: Number(process.env.PORT) || 3001,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    name: process.env.DB_NAME || 'wukong_great_wall',
    user: process.env.DB_USER || 'wukong_user',
    password: process.env.DB_PASSWORD || 'wukong@2026'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'wukong_great_wall_jwt_secret_key_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  upload: {
    dir: process.env.UPLOAD_DIR || 'uploads',
    maxSize: Number(process.env.MAX_FILE_SIZE) || 52428800
  },
  env: process.env.NODE_ENV || 'development'
};
