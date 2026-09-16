const express = require("express");
const router = express.Router();

const Settings = require("../models/Settings");
const { protect } = require("../middleware/authMiddleware");
const logActivity = require("../utils/logActivity");
const { checkPermission } = require("../middleware/permissionMiddleware");

// GET SETTINGS
router.get(
  "/",
  protect,
  checkPermission("canAccessSettings"),
  async (req, res) => {
    try {
      let settings = await Settings.findOne();

      if (!settings) {
        settings = await Settings.create({});
      }

      res.json(settings);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to fetch settings",
      });
    }
  },
);

// UPDATE SETTINGS
router.put("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admins can update settings",
      });
    }

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    const {
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      currency,
      orderPrefix,
    } = req.body;

    if (
      !companyName?.trim() ||
      !companyEmail?.trim() ||
      !companyPhone?.trim() ||
      !companyAddress?.trim() ||
      !currency?.trim() ||
      !orderPrefix?.trim()
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    settings.companyName = companyName;
    settings.companyEmail = companyEmail;
    settings.companyPhone = companyPhone;
    settings.companyAddress = companyAddress;
    settings.currency = currency;
    settings.orderPrefix = orderPrefix;

    await settings.save();

    await logActivity({
      userId: req.user._id,
      userName: req.user.name,
      action: "Updated Settings",
      module: "Settings",
      details: "Updated company/business settings",
    });

    res.json({
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update settings",
    });
  }
});

module.exports = router;
