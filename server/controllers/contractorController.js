const db = require("../models");

exports.getSubmitedNotApprovedProperty = async (req, res) => {
  try {
    const notApprovedAllProperties = await db.properties.findAll({
      where: { is_approved: 0 },
      raw: true,
      include: [
        {
          model: db.jobs,
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: notApprovedAllProperties,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
