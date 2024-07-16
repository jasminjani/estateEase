"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class properties extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      properties.belongsTo(models.users, { foreignKey: "powner_id" });
      properties.hasMany(models.user_room_chats, { foreignKey: "p_id" });
      properties.hasMany(models.jobs, { foreignKey: "p_id" });
      properties.hasMany(models.estimates, { foreignKey: "p_id" });
      properties.hasMany(models.payments, { foreignKey: "p_id" });
    }
  }
  properties.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      powner_id: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "fill property name",
          },
        },
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "fill property address",
          },
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "fill property's city name",
          },
        },
      },
      pincode: {
        type: DataTypes.STRING(6),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "fill pincode",
          },
        },
      },
      is_approved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.STRING(1),
        allowNull: false,
        defaultValue: 0,
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
      modelName: "properties",
    }
  );
  return properties;
};
