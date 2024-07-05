"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "users",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        fname: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "fill first name",
            },
          },
        },
        lname: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "fill last name",
            },
          },
        },
        email: {
          type: Sequelize.STRING,
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
          type: Sequelize.BIGINT,
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
          type: Sequelize.DATE,
          allowNull: false,
        },
        city: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        status: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            // is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i,
            notEmpty: true,
          },
        },
        role_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "roles",
            key: "id",
            as: "role_id",
          },
          validate: {
            isInt: {
              msg: "user table foreign key must be integer",
            },
          },
        },
        activation_code: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        token_created_at: {
          type: Sequelize.DATE,
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
          // allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        paranoid: true,
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
