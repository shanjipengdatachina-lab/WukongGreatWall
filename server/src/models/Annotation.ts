import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface AnnotationAttributes {
  id: number;
  submission_id: number;
  user_id: number;
  content: string;
  x?: number;
  y?: number;
  page?: number;
  status: 'draft' | 'published';
  created_at?: Date;
  updated_at?: Date;
}

export interface AnnotationCreationAttributes extends Optional<AnnotationAttributes, 'id'> {}

export class Annotation extends Model<AnnotationAttributes, AnnotationCreationAttributes> implements AnnotationAttributes {
  public id!: number;
  public submission_id!: number;
  public user_id!: number;
  public content!: string;
  public x?: number;
  public y?: number;
  public page?: number;
  public status!: 'draft' | 'published';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Annotation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    submission_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    x: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    y: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    page: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'published'),
      allowNull: false,
      defaultValue: 'published'
    }
  },
  {
    sequelize,
    tableName: 'annotations',
    modelName: 'Annotation'
  }
);
