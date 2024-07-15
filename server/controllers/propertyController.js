const db = require("../models");
const { Op } = require("sequelize");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

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
        { powner_id: id, name, address, city, pincode },
        { transaction: t }
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
          },
          { transaction: t }
        );
        // console.log("newJob :>> ", newJob);
        // const createdJob = await db.jobs.findByPk(newJob.id);
        // console.log("createdJob :>> ", createdJob);
        const uploadPromises = req.files
          .filter((file) => file.fieldname.startsWith(`photo_${index}`))
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
                photo: result.url,
                // photo: element.filename,
              },
              { transaction: t }
            );
          });

        await Promise.all(uploadPromises);

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
              attributes: ["id", "fname", "lname", "email"],
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

exports.getreviewWorkProofDataByPropertyId = async (req, res) => {
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
              // model: db.job_photos,
              // as: "job_photos",
              model: db.work_proofs,
              attributes: ["id", "job_id", "status"],
              where: { status: 0 },
              // where: { [Op.and]: [{ comments: null }, { status: 0 }] },
              include: [
                {
                  model: db.job_photos,
                  attributes: ["id", "is_work", "job_work_id", "photo"],
                },
              ],
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

exports.addReviewWorkComments = async (req, res) => {
  try {
    console.log("ajksjkdka");
    const { p_id } = req.body;

    if (!p_id) {
      return res.status(400).json({
        success: false,
        message: "property id not found",
      });
    }

    console.log("req.body", req.body);

    await db.sequelize.transaction(async (t) => {
      const addedReviewComments = req.body.reviewComments.map(
        async (element) => {
          if (!element.work_proof_id || !element.job_id) {
            return res.status(400).json({
              success: false,
              message: "work proof id or job id not found",
            });
          }

          // if (element.comment?.trim()) {
          // console.log("element.comment.trim() :>> ", element.work_proof_id);
          // console.log("element.comment.trim() :>> ", element.comment?.trim());

          // await db.work_proofs.update(
          //   { status: 1 },
          //   { where: { job_id: element.job_id } },
          //   { transaction: t }
          // );

          console.log("element.comment :>> ", element.comment);

          if (element.comment?.trim()) {
            await db.work_proofs.update(
              { comments: element.comment, status: 0 },
              { where: { id: element.work_proof_id } },
              { transaction: t }
            );
          } else {
            await db.work_proofs.update(
              { status: 0 },
              { where: { id: element.work_proof_id } },
              { transaction: t }
            );
          }
          // }
        }
      );

      await Promise.all(addedReviewComments);

      await db.properties.update(
        { status: 3 },
        { where: { id: p_id } },
        { transaction: t }
      );

      res.status(200).json({
        success: true,
        message: "comments added successfully",
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

exports.getPropertyAllDetails = async (req, res) => {
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

exports.getPreviousChatMsgAndReceiverData = async (req, res) => {
  try {
    const { receiver_id, p_id } = req.body;
    const { id } = req.user;

    if (!receiver_id || !p_id || !id) {
      return res.status(400).json({
        success: false,
        message: "all data is required",
      });
    }

    const receiverData = await db.users.findOne({
      where: { id: receiver_id },
      attributes: ["id", "fname", "lname"],
      // include: [
      //   {
      //     model: db.user_room_chats,
      //     attributes: ["id", "p_id", "sender_id", "receiver_id", "message"],
      //     where: {
      //       p_id,
      //       sender_id: { [Op.in]: [id, receiver_id] },
      //       receiver_id: { [Op.in]: [receiver_id, id] },
      //     },
      //     // where: {
      //     //   [Op.and]: [
      //     //     { p_id: p_id },
      //     //     {
      //     //       [Op.or]: [
      //     //         {
      //     //           [Op.and]: [{ sender_id: receiver_id }, { receiver_id: id }],
      //     //         },
      //     //         {
      //     //           [Op.and]: [{ sender_id: id }, { receiver_id: receiver_id }],
      //     //         },
      //     //       ],
      //     //     },
      //     //   ],
      //     // },
      //     required: false,
      //   },
      // ],
    });

    const previousChatMsg = await db.user_room_chats.findAll({
      attributes: ["id", "p_id", "sender_id", "receiver_id", "message"],
      where: {
        p_id,
        sender_id: { [Op.in]: [id, receiver_id] },
        receiver_id: { [Op.in]: [receiver_id, id] },
      },
    });

    res.status(200).json({
      success: true,
      message: { receiverData, previousChatMsg },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addChatMessages = async (req, res) => {
  try {
    const { receiver_id, message, p_id } = req.body;
    const { id } = req.user;

    if (!id || !receiver_id || !message || !p_id) {
      return res.status(400).json({
        success: false,
        message: "all data are reuired",
      });
    }

    await db.user_room_chats.create({
      p_id,
      sender_id: id,
      receiver_id,
      message,
    });

    res.status(200).json({
      success: true,
      message: "user message added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
