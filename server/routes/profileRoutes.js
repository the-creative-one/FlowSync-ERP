const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const uploadAvatar = require("../middleware/uploadAvatar");

const isStrongPassword = (password) =>
  typeof password === "string" &&
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /\d/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

// UPDATE NAME
router.put("/name", protect, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({
        message: "Name is required",
      });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    user.name = name.trim();
    await user.save();
    res.json({
      message: "Name updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        avatar: user.avatar,
        avatarType: user.avatarType,
        avatarSeed: user.avatarSeed,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to update name",
    });
  }
});

// CHANGE PASSWORD
router.put("/password", protect, async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All password fields are required",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New passwords do not match",
      });
    }
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }
    if (await bcrypt.compare(newPassword, user.password)) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to change password",
    });
  }
});

// UPLOAD AVATAR
router.post(
  "/avatar",
  protect,
  uploadAvatar.single("avatar"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.avatar = req.file.path;

      // Clear generated avatar
      user.avatarType = "";
      user.avatarSeed = "";

      await user.save();

      res.json({
        message: "Avatar updated successfully",
        avatar: user.avatar,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to upload avatar",
      });
    }
  },
);

// Delete Avatar

router.delete("/avatar", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.avatar = "";
    user.avatarType = "";
    user.avatarSeed = "";

    await user.save();

    res.json({
      message: "Avatar removed",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to remove avatar",
    });
  }
});

//
// SAVE GENERATED AVATAR
//

router.put("/avatar/generate", protect, async (req, res) => {
  try {
    const { avatarType, avatarSeed } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.avatar = "";
    user.avatarType = avatarType;
    user.avatarSeed = avatarSeed;

    await user.save();

    res.json({
      message: "Avatar generated successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to save avatar",
    });
  }
});

module.exports = router;
