import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface AchievementAttributes {
  id: number;
  code: string;
  name: string;
  description: string;
  icon?: string;
  category: '学习' | '创作' | '协作' | '里程碑';
  xp_reward: number;
  condition_type: string;
  condition_value: number;
  sort_order: number;
  created_at?: Date;
}

export interface AchievementCreationAttributes extends Optional<AchievementAttributes, 'id'> {}

export class Achievement extends Model<AchievementAttributes, AchievementCreationAttributes> implements AchievementAttributes {
  public id!: number;
  public code!: string;
  public name!: string;
  public description!: string;
  public icon?: string;
  public category!: '学习' | '创作' | '协作' | '里程碑';
  public xp_reward!: number;
  public condition_type!: string;
  public condition_value!: number;
  public sort_order!: number;
  public readonly created_at!: Date;
}

Achievement.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    description: { type: DataTypes.STRING(255), allowNull: false },
    icon: { type: DataTypes.STRING(500), allowNull: true },
    category: { type: DataTypes.ENUM('学习', '创作', '协作', '里程碑'), allowNull: false, defaultValue: '学习' },
    xp_reward: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    condition_type: { type: DataTypes.STRING(50), allowNull: false },
    condition_value: { type: DataTypes.INTEGER, allowNull: false },
    sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
  },
  { sequelize, tableName: 'achievements', modelName: 'Achievement', timestamps: true, createdAt: 'created_at', updatedAt: false }
);
