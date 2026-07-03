import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface TopicTaskAttributes {
  id: number;
  topic_id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'reviewing';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id?: number;
  deadline?: Date;
  created_by: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface TopicTaskCreationAttributes extends Optional<TopicTaskAttributes, 'id'> {}

export class TopicTask extends Model<TopicTaskAttributes, TopicTaskCreationAttributes> implements TopicTaskAttributes {
  public id!: number;
  public topic_id!: number;
  public title!: string;
  public description?: string;
  public status!: 'pending' | 'in_progress' | 'completed' | 'reviewing';
  public priority!: 'low' | 'medium' | 'high' | 'urgent';
  public assignee_id?: number;
  public deadline?: Date;
  public created_by!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

TopicTask.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    topic_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'reviewing'),
      allowNull: false,
      defaultValue: 'pending'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium'
    },
    assignee_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    deadline: {
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
    tableName: 'topic_tasks',
    modelName: 'TopicTask'
  }
);
