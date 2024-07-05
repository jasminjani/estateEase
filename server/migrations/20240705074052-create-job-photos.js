"use strict";

const { sequelize } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "job_photos",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
            as: "user_id",
          },
          validate: {
            notEmpty: true,
            isInt: {
              msg: "job photos table foreign key must be integer",
            },
          },
        },
        is_work: {
          type: Sequelize.BOOLEAN, //  0 for job photos and 1 for work photos
          allowNull: false,
        },
        job_work_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
            isInt: {
              msg: "job work combine id can not be null",
            },
          },
        },
        photo: {
          type: Sequelize.BLOB,
          allowNull: false,
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
    await queryInterface.dropTable("job_photos");
  },
};
