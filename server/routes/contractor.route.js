const router = require("express").Router();
const passport = require("passport");
const {
  getSubmitedNotApprovedProperty,
  getPropertyAllDetailsByPropertyId,
  addEstimatePriceOfProperty,
  getPropertyEstimatesHistory,
  addWorkProofAndImage,
} = require("../controllers/contractor.controller");
const { imgStorage } = require("../middlewares/multer.middleware");
const multer = require("multer");
const { isContractor } = require("../middlewares/contractor.middleware");
const imgUpload = multer({ storage: imgStorage });

router.use(
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  isContractor
);

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
