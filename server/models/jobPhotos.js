"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JobPhotos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // console.log("models :>> ", models);
      // define association here
      JobPhotos.belongsTo(models.users, { foreignKey: "user_id" });
      JobPhotos.belongsTo(models.jobs, {
        foreignKey: "job_work_id",
        constraints: false,
      });
      JobPhotos.belongsTo(models.work_proofs, {
        foreignKey: "job_work_id",
        constraints: false,
      });
    }
  }
  JobPhotos.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.BOOLEAN, //  0 for job photos and 1 for work photos
        allowNull: false,
      },
      job_work_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "job work combine id can not be null",
          },
        },
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: false,
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
      modelName: "job_photos",
      paranoid: true,
    }
  );
  return JobPhotos;
};
