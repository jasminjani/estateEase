const db = require("../models");

exports.addProperty = async (req, res) => {
  try {
    const { name, address, city, pincode } = req.body.values;

    const { jobname, job_description, photos } = req.body.jobsCount;

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
        { powner_id: id, name, address, city, pincode },
        { transaction: t }
      );
      console.log("newProperty.id ", newProperty.id);

      req.body.jobsCount.forEach(async (element) => {
        console.log("element ", element.name);
        if (!element.name) {
          return res.status(400).json({
            success: false,
            message: "jobs name not found",
          });
        }

        const newJobs = await db.jobs.create(
          {
            p_id: newProperty.id,
            jobname: element.name,
            job_description: element.description,
          }
          // { transaction: t }
        );

        console.log("newJobs.id ", newJobs.id);

        // element.photos.forEach(async (el) => {
        //   console.log("el ", el);
        //   if (!el) {
        //     return res.status(400).json({
        //       success: false,
        //       message: "job photo not found",
        //     });
        //   }

        //   const newPhotos = await db.job_photos.create(
        //     {
        //       user_id: id,
        //       is_work: false,
        //       job_work_id: newJobs.id,
        //       photo: el,
        //     },
        //     { transaction: t }
        //   );
        // });
      });

      res.status(200).json({
        success: true,
        message: "Property added successfully",
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
