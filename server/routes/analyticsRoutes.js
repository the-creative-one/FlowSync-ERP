const express = require("express");
const router = express.Router();

const { getAnalytics } = require("../controllers/analyticsController");

const { protect } = require("../middleware/authMiddleware");

const { checkPermission } = require("../middleware/permissionMiddleware");

router.get(
  "/",
  protect,
  checkPermission("canViewAdvancedAnalytics"),
  getAnalytics,
);

module.exports = router;
