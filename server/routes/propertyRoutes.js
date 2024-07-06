const router = require("express").Router();
const passport = require("passport");
const {
  addProperty,
  getProperty,
} = require("../controllers/propertyController");
const { imgStorage } = require("../utils/multer");
const multer = require("multer");
// const fileUpload = multer({ storage: fileStorage,fileFilter:fileFilter });
const imgUpload = multer({ storage: imgStorage });

router.use(
  passport.authenticate("jwt", { session: false, failureMessage: true })
  // isProperty
);

router.route("/add-property").post(imgUpload.any(), addProperty);

router.route("/get-property").get(getProperty);

module.exports = router;
