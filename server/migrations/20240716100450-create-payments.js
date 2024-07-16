"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "payments",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        p_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "properties",
            key: "id",
            as: "p_id",
          },
          validate: {
            notEmpty: true,
            isInt: {
              msg: "properties table foreign key must be integer",
            },
          },
        },
        session_id: {
          type: Sequelize.TEXT,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "session id is required",
            },
          },
        },
        payment_mode: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        status: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        deletedAt: {
          type: Sequelize.DATE,
        },
      },
      {
        paranoid: true,
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("payments");
  },
};
