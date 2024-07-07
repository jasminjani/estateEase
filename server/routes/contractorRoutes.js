const router = require("express").Router();
const passport = require("passport");
const {
  getSubmitedNotApprovedProperty,
  getPropertyAllDetailsByPropertyId,
} = require("../controllers/contractorController");

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

module.exports = router;
