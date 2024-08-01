const db = require("../models");
const { Op } = require("sequelize");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// exports.getSubmitedNotApprovedProperty = async (req, res) => {
//   try {
//     const notApprovedAllProperties = await db.properties.findAll({
//       where: { is_approved: 0 },
//       attributes: ["id", "name", "address", "city", "pincode", "is_approved"],
//       // raw: true,
//       include: [
//         {
//           model: db.jobs,
//           as: "jobs",
//           attributes: ["jobname"],
//         },
//         {
//           model: db.estimates,
//           attributes: ["id", "p_id", "contracter_id", "status"],
//           required: false,
//         },
//       ],
//       // group : ['jobs.jobname']
//     });

//     res.status(200).json({
//       success: true,
//       message: notApprovedAllProperties,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

exports.getSubmitedNotApprovedProperty = async (req, res) => {
  try {
    const { id } = req.user;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    const estimateData = await db.estimates.findAll(
      {
        where: { contracter_id: id },
        attributes: ["p_id"],
      },
      { raw: true }
    );

    const propertyIdArray = [];

    // ===== propertyIdArray will contain details of bidded property id =====
    estimateData.forEach((element) => {
      propertyIdArray.push(element.p_id);
    });

    // find only those property in which this contracter not applied bid.
    const notApprovedAllProperties = await db.properties.findAll({
      where: { id: { [Op.notIn]: propertyIdArray } },
      attributes: ["id", "name", "address", "city", "pincode", "is_approved"],
      include: [
        {
          model: db.jobs,
          as: "jobs",
          attributes: ["jobname"],
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

exports.getPropertyAllDetailsByPropertyId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "property id not found",
      });
    }

    // find particular property all details
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
              required: false, // means this model is not necessary (LEFT JOIN)
            },
          ],
        },
        {
          model: db.users,
          attributes: ["id", "fname", "lname", "email"],
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
        message: "required fields not found",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "contractor details not found",
      });
    }

    const checkAlreadyAppliedTender = await db.estimates.findAll({
      where: {
        p_id,
        contracter_id: id,
      },
    });

    // check if user has already applied for property
    if (checkAlreadyAppliedTender?.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already applied Tender for this Property",
      });
    }

    // if already not apply then add their estimate price.
    const insertedEstimate = await db.estimates.create({
      p_id: p_id,
      contracter_id: id,
      price: price,
    });

    // give current added estimate data for real time data sent on socket to property side.
    const newEstimateData = await db.estimates.findOne({
      where: { id: insertedEstimate.id },
      attributes: ["id", "p_id", "price", "status"],
      // required: false,
      include: [
        {
          model: db.users,
          attributes: ["id", "fname", "lname", "email"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: newEstimateData,
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

    // get applied property estimate history for current contracter
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
      // for all job insert data into work proof and photos
      while (req.body[`job_id_${index}`]) {
        if (!req.body[`job_id_${index}`]) {
          return res.status(400).json({
            success: false,
            message: "jobs id not found",
          });
        }

        // update work proof status to 1 for all before entered work proof for this job id.
        await db.work_proofs.update(
          { status: 1 },
          { where: { job_id: req.body[`job_id_${index}`] } },
          { transaction: t }
        );

        // then add newly added work proof for this job id
        const newWorkProof = await db.work_proofs.create(
          {
            job_id: req.body[`job_id_${index}`],
            estimate_id: estimate_id,
            status: 0,
          },
          { transaction: t }
        );

        // get one image from array for this job id and upload image to cloudinary and then save cloudinary link to database table one by one
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

            // after uploading image to cloudinary deleting it from server/uploads/cloudinaryImg
            fs.unlinkSync(element.path);

            // insert clodinary saved photo link into table
            await db.job_photos.create(
              {
                user_id: id,
                is_work: true,
                job_work_id: newWorkProof.id,
                photo: result.url,
              },
              { transaction: t }
            );
          });

        await Promise.all(uploadPromises);

        index++;
      }

      //  update property status as payment pending because work proof is uploaded
      await db.properties.update(
        { status: 2 },
        { where: { id: p_id } },
        { transaction: t }
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
