// const { sentEmail } = require("../helpers/email");
const db = require("../models");
const cookieParser = require("cookie-parser");
// require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

exports.addUser = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      const { fname, lname, email, phone_no, dob, city, role_id, password } =
        req.body;

      if (
        !fname ||
        !lname ||
        !email ||
        !phone_no ||
        !dob ||
        !city ||
        !role_id ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message: "data missing in user creation",
        });
      }

      // check that current user is already exist or not
      const checkSameUser = await db.users.findAll(
        { where: { email: email } },
        { transaction: t }
      );
      console.log("check same user : ", checkSameUser);

      // if user already exists
      if (checkSameUser.length > 0) {
        return res.status(400).json({
          success: false,
          message: "User already exist",
        });
      }

      // if user not alredy exist

      // A string containing a randomly generated, 36 character long v4 UUID.
      const activation_code = crypto.randomUUID();

      let hashPassword;
      try {
        let bcryptsalt = await bcrypt.genSaltSync(10);
        hashPassword = await bcrypt.hash(password, bcryptsalt);
      } catch (error) {
        console.log(error.message);
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
      console.log(hashPassword);
      const newUser = await db.users.create(
        {
          fname,
          lname,
          email,
          phone_no,
          dob,
          city,
          role_id,
          activation_code,
          token_created_at: new Date(),
          status: true,
          password: hashPassword,
        },
        { transaction: t }
      );

      console.log("new added user : ", newUser);

      // const emailHtml = `<h2>congratulations, you have succesefully registered on remindMe platform.</h2><p> click belowe link for creating password and activate your account</p>. <h3><a href='http://localhost:${process.env.PORT}/password/${activation_code}'>http://localhost:${process.env.PORT}/password/${activation_code}</a></h3> <p>HAVE A GOOD DAY :)</p>`;

      // await sentEmail(email, "sending link for creating password", emailHtml);
      console.log("user added successfully!!");

      res
        .status(200)
        .json({ success: true, message: "user register successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { activation } = req.params;

    if (!password || !activation) {
      return res.status(400).json({
        success: false,
        message: "password or activation not found",
      });
    }

    let hashPassword;
    try {
      let bcryptsalt = await bcrypt.genSaltSync(10);
      hashPassword = await bcrypt.hash(password, bcryptsalt);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    const updateUser = await db.users.update(
      { password: hashPassword, status: 1 },
      { where: { activation_code: activation } }
    );

    res.status(200).json({ updateUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      // get data
      let { email, password } = req.body;

      // validate data
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
      // execute the query to find user in DB by email
      let result;
      try {
        result = await db.users.findAll(
          { where: { email: email, status: 1 }, raw: true },
          { transaction: t }
        );
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      // user not found then return res
      if (result.length <= 0) {
        return res.status(400).json({
          success: false,
          message: "Incorrect Email or Password",
        });
      }

      // user found the verify DB password with entered password
      let hashPassword = result[0].password;
      if (await bcrypt.compare(password, hashPassword)) {
        // both are same

        //if db password and user's password matched then put the entry in login_attempts as accept

        try {
          await db.login_attemps.create(
            { user_id: result[0].id, status: true },
            { transaction: t }
          );
        } catch (error) {
          return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error",
          });
        }

        // generate token for the cookie
        let payload = {
          id: result[0].id,
          email: result[0].email,
          role_id: result[0].role_id,
        };

        // remove password and other field from the user obj
        let { password, createdAt, deletedAt, updatedAt, ...newObj } =
          result[0];
        // generate token
        let token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        // set token into userObj
        newObj.token = token;

        // if db password and user's password matched then put the entry in user sessiond with jwt token
        try {
          await db.user_sessions.create(
            { user_id: result[0].id, jwt_token: token, ip_address: req.ip },
            { transaction: t }
          );
        } catch (error) {
          return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error",
          });
        }

        return res
          .cookie("token", token, {
            maxAge: 4 * 24 * 60 * 60 * 1000,
            httpOnly: true,
          })
          .json({
            success: true,
            user: newObj,
          });
      } else {
        //if db password and user's password not matched then put the entry in login_attempts as fail
        try {
          await db.login_attemps.create(
            { user_id: result[0].id, status: false },
            { transaction: t }
          );
        } catch (error) {
          return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error",
          });
        }

        //return res for the not match the password with stored password
        return res.json({
          success: false,
          message: "Incorrect Email or Password",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    return res.clearCookie("token").json({
      success: true,
      message: "user Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logoutAllDevices = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        success: false,
        message: "Invalid request: user not found",
      });
    }

    res.clearCookie("token");
    await db.user_sessions.destroy({ where: { user_id: req.user.id } });

    res.status(200).json({
      success: true,
      message: "All user Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logoutAllOtherDevices = async (req, res) => {
  try {
    if (!req.user || !req.token) {
      return res.status(400).json({
        success: false,
        message: "Invalid request: user or token not found",
      });
    }

    await db.user_sessions.destroy({
      where: {
        [Op.and]: [
          { user_id: req.user.id },
          { jwt_token: { [Op.ne]: req.token } },
        ],
      },
    });

    res.status(200).json({
      success: true,
      message: "All other user Logged out successfully",
    });
  } catch (error) {
    console.error("Error logging out from other devices: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
