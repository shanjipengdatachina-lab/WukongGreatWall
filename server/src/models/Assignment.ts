import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface AssignmentAttributes {
  id: number;
  course_id: number;
  chapter_id?: number;
  title: string;
  description?: string;
  deadline?: Date;
  status: 'draft' | 'published' | 'closed';
  max_score?: number;
  created_by: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface AssignmentCreationAttributes extends Optional<AssignmentAttributes, 'id'> {}

export class Assignment extends Model<AssignmentAttributes, AssignmentCreationAttributes> implements AssignmentAttributes {
  public id!: number;
  public course_id!: number;
  public chapter_id?: number;
  public title!: string;
  public description?: string;
  public deadline?: Date;
  public status!: 'draft' | 'published' | 'closed';
  public max_score?: number;
  public created_by!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Assignment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chapter_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'closed'),
      allowNull: false,
      defaultValue: 'draft'
    },
    max_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 100
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'assignments',
    modelName: 'Assignment'
  }
);
