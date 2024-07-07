const db = require("../models");
const { Op } = require("sequelize");

exports.getSubmitedNotApprovedProperty = async (req, res) => {
  try {
    const notApprovedAllProperties = await db.properties.findAll({
      where: { is_approved: 0 },
      attributes: ["id", "name", "address", "city", "pincode", "is_approved"],
      // raw: true,
      include: [
        {
          model: db.jobs,
          as: "jobs",
          attributes: ["jobname"],
        },
      ],
      // group : ['jobs.jobname']
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

exports.getPropertyAllDetailsByPropertyId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "propertt id not found",
      });
    }

    const propertyAllDetails = await db.properties.findAll({
      where: { [Op.and]: [{ id: id }, { is_approved: 0 }] },
      include: [
        {
          model: db.jobs,
          as: "jobs",
          include: [
            {
              model: db.job_photos,
              as: "job_photos",
            },
          ],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: propertyAllDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
