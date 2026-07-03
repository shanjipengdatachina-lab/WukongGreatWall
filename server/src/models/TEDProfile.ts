import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface TEDProfileAttributes {
  id: number;
  user_id: number;
  display_name: string;
  title?: string;
  cover_image?: string;
  location?: string;
  bio_full?: string;
  research_fields?: string;
  keywords?: string;
  social_links?: string;
  education?: string;
  achievements?: string;
  featured_works?: string;
  course_progress?: string;
  visible_fields: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface TEDProfileCreationAttributes extends Optional<TEDProfileAttributes, 'id'> {}

export class TEDProfile extends Model<TEDProfileAttributes, TEDProfileCreationAttributes> implements TEDProfileAttributes {
  public id!: number;
  public user_id!: number;
  public display_name!: string;
  public title?: string;
  public cover_image?: string;
  public location?: string;
  public bio_full?: string;
  public research_fields?: string;
  public keywords?: string;
  public social_links?: string;
  public education?: string;
  public achievements?: string;
  public featured_works?: string;
  public course_progress?: string;
  public visible_fields!: string;
  public status!: 'draft' | 'published' | 'archived';
  public published_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

TEDProfile.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    display_name: { type: DataTypes.STRING(50), allowNull: false },
    title: { type: DataTypes.STRING(100), allowNull: true },
    cover_image: { type: DataTypes.STRING(500), allowNull: true },
    location: { type: DataTypes.STRING(100), allowNull: true },
    bio_full: { type: DataTypes.TEXT, allowNull: true },
    research_fields: { type: DataTypes.TEXT, allowNull: true },
    keywords: { type: DataTypes.TEXT, allowNull: true },
    social_links: { type: DataTypes.TEXT, allowNull: true },
    education: { type: DataTypes.TEXT, allowNull: true },
    achievements: { type: DataTypes.TEXT, allowNull: true },
    featured_works: { type: DataTypes.TEXT, allowNull: true },
    course_progress: { type: DataTypes.TEXT, allowNull: true },
    visible_fields: { type: DataTypes.TEXT, allowNull: false, defaultValue: '["display_name","title","institution","avatar","research_fields","bio_full","education","achievements","featured_works"]' },
    status: { type: DataTypes.ENUM('draft', 'published', 'archived'), allowNull: false, defaultValue: 'draft' },
    published_at: { type: DataTypes.DATE, allowNull: true }
  },
  { sequelize, tableName: 'ted_profiles', modelName: 'TEDProfile' }
);
