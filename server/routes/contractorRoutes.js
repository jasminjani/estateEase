const router = require("express").Router();
const passport = require("passport");
const {
  getSubmitedNotApprovedProperty,
  getPropertyAllDetailsByPropertyId,
  addEstimatePriceOfProperty,
  getPropertyEstimatesHistory,
  addWorkProofAndImage,
} = require("../controllers/contractorController");
const { imgStorage } = require("../utils/multer");
const multer = require("multer");
const imgUpload = multer({ storage: imgStorage });

// router.use(
// passport.authenticate("jwt", { session: false, failureMessage: true })
// isContractor
// );

router
  .route("/get-submitted-notApproved-property")
  .get(getSubmitedNotApprovedProperty);

router
  .route("/get-property-all-details-by-id/:id")
  .get(getPropertyAllDetailsByPropertyId);

router.route("/add-estimate-price").post(addEstimatePriceOfProperty);

router.route("/get-estimate-history").get(getPropertyEstimatesHistory);

router
  .route("/add-work-proof-and-image")
  .post(imgUpload.any(), addWorkProofAndImage);

module.exports = router;
