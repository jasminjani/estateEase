"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Jobs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Jobs.belongsTo(models.properties, { foreignKey: "p_id" });
      Jobs.hasMany(models.job_photos, {
        foreignKey: "job_work_id",
        constraints: false,
        scope: {
          is_work: 0,
        },
      });
      Jobs.hasMany(models.work_proofs, { foreignKey: "job_id" });
    }
  }
  Jobs.init(
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
            msg: "Jobs table foreign key must be integer",
          },
        },
      },
      jobname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      job_description: {
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
      modelName: "jobs",
      paranoid: true,
    }
  );
  return Jobs;
};
