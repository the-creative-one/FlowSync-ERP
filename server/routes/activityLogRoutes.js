const express = require("express");
const router = express.Router();
const ActivityLog = require("../models/ActivityLog");
const logActivity = require("../utils/logActivity");
const { protect, managerOrAdmin } = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/permissionMiddleware");

// GET ACTIVITY LOGS
router.get("/", protect, managerOrAdmin, async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const allowedLimits = [10, 25, 50, 100];
    const requestedLimit = Number(req.query.limit) || 10;
    const limit = allowedLimits.includes(requestedLimit) ? requestedLimit : 10;
    const skip = (page - 1) * limit;
    const [logs, totalLogs] = await Promise.all([
      ActivityLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      ActivityLog.countDocuments(),
    ]);
    res.status(200).json({
      logs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalLogs / limit),
        totalLogs,
        limit,
      },
    });
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
