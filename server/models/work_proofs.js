"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class work_proofs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      work_proofs.belongsTo(models.estimates, { foreignKey: "estimate_id" });
    }
  }
  work_proofs.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      estimate_id: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.STRING(1),
        allowNull: false,
        defaultValue: 0,
      },
      comments: {
        type: DataTypes.TEXT,
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
      modelName: "work_proofs",
      paranoid: true,
    }
  );
  return work_proofs;
};
