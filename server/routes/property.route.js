const router = require("express").Router();
const passport = require("passport");
const {
  addPropertyAndJobs,
  getProperty,
  getEstimatePriceOfProperty,
  approveBidForProperty,
  rejectBidForProperty,
  getreviewWorkProofDataByPropertyId,
  addReviewWorkComments,
  getPropertyAllDetails,
  createStripeSessions,
  getPaymentDetails,
  markPaymentAsDone,
} = require("../controllers/property.controller");
const { imgStorage } = require("../middlewares/multer.middleware");
const multer = require("multer");
const { isProperty } = require("../middlewares/property.middleware");
const imgUpload = multer({ storage: imgStorage });

// This will apply to all below routes
// This will check for jwt authentication and user route permission based on role
router.use(
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  isProperty
);

router.route("/add-property").post(imgUpload.any(), addPropertyAndJobs);

router.route("/get-property").get(getProperty);

router.route("/get-estimate-price/:p_id").get(getEstimatePriceOfProperty);

router.route("/approve-bid").post(approveBidForProperty);

router.route("/reject-bid").post(rejectBidForProperty);

router.route("/review-work-proof/:id").get(getreviewWorkProofDataByPropertyId);

router.route("/add-review-comment").post(addReviewWorkComments);

router.route("/get-property-all-details/:id").get(getPropertyAllDetails);

router.route("/create-stripe-session").post(createStripeSessions);

router.route("/get-payment-details").post(getPaymentDetails);

router.route("/mark-payment-done").post(markPaymentAsDone);

module.exports = router;
