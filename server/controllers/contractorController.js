const db = require("../models");
const { Op } = require("sequelize");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

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
            {
              model: db.work_proofs,
              where: {
                // [Op.and]: [{ status: 0 }, { comments: { [Op.ne]: null } }],
                status: 0,
              },
              attributes: ["comments"],
              required: false,
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

exports.getPropertyEstimatesHistory = async (req, res) => {
  try {
    const { id } = req.user;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "user id not found",
      });
    }

    const userPropertyEstimateHistory = await db.estimates.findAll({
      where: { contracter_id: id },
      attributes: ["id", "p_id", "price", "status"],
      include: [
        {
          model: db.properties,
          attributes: [
            "id",
            "powner_id",
            "name",
            "city",
            "is_approved",
            "status",
          ],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: userPropertyEstimateHistory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addWorkProofAndImage = async (req, res) => {
  try {
    // console.log("req.body :>> ", req.body);
    // console.log("req.files :>> ", req.files);

    const { estimate_id, p_id } = req.body;
    const { id } = req.user;

    if (!estimate_id || !p_id || !id) {
      return res.status(400).json({
        success: false,
        message: "property or contracter or estimate id not found",
      });
    }

    await db.sequelize.transaction(async (t) => {
      let index = 0;
      while (req.body[`job_id_${index}`]) {
        if (!req.body[`job_id_${index}`]) {
          return res.status(400).json({
            success: false,
            message: "jobs id not found",
          });
        }

        await db.work_proofs.update(
          { status: 1 },
          { where: { job_id: req.body[`job_id_${index}`] } },
          { transaction: t }
        );

        const newWorkProof = await db.work_proofs.create(
          {
            job_id: req.body[`job_id_${index}`],
            estimate_id: estimate_id,
            status: 0,
          }
          // { transaction: t }
        );
        const uploadPromises = req.files
          .filter((file) => file.fieldname.startsWith(`photos_${index}`))
          .map(async (element) => {
            if (!element.filename) {
              return res.status(400).json({
                success: false,
                message: "photo's filename not found",
              });
            }

            // uploading image file to cloudinary
            const result = await cloudinary.uploader.upload(element.path, {
              resource_type: "auto",
            });
            console.log("result.url :>> ", result);

            // after uploading image to cloudinary deleting it from server/uploads/cloudinaryImg
            fs.unlinkSync(element.path);

            await db.job_photos.create(
              {
                user_id: id,
                is_work: true,
                job_work_id: newWorkProof.id,
                // photo: element.filename,
                photo: result.url,
              }
              // { transaction: t }
            );
          });

        await Promise.all(uploadPromises);

        index++;
      }

      await db.properties.update(
        { status: 2 },
        { where: { id: p_id } }
        // { transaction: t }
      );

      res.status(200).json({
        success: true,
        message: "work and image addede successfully",
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
