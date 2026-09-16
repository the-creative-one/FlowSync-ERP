const express = require("express");
const router = express.Router();
const ActivityLog = require("../models/ActivityLog");
const logActivity = require("../utils/logActivity");
const { protect, managerOrAdmin } = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/permissionMiddleware");

// GET ACTIVITY LOGS
router.get("/", protect, managerOrAdmin, async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch activity logs",
    });
  }
});

// LOG REPORT EXPORT
router.post(
  "/export",
  protect,
  checkPermission("canExportReports"),
  async (req, res) => {
    try {
      const { action, module, details } = req.body;
      await logActivity({
        userId: req.user.id,
        userName: req.user.name,
        action,
        module,
        details,
      });
      res.status(200).json({
        message: "Export logged successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to log export activity",
      });
    }
  },
);

module.exports = router;
