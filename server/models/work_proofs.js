"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WorkProofs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WorkProofs.belongsTo(models.estimates, { foreignKey: "estimate_id" });
      WorkProofs.hasMany(models.job_photos, {
        foreignKey: "job_work_id",
        constraints: false,
        scope: {
          is_work: 1,
        },
      });
      WorkProofs.belongsTo(models.jobs, { foreignKey: "job_id" });
    }
  }
  WorkProofs.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      job_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "jobs",
          key: "id",
          as: "job_id",
        },
        validate: {
          notEmpty: true,
          isInt: {
            msg: "estimate table foreign key must be integer",
          },
        },
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
  return WorkProofs;
};
