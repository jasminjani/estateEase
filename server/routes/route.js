const router = require("express").Router();
const authRoutes = require("./authRoutes");

router.use("/", authRoutes);

router.use("*", (req, res) => {
  return res.send("page not found");
});

module.exports = router;
