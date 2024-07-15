"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_room_chats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_room_chats.belongsTo(models.properties, { foreignKey: "p_id" });
      user_room_chats.belongsTo(models.users, { foreignKey: "sender_id" });
      user_room_chats.belongsTo(models.users, { foreignKey: "receiver_id" });
    }
  }
  user_room_chats.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      p_id: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.INTEGER,
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
        type: DataTypes.INTEGER,
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
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "message is required",
          },
        },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "user_room_chats",
      paranoid: true,
    }
  );
  return user_room_chats;
};
