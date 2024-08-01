const router = require("express").Router();
const authRoutes = require("./auth.route");
const commonRoutes = require("./common.route");
const propertyRoutes = require("./property.route");
const contractorRoutes = require("./contractor.route");

router.use("/", authRoutes);
router.use("/common", commonRoutes);
router.use("/property", propertyRoutes);
router.use("/contractor", contractorRoutes);

router.use("*", (req, res) => {
  return res.send("page not found");
});

module.exports = router;
