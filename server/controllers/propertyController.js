const db = require("../models");
const { Op } = require("sequelize");

exports.addPropertyAndJobs = async (req, res) => {
  try {
    // console.log("body : ", req.body);
    // console.log("files : ", req.files);
    const { name, address, city, pincode } = req.body;
    console.log("object fom server");

    const { id } = req.user;

    await db.sequelize.transaction(async (t) => {
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "user id not found",
        });
      }

      if (!name || !address || !city || !pincode) {
        return res.status(400).json({
          success: false,
          message: "all property fields are required!!",
        });
      }

      const newProperty = await db.properties.create(
        { powner_id: id, name, address, city, pincode }
        // { transaction: t }
      );
      console.log("newProperty.id ", newProperty.id);

      let index = 0;
      while (
        req.body[`jobname_${index}`] &&
        req.body[`jobdescription_${index}`]
      ) {
        if (!req.body[`jobname_${index}`]) {
          return res.status(400).json({
            success: false,
            message: "jobs name not found",
          });
        }

        const newJob = await db.jobs.create(
          {
            p_id: newProperty.id,
            jobname: req.body[`jobname_${index}`],
            job_description: req.body[`jobdescription_${index}`],
          }
          // { transaction: t }
        );
        // console.log("newJob :>> ", newJob);
        // const createdJob = await db.jobs.findByPk(newJob.id);
        // console.log("createdJob :>> ", createdJob);
        req.files
          .filter((file) => file.fieldname.startsWith(`photo_${index}`))
          .forEach(async (element) => {
            if (!element.filename) {
              return res.status(400).json({
                success: false,
                message: "photo's filename not found",
              });
            }

            // const imageRes = await createdJob.createJob_photos({
            //   user_id: id,
            //   photo: element.filename,
            // });
            // console.log("imageRes :>> ", imageRes);
            await db.job_photos.create(
              {
                user_id: id,
                is_work: false,
                job_work_id: newJob.id,
                photo: element.filename,
              }
              // { transaction: t }
            );
          });

        index++;
      }

      res.status(200).json({
        success: true,
        message: "Property and jobs added successfully",
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

exports.getProperty = async (req, res) => {
  try {
    const { id } = req.user;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "user id not found",
      });
    }

    const userAllProperty = await db.properties.findAll({
      where: { powner_id: id },
      raw: true,
    });

    res.status(200).json({
      success: true,
      message: userAllProperty,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEstimatePriceOfProperty = async (req, res) => {
  try {
    const { p_id } = req.params;

    if (!p_id) {
      return res.status(400).json({
        success: false,
        message: "property id not found",
      });
    }

    const propertyEstimatePriceData = await db.properties.findOne({
      where: { id: p_id },
      attributes: ["name", "city", "pincode", "is_approved", "status"],
      include: [
        {
          model: db.estimates,
          attributes: ["id", "p_id", "price", "status"],
          where: { [Op.or]: [{ status: null }, { status: 1 }] },
          required: false,
          include: [
            {
              model: db.users,
              attributes: ["fname", "lname", "email"],
            },
          ],
        },
      ],
    });

    // const propertyEstimatePriceData = await db.estimates.findAll({
    //   where: { [Op.and]: [{ p_id: p_id }, { status: null }] },
    //   attributes: ["id", "p_id", "price", "status"],
    //   include: [
    //     {
    //       model: db.users,
    //       // as: "users",
    //       attributes: ["fname", "lname", "email"],
    //     },
    //     {
    //       model: db.properties,
    //       attributes: ["name", "city", "pincode"],
    //     },
    //   ],
    // });

    res.status(200).json({
      success: true,
      message: propertyEstimatePriceData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.approveBidForProperty = async (req, res) => {
  try {
    const { id, p_id } = req.body;

    if (!id || !p_id) {
      return res.status(400).json({
        success: false,
        message: "data missing in approve bidding",
      });
    }

    await db.estimates.update(
      { status: 0 },
      {
        where: { p_id: p_id },
      }
    );

    await db.estimates.update(
      { status: 1 },
      {
        where: { id: id },
      }
    );

    await db.properties.update(
      { is_approved: 1, status: 1 },
      { where: { id: p_id } }
    );

    res.status(200).json({
      success: true,
      message: "Bid Approved Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.rejectBidForProperty = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "rejected bid's id is required",
      });
    }

    await db.estimates.update({ status: 0 }, { where: { id: id } });

    res.status(200).json({
      success: true,
      message: "Bid rejected successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.reviewWorkProof = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Comment added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
