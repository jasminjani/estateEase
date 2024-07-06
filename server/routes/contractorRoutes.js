const router = require("express").Router();
const passport = require("passport");
const {
  getSubmitedNotApprovedProperty,
} = require("../controllers/contractorController");

// router.use(
// passport.authenticate("jwt", { session: false, failureMessage: true })
// isContractor
// );

router
  .route("/get-submitted-notApproved-property")
  .get(getSubmitedNotApprovedProperty);

module.exports = router;
