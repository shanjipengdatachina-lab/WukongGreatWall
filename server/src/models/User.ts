import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'student' | 'reviewer';
  status: 'active' | 'inactive' | 'pending';
  scholar_id?: string;
  profile_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: 'admin' | 'student' | 'reviewer';
  public status!: 'active' | 'inactive' | 'pending';
  public scholar_id?: string;
  public profile_id?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'student', 'reviewer'),
      allowNull: false,
      defaultValue: 'student'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'pending'),
      allowNull: false,
      defaultValue: 'active'
    },
    scholar_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    profile_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User'
  }
);
