const {
  addUser,
  addPassword,
  login,
  logout,
  getCurrentUser,
  logoutAllDevices,
  logoutAllOtherDevices,
} = require("../controllers/auth.controller");
const passport = require("passport");
const router = require("express").Router();

// registration add user
router.route("/add-user").post(addUser);

// login check email and password
router.route("/login").post(login);

// add password in db
router.route("/add-password/:activation").post(addPassword);

// router.route("/current-user").get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), getCurrentUser);

router
  .route("/logout")
  .post(
    passport.authenticate("jwt", { session: false, failWithError: "/login" }),
    logout
  );

router
  .route("/logout-all")
  .post(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    logoutAllDevices
  );

router
  .route("/logout-all-other")
  .post(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    logoutAllOtherDevices
  );

module.exports = router;
