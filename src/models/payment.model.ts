import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
  } from "sequelize";
  
  import { sequelize } from "../config/index.js";
  
  export class Payment extends Model<
    InferAttributes<Payment>,
    InferCreationAttributes<Payment>
  > {
    declare id: CreationOptional<number>;
    declare bookingId: number;
    declare stripePaymentIntentId: string | null;
    declare amount: string;
    declare currency: CreationOptional<string>;
    declare status: CreationOptional<string>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
  }
  
  Payment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
  
      bookingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        field: "booking_id",
      },
  
      stripePaymentIntentId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
        field: "stripe_payment_intent_id",
      },
  
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
  
      currency: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "usd",
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
      tableName: "payments",
      modelName: "Payment",
      timestamps: true,
    },
  );