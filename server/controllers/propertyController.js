const db = require("../models");

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

        req.files
          .filter((file) => file.fieldname.startsWith(`photo_${index}`))
          .forEach(async (element) => {
            if (!element.filename) {
              return res.status(400).json({
                success: false,
                message: "photo's filename not found",
              });
            }

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
