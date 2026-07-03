import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface CourseChapterAttributes {
  id: number;
  course_id: number;
  title: string;
  order: number;
  content?: string;
  video_url?: string;
  duration?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CourseChapterCreationAttributes extends Optional<CourseChapterAttributes, 'id'> {}

export class CourseChapter extends Model<CourseChapterAttributes, CourseChapterCreationAttributes> implements CourseChapterAttributes {
  public id!: number;
  public course_id!: number;
  public title!: string;
  public order!: number;
  public content?: string;
  public video_url?: string;
  public duration?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

CourseChapter.init(
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
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    video_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    duration: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'course_chapters',
    modelName: 'CourseChapter'
  }
);
