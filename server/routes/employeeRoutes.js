const express = require("express");

const router = express.Router();

const User = require("../models/User");

const {
  protect,
  managerOrAdmin,
} = require("../middleware/authMiddleware");

//
// GET ALL EMPLOYEES
//

router.get(
  "/",
  protect,
  managerOrAdmin,
  async (req, res) => {
    try {
      const users = await User.find().select(
        "-password"
      );

      res.json(users);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch employees",
      });
    }
  }
);

//
// UPDATE USER ROLE
//

router.put(
  "/:id/role",
  protect,
  managerOrAdmin,
  async (req, res) => {
    try {
      const { role } = req.body;

      const targetUser = await User.findById(
        req.params.id
      );

      if (!targetUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      //
      // CANNOT MODIFY YOURSELF
      //

      if (
        targetUser._id.toString() ===
        req.user._id.toString()
      ) {
        return res.status(403).json({
          message:
            "You cannot modify your own role",
        });
      }

      //
      // MANAGER RESTRICTIONS
      //

      if (req.user.role === "manager") {
        //
        // MANAGER CANNOT MODIFY ADMIN/MANAGER
        //

        if (
          targetUser.role === "admin" ||
          targetUser.role === "manager"
        ) {
          return res.status(403).json({
            message:
              "Managers cannot modify Admin or Manager accounts",
          });
        }

        //
        // MANAGER CAN ASSIGN ONLY THESE ROLES
        //

        const allowedRoles = [
          "operations",
          "analyst",
          "employee",
        ];

        if (!allowedRoles.includes(role)) {
          return res.status(403).json({
            message:
              "Managers can only assign Operations, Analyst, or Employee roles",
          });
        }
      }

      //
      // UPDATE ROLE
      //

      targetUser.role = role;

      await targetUser.save();

      const updatedUser =
        await User.findById(
          req.params.id
        ).select("-password");

      res.json({
        message: "Role updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to update role",
        error: error.message,
      });
    }
  }
);

//
// UPDATE USER PERMISSIONS
//

router.put(
  "/:id/permissions",
  protect,
  managerOrAdmin,
  async (req, res) => {
    try {
      const permissions = req.body;

      const targetUser = await User.findById(
        req.params.id
      );

      if (!targetUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      //
      // CANNOT MODIFY YOURSELF
      //

      if (
        targetUser._id.toString() ===
        req.user._id.toString()
      ) {
        return res.status(403).json({
          message:
            "You cannot modify your own permissions",
        });
      }

      //
      // MANAGER RESTRICTIONS
      //

      if (req.user.role === "manager") {
        //
        // MANAGER CANNOT MODIFY ADMIN/MANAGER
        //

        if (
          targetUser.role === "admin" ||
          targetUser.role === "manager"
        ) {
          return res.status(403).json({
            message:
              "Managers cannot modify Admin or Manager accounts",
          });
        }

        //
        // MANAGER CANNOT GIVE SETTINGS ACCESS
        //

        if (
          permissions.canAccessSettings !==
          undefined
        ) {
          return res.status(403).json({
            message:
              "Managers cannot assign Settings access",
          });
        }
      }

      //
      // UPDATE PERMISSIONS
      //

      Object.keys(permissions).forEach(
        (key) => {
          targetUser.permissions[key] =
            permissions[key];
        }
      );

      //
      // IMPORTANT
      //

      targetUser.markModified("permissions");

      await targetUser.save();

      const updatedUser =
        await User.findById(
          req.params.id
        ).select("-password");

      res.json({
        message:
          "Permissions updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Failed to update permissions",
        error: error.message,
      });
    }
  }
);

module.exports = router;