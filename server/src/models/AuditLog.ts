import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface AuditLogAttributes {
  id: number;
  user_id?: number;
  action: string;
  resource_type: string;
  resource_id?: number;
  details?: string;
  ip_address?: string;
  created_at?: Date;
}

export interface AuditLogCreationAttributes extends Optional<AuditLogAttributes, 'id'> {}

export class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
  public id!: number;
  public user_id?: number;
  public action!: string;
  public resource_type!: string;
  public resource_id?: number;
  public details?: string;
  public ip_address?: string;
  public readonly created_at!: Date;
}

AuditLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    resource_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    resource_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ip_address: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'audit_logs',
    modelName: 'AuditLog',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  }
);
