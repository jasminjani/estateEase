const db = require("../models");
const jwtStrategy = require("passport-jwt").Strategy;
// require("dotenv").config();

// getToken function for passport
const getToken = (req) => {
  return (
    req.cookies?.token ||
    req.body?.token ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    null
  );
};

// opts for passport-jwt
let opts = {
  jwtFromRequest: getToken,
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
};

// passport-jwt configuration logic
exports.passportConfig = (passport) => {
  passport.use(
    new jwtStrategy(opts, async (req, payload, next) => {
      let result;
      let id = payload.id;

      req.token = getToken(req);
      const session = await db.user_sessions.findOne({
        where: { jwt_token: req.token },
        raw: true,
      });

      if (!session) {
        return next(null, false);
      }

      try {
        result = await db.users.findAll({ where: { id: id }, raw: true });
      } catch (error) {
        // if any error during query execution
        return next(error, false);
      }

      // if user present then call next with payload
      if (result.length > 0) {
        return next(null, result[0]);
      } else {
        // if user not present then call next with empty data
        return next(null, false);
      }
    })
  );
};

exports.isProperty = async (req, res, next) => {
  try {
    let id = req.user.id;
    let result;
    try {
      result = await db.users.findAll({
        include: [{ model: db.roles, where: { id: id } }],
        raw: true,
      });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    if (result[0].role !== "property") {
      return res.send("page not found");
    }

    next();
  } catch (error) {
    logger.error(error);
    return res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};

exports.isContractor = async (req, res, next) => {
  try {
    let id = req.user.id;
    let result;
    try {
      result = await db.users.findAll({
        include: [{ model: db.roles, where: { id: id } }],
        raw: true,
      });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    if (result[0].role !== "constructor") {
      return res.send("page not found");
    }

    next();
  } catch (error) {
    logger.error(error);
    return res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};
