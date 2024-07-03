"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class estimates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      estimates.belongsTo(models.users, { foreignKey: "contracter_id" });
      estimates.belongsTo(models.properties, { foreignKey: "p_id" });
      estimates.hasMany(models.work_proofs, { foreignKey: "estimate_id" });
    }
  }
  estimates.init(
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
            msg: "estimate table properties foreign key must be integer",
          },
        },
      },
      contracter_id: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
          isFloat: {
            msg: "price must float number",
          },
        },
      },
      status: {
        type: DataTypes.BOOLEAN,
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
      modelName: "estimates",
      paranoid: true,
    }
  );
  return estimates;
};
