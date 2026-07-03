import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface CourseAttributes {
  id: number;
  name: string;
  code: string;
  description?: string;
  cover_image?: string;
  status: 'draft' | 'published' | 'archived';
  start_date?: Date;
  end_date?: Date;
  created_by: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CourseCreationAttributes extends Optional<CourseAttributes, 'id'> {}

export class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  public id!: number;
  public name!: string;
  public code!: string;
  public description?: string;
  public cover_image?: string;
  public status!: 'draft' | 'published' | 'archived';
  public start_date?: Date;
  public end_date?: Date;
  public created_by!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Course.init(
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
      type: DataTypes.ENUM('draft', 'published', 'archived'),
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
    tableName: 'courses',
    modelName: 'Course'
  }
);
