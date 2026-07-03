import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface CommentAttributes {
  id: number;
  submission_id: number;
  user_id: number;
  content: string;
  parent_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CommentCreationAttributes extends Optional<CommentAttributes, 'id'> {}

export class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public id!: number;
  public submission_id!: number;
  public user_id!: number;
  public content!: string;
  public parent_id?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Comment.init(
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
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'comments',
    modelName: 'Comment'
  }
);
