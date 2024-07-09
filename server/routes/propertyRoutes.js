const router = require("express").Router();
const passport = require("passport");
const {
  addPropertyAndJobs,
  getProperty,
  getEstimatePriceOfProperty,
  approveBidForProperty,
  rejectBidForProperty,
  reviewWorkProof,
} = require("../controllers/propertyController");
const { imgStorage } = require("../utils/multer");
const multer = require("multer");
const imgUpload = multer({ storage: imgStorage });

router.use(
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" })
  // isProperty
);

router.route("/add-property").post(imgUpload.any(), addPropertyAndJobs);

router.route("/get-property").get(getProperty);

router.route("/get-estimate-price/:p_id").get(getEstimatePriceOfProperty);

router.route("/approve-bid").post(approveBidForProperty);

router.route("/reject-bid").post(rejectBidForProperty);

router.route("/review-work-proof").post(reviewWorkProof);

module.exports = router;
