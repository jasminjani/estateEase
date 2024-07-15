"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "user_room_chats",
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
        sender_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
            as: "sender_id",
          },
          validate: {
            notEmpty: true,
            isInt: {
              msg: "chat room table foreign key must be integer",
            },
          },
        },
        receiver_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
            as: "receiver_id",
          },
          validate: {
            notEmpty: true,
            isInt: {
              msg: "chat room table foreign key must be integer",
            },
          },
        },
        message: {
          type: Sequelize.TEXT,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "message is required",
            },
          },
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
    await queryInterface.dropTable("user_room_chats");
  },
};
