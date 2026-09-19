"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payments", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      bookingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        field: "booking_id",
        references: {
          model: "bookings",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      stripePaymentIntentId: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true,
        field: "stripe_payment_intent_id",
      },

      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      currency: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: "usd",
      },

      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: "PENDING",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: "created_at",
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: "updated_at",
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("payments");
  },
};