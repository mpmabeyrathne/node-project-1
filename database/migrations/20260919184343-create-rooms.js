"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rooms", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      pricePerNight: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        field: "price_per_night",
      },

      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: "AVAILABLE",
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
    await queryInterface.dropTable("rooms");
  },
};