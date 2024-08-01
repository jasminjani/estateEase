const db = require("../models");

exports.isContractor = async (req, res, next) => {
  try {
    let id = req.user.id;
    let result;
    try {
      result = await db.users.findOne({
        where: { id },
        include: [{ model: db.roles }],
        raw: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    // check if role is property than call next or call next with null data
    if (result && result["role.role"]?.toLowerCase() == "constructor") {
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "No permission for this URL",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};
