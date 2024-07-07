const router = require("express").Router();
const passport = require("passport");
const {
  addPropertyAndJobs,
  getProperty,
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

module.exports = router;
