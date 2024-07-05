const router = require("express").Router();
const authRoutes = require("./authRoutes");
const PropertyRoutes = require("./propertyRoutes");

router.use("/", authRoutes);
router.use("/", PropertyRoutes);

router.use("*", (req, res) => {
  return res.send("page not found");
});

module.exports = router;
