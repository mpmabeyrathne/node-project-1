import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
  } from "sequelize";
  
  import { sequelize } from "../config/index.js";
  
  export class Booking extends Model<
    InferAttributes<Booking>,
    InferCreationAttributes<Booking>
  > {
    declare id: CreationOptional<number>;
    declare userId: number;
    declare roomId: number;
    declare checkIn: string;
    declare checkOut: string;
    declare totalAmount: string;
    declare status: CreationOptional<string>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
  }
  
  Booking.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
  
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
  
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "room_id",
      },
  
      checkIn: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: "check_in",
      },
  
      checkOut: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: "check_out",
      },
  
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "total_amount",
      },
  
      status: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "PENDING",
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
      tableName: "bookings",
      modelName: "Booking",
      timestamps: true,
    },
  );