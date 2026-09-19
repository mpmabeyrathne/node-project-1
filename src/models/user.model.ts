import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    CreationOptional,
  } from "sequelize";
  
  import { sequelize } from "../config/index.js";
  
  export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
  > {
    declare id: CreationOptional<number>;
  
    declare name: string;
  
    declare email: string;
  
    declare passwordHash: string;
  
    declare createdAt: CreationOptional<Date>;
  
    declare updatedAt: CreationOptional<Date>;
  }
  
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
  
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
  
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
  
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "password_hash",
      },
  
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "created_at",
      },
  
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "updated_at",
      },
    },
    {
      sequelize,
  
      tableName: "users",
  
      modelName: "User",
  
      timestamps: true,
    },
  );