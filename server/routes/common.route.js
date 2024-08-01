const router = require("express").Router();
const passport = require("passport");
const {
  getPreviousChatMsgAndReceiverData,
  addChatMessages,
} = require("../controllers/property.controller");

router.use(
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" })
);

// ===== This are common chat route which can access by both contractor and property =====
router
  .route("/get-chat-msg-and-receiver-data")
  .post(getPreviousChatMsgAndReceiverData);

router.route("/add-chat-msg").post(addChatMessages);

module.exports = router;
