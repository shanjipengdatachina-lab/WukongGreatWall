import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface GameXPAttributes {
  id: number;
  user_id: number;
  total_xp: number;
  level: number;
  level_title: string;
  streak_days: number;
  longest_streak: number;
  last_active_date?: string;
  last_checkin_date?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface GameXPCreationAttributes extends Optional<GameXPAttributes, 'id'> {}

export class GameXP extends Model<GameXPAttributes, GameXPCreationAttributes> implements GameXPAttributes {
  public id!: number;
  public user_id!: number;
  public total_xp!: number;
  public level!: number;
  public level_title!: string;
  public streak_days!: number;
  public longest_streak!: number;
  public last_active_date?: string;
  public last_checkin_date?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

GameXP.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    total_xp: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    level: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    level_title: { type: DataTypes.STRING(20), allowNull: false, defaultValue: '学童' },
    streak_days: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    longest_streak: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    last_active_date: { type: DataTypes.DATEONLY, allowNull: true },
    last_checkin_date: { type: DataTypes.DATEONLY, allowNull: true }
  },
  { sequelize, tableName: 'game_xp', modelName: 'GameXP' }
);

export const LEVEL_TITLES = ['学童', '学子', '学正', '学士', '硕士', '博士', '学者', '专家', '大师', '宗师'];
export const LEVEL_XP = [0, 50, 150, 350, 700, 1200, 2000, 3200, 5000, 7500];

export function calcLevel(totalXp: number): { level: number; title: string } {
  let level = 1;
  for (let i = LEVEL_XP.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_XP[i]) { level = i + 1; break; }
  }
  return { level, title: LEVEL_TITLES[level - 1] || '学童' };
}
