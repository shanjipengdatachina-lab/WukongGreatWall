import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ProfileAttributes {
  id: number;
  user_id: number;
  real_name: string;
  student_id: string;
  institution_id?: number;
  phone?: string;
  avatar?: string;
  research_direction?: string;
  bio?: string;
  visible_fields?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ProfileCreationAttributes extends Optional<ProfileAttributes, 'id'> {}

export class Profile extends Model<ProfileAttributes, ProfileCreationAttributes> implements ProfileAttributes {
  public id!: number;
  public user_id!: number;
  public real_name!: string;
  public student_id!: string;
  public institution_id?: number;
  public phone?: string;
  public avatar?: string;
  public research_direction?: string;
  public bio?: string;
  public visible_fields?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Profile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    real_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    student_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    institution_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    research_direction: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    visible_fields: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: JSON.stringify(['real_name', 'institution', 'avatar'])
    }
  },
  {
    sequelize,
    tableName: 'profiles',
    modelName: 'Profile'
  }
);
