"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "properties",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        powner_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
            as: "powner_id",
          },
          validate: {
            notEmpty: true,
            isInt: {
              msg: "property table foreign key must be integer",
            },
          },
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "fill property name",
            },
          },
        },
        address: {
          type: Sequelize.TEXT,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "fill property address",
            },
          },
        },
        city: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "fill property's city name",
            },
          },
        },
        pincode: {
          type: Sequelize.STRING(6),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "fill pincode",
            },
          },
        },
        is_approved: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: 0,
        },
        status: {
          type: Sequelize.STRING(1),
          allowNull: false,
          defaultValue: 0,
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
    await queryInterface.dropTable("properties");
  },
};
