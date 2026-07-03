import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface FileAttributes {
  id: number;
  name: string;
  original_name: string;
  path: string;
  size: number;
  mime_type: string;
  file_type: 'avatar' | 'course' | 'assignment' | 'submission' | 'topic' | 'other';
  reference_id?: number;
  uploaded_by: number;
  storage_type: 'local' | 'oss' | 'cos' | 'minio';
  oss_path?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface FileCreationAttributes extends Optional<FileAttributes, 'id'> {}

export class File extends Model<FileAttributes, FileCreationAttributes> implements FileAttributes {
  public id!: number;
  public name!: string;
  public original_name!: string;
  public path!: string;
  public size!: number;
  public mime_type!: string;
  public file_type!: 'avatar' | 'course' | 'assignment' | 'submission' | 'topic' | 'other';
  public reference_id?: number;
  public uploaded_by!: number;
  public storage_type!: 'local' | 'oss' | 'cos' | 'minio';
  public oss_path?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

File.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    original_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    path: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    size: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    mime_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    file_type: {
      type: DataTypes.ENUM('avatar', 'course', 'assignment', 'submission', 'topic', 'other'),
      allowNull: false,
      defaultValue: 'other'
    },
    reference_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    storage_type: {
      type: DataTypes.ENUM('local', 'oss', 'cos', 'minio'),
      allowNull: false,
      defaultValue: 'local'
    },
    oss_path: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'files',
    modelName: 'File'
  }
);
