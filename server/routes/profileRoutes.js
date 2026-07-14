const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const uploadAvatar = require("../middleware/uploadAvatar");

//
// UPLOAD AVATAR
//

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
