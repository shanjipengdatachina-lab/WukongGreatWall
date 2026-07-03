import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface UserAchievementAttributes {
  id: number;
  user_id: number;
  achievement_id: number;
  progress: number;
  target: number;
  unlocked: boolean;
  unlocked_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserAchievementCreationAttributes extends Optional<UserAchievementAttributes, 'id'> {}

export class UserAchievement extends Model<UserAchievementAttributes, UserAchievementCreationAttributes> implements UserAchievementAttributes {
  public id!: number;
  public user_id!: number;
  public achievement_id!: number;
  public progress!: number;
  public target!: number;
  public unlocked!: boolean;
  public unlocked_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

UserAchievement.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    achievement_id: { type: DataTypes.INTEGER, allowNull: false },
    progress: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    target: { type: DataTypes.INTEGER, allowNull: false },
    unlocked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    unlocked_at: { type: DataTypes.DATE, allowNull: true }
  },
  { sequelize, tableName: 'user_achievements', modelName: 'UserAchievement' }
);
