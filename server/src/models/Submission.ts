import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface SubmissionAttributes {
  id: number;
  assignment_id: number;
  user_id: number;
  version: number;
  status: 'draft' | 'submitted' | 'reviewed' | 'revised';
  comment?: string;
  score?: number;
  reviewed_by?: number;
  reviewed_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface SubmissionCreationAttributes extends Optional<SubmissionAttributes, 'id'> {}

export class Submission extends Model<SubmissionAttributes, SubmissionCreationAttributes> implements SubmissionAttributes {
  public id!: number;
  public assignment_id!: number;
  public user_id!: number;
  public version!: number;
  public status!: 'draft' | 'submitted' | 'reviewed' | 'revised';
  public comment?: string;
  public score?: number;
  public reviewed_by?: number;
  public reviewed_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Submission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    assignment_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    status: {
      type: DataTypes.ENUM('draft', 'submitted', 'reviewed', 'revised'),
      allowNull: false,
      defaultValue: 'draft'
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reviewed_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'submissions',
    modelName: 'Submission'
  }
);
