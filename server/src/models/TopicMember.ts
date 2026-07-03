import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface TopicMemberAttributes {
  id: number;
  topic_id: number;
  user_id: number;
  role: 'leader' | 'member' | 'reviewer';
  status: 'pending' | 'accepted' | 'rejected';
  joined_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface TopicMemberCreationAttributes extends Optional<TopicMemberAttributes, 'id'> {}

export class TopicMember extends Model<TopicMemberAttributes, TopicMemberCreationAttributes> implements TopicMemberAttributes {
  public id!: number;
  public topic_id!: number;
  public user_id!: number;
  public role!: 'leader' | 'member' | 'reviewer';
  public status!: 'pending' | 'accepted' | 'rejected';
  public joined_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

TopicMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    topic_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('leader', 'member', 'reviewer'),
      allowNull: false,
      defaultValue: 'member'
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    },
    joined_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'topic_members',
    modelName: 'TopicMember'
  }
);
