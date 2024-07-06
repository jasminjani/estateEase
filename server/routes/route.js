const router = require("express").Router();
const authRoutes = require("./authRoutes");
const propertyRoutes = require("./propertyRoutes");
const contractorRoutes = require("./contractorRoutes");

router.use("/", authRoutes);
router.use("/", propertyRoutes);
router.use("/", contractorRoutes);

router.use("*", (req, res) => {
  return res.send("page not found");
});

module.exports = router;
