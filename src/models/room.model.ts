import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
  } from "sequelize";
  
  import { sequelize } from "../config/index.js";
  
  export class Room extends Model<
    InferAttributes<Room>,
    InferCreationAttributes<Room>
  > {
    declare id: CreationOptional<number>;
    declare name: string;
    declare description: string | null;
    declare pricePerNight: string;
    declare status: CreationOptional<string>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
  }
  
  Room.init(
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
  
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
  
      pricePerNight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "price_per_night",
      },
  
      status: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "AVAILABLE",
      },
  
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
      },
  
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
      },
    },
    {
      sequelize,
      tableName: "rooms",
      modelName: "Room",
      timestamps: true,
    },
  );