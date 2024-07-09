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
        message: "property id not found",
      });
    }

    const propertyAllDetails = await db.properties.findOne({
      where: { id: id },
      // where: { [Op.and]: [{ id: id }, { is_approved: 0 }] },   // this is changed because this is also used for property side display entered property 
      attributes: ["id", "name", "address", "city", "pincode"],
      include: [
        {
          model: db.jobs,
          as: "jobs",
          attributes: ["id", "jobname", "job_description"],
          include: [
            {
              model: db.job_photos,
              // as: "job_photos",
            },
          ],
        },
        {
          model: db.users,
          attributes: ["fname", "lname", "email"],
          // as: "users",
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

exports.addEstimatePriceOfProperty = async (req, res) => {
  try {
    console.log("jash");
    const { price, p_id } = req.body;
    const { id } = req.user;

    if (!price || !p_id) {
      return res.status(400).json({
        success: false,
        message: "estimation price or property id not found",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "contractor id not found",
      });
    }

    await db.estimates.create({
      p_id: p_id,
      contracter_id: id,
      price: price,
    });

    res.status(200).json({
      success: true,
      message: "tender price added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
