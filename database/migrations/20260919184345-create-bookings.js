"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bookings", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "user_id",
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      roomId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "room_id",
        references: {
          model: "rooms",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      checkIn: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        field: "check_in",
      },

      checkOut: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        field: "check_out",
      },

      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        field: "total_amount",
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
    await queryInterface.dropTable("bookings");
  },
};