"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.belongsTo(models.roles, { foreignKey: "role_id" });
      users.hasMany(models.properties, { foreignKey: "powner_id" });
      users.hasMany(models.estimates, { foreignKey: "contracter_id" });
      users.hasMany(models.login_attemps, { foreignKey: "user_id" });
    }
  }
  users.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "fill first name",
          },
        },
      },
      lname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "fill last name",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "fill email",
          },
          isEmail: {
            msg: "email format is not valide",
          },
          isLowercase: {
            args: true,
            msg: "email should be in lowercase",
          },
        },
      },
      phone_no: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "fill phone no",
          },
          isInt: {
            args: true,
            msg: "phone no can be only integer value",
          },
          is: /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/i,
        },
      },
      dob: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          // is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i,
          notEmpty: true,
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
          as: "role_id",
        },
        validate: {
          isInt: {
            msg: "language table foreign key must be integer",
          },
        },
      },
      activation_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      token_created_at: {
        type: DataTypes.DATE,
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
        // allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "users",
      paranoid: true,
    }
  );
  return users;
};
