"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "work_proofs",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        estimate_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "estimates",
            key: "id",
            as: "estimate_id",
          },
          validate: {
            notEmpty: true,
            isInt: {
              msg: "estimate table foreign key must be integer",
            },
          },
        },
        status: {
          type: Sequelize.STRING(1),
          allowNull: false,
          defaultValue: 0,
        },
        comments: {
          type: Sequelize.TEXT,
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
    await queryInterface.dropTable("work_proofs");
  },
};
