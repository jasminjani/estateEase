const router = require("express").Router();
const passport = require("passport");
const { addProperty } = require("../controllers/propertyController");
const { imgStorage, imageFilter } = require("../utils/multer");
const multer = require("multer");
// const fileUpload = multer({ storage: fileStorage,fileFilter:fileFilter });
const imgUpload = multer({ storage: imgStorage, fileFilter: imageFilter });

router
  .route("/add-property")
  .post(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    addProperty
  );

module.exports = router;
