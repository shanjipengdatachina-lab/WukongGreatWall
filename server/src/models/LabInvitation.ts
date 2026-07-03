import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface LabInvitationAttributes {
  id: number;
  name: string;
  email: string;
  phone?: string;
  institution?: string;
  title?: string;
  reason?: string;
  status: 'pending' | 'accepted' | 'rejected';
  comment?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface LabInvitationCreationAttributes extends Optional<LabInvitationAttributes, 'id'> {}

export class LabInvitation extends Model<LabInvitationAttributes, LabInvitationCreationAttributes> implements LabInvitationAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone?: string;
  public institution?: string;
  public title?: string;
  public reason?: string;
  public status!: 'pending' | 'accepted' | 'rejected';
  public comment?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

LabInvitation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    institution: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'lab_invitations',
    modelName: 'LabInvitation'
  }
);
