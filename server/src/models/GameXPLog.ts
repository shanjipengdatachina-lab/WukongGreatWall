import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface GameXPLogAttributes {
  id: number;
  user_id: number;
  action: string;
  xp: number;
  description: string;
  reference_type?: string;
  reference_id?: number;
  created_at?: Date;
}

export interface GameXPLogCreationAttributes extends Optional<GameXPLogAttributes, 'id'> {}

export class GameXPLog extends Model<GameXPLogAttributes, GameXPLogCreationAttributes> implements GameXPLogAttributes {
  public id!: number;
  public user_id!: number;
  public action!: string;
  public xp!: number;
  public description!: string;
  public reference_type?: string;
  public reference_id?: number;
  public readonly created_at!: Date;
}

GameXPLog.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.STRING(50), allowNull: false },
    xp: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.STRING(255), allowNull: false },
    reference_type: { type: DataTypes.STRING(50), allowNull: true },
    reference_id: { type: DataTypes.INTEGER, allowNull: true }
  },
  { sequelize, tableName: 'game_xp_logs', modelName: 'GameXPLog', timestamps: true, createdAt: 'created_at', updatedAt: false }
);
