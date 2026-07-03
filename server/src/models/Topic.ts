import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface TopicAttributes {
  id: number;
  name: string;
  code: string;
  description?: string;
  cover_image?: string;
  status: 'draft' | 'active' | 'completed';
  start_date?: Date;
  end_date?: Date;
  created_by: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface TopicCreationAttributes extends Optional<TopicAttributes, 'id'> {}

export class Topic extends Model<TopicAttributes, TopicCreationAttributes> implements TopicAttributes {
  public id!: number;
  public name!: string;
  public code!: string;
  public description?: string;
  public cover_image?: string;
  public status!: 'draft' | 'active' | 'completed';
  public start_date?: Date;
  public end_date?: Date;
  public created_by!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Topic.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cover_image: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'active', 'completed'),
      allowNull: false,
      defaultValue: 'draft'
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'topics',
    modelName: 'Topic'
  }
);
