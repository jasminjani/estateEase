"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "estimates",
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
              msg: "estimate table properties foreign key must be integer",
            },
          },
        },
        contracter_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
            as: "contracter_id",
          },
          validate: {
            notEmpty: true,
            isInt: {
              msg: "estimate table users foreign key must be integer",
            },
          },
        },
        price: {
          type: Sequelize.FLOAT,
          allowNull: false,
          validate: {
            notEmpty: true,
            isFloat: {
              msg: "price must float number",
            },
          },
        },
        status: {
          type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("estimates");
  },
};
