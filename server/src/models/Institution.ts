import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface InstitutionAttributes {
  id: number;
  name: string;
  code?: string;
  type: 'university' | 'college' | 'institute' | 'enterprise' | 'other';
  province?: string;
  city?: string;
  address?: string;
  logo?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface InstitutionCreationAttributes extends Optional<InstitutionAttributes, 'id'> {}

export class Institution extends Model<InstitutionAttributes, InstitutionCreationAttributes> implements InstitutionAttributes {
  public id!: number;
  public name!: string;
  public code?: string;
  public type!: 'university' | 'college' | 'institute' | 'enterprise' | 'other';
  public province?: string;
  public city?: string;
  public address?: string;
  public logo?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Institution.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('university', 'college', 'institute', 'enterprise', 'other'),
      allowNull: false,
      defaultValue: 'university'
    },
    province: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'institutions',
    modelName: 'Institution'
  }
);
