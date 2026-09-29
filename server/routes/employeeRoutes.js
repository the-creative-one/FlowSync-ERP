const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");
const PermissionRequest = require("../models/PermissionRequest");
const AuditLog = require("../models/AuditLog");
const { protect, managerOrAdmin } = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");
const { permissionRequestEmailTemplate } = require("../utils/emailTemplates");
const {
  emitEmployeeCreated,
  emitEmployeeDeleted,
  emitEmployeeRoleChanged,
  emitEmployeePermissionsChanged,
  emitEmployeePermissionsNotification,
  emitPermissionRequestCreated,
  emitPermissionRequestApproved,
  emitPermissionRequestRejected,
} = require("../utils/socketEvents");

const {
  refreshUserSocketRooms,
  disconnectUserSockets,
} = require("../utils/socketRooms");

const allowedPermissions = [
  "canCreateOrders",
  "canUpdateOrders",
  "canDeleteOrders",
  "canManageEmployees",
  "canViewAdvancedAnalytics",
  "canExportReports",
  "canAccessSettings",
];
const generateTemporaryPassword = () => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*";

  const getRandom = (characters) =>
    characters[Math.floor(Math.random() * characters.length)];

  const requiredCharacters = [
    getRandom(uppercase),
    getRandom(lowercase),
    getRandom(numbers),
    getRandom(special),
  ];

  const allCharacters = uppercase + lowercase + numbers + special;

  for (let i = requiredCharacters.length; i < 10; i++) {
    requiredCharacters.push(getRandom(allCharacters));
  }

  return requiredCharacters.sort(() => Math.random() - 0.5).join("");
};

// GET ALL EMPLOYEES
router.get("/", protect, managerOrAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch employees",
    });
  }
});

// UPDATE USER ROLE
router.put("/:id/role", protect, managerOrAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = [
      "admin",
      "manager",
      "operations",
      "analyst",
      "employee",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // CANNOT MODIFY YOURSELF
    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(403).json({
        message: "You cannot modify your own role",
      });
    }

    // MANAGER RESTRICTIONS
    if (req.user.role === "manager") {
      // MANAGER CANNOT MODIFY ADMIN/MANAGER
      if (targetUser.role === "admin" || targetUser.role === "manager") {
        return res.status(403).json({
          message: "Managers cannot modify Admin or Manager accounts",
        });
      }

      // MANAGER CAN ASSIGN ONLY THESE ROLES
      const allowedRoles = ["operations", "analyst", "employee"];
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({
          message:
            "Managers can only assign Operations, Analyst, or Employee roles",
        });
      }
    }
    // UPDATE ROLE
    const oldRole = targetUser.role;
    targetUser.role = role;
    await targetUser.save();
    await AuditLog.create({
      userId: req.user._id,
      action: "ROLE_UPDATED",
      details: `${targetUser.name} role changed to ${role}`,
    });
    const updatedUser = await User.findById(req.params.id).select("-password");
    const io = req.app.get("io");
    emitEmployeeRoleChanged(io, updatedUser, oldRole, req.user._id.toString());
    await refreshUserSocketRooms(io, updatedUser._id);
    res.json({
      message: "Role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to update role",
    });
  }
});

// UPDATE USER PERMISSIONS
router.put("/:id/permissions", protect, managerOrAdmin, async (req, res) => {
  try {
    const permissions = {};
    for (const key of allowedPermissions) {
      if (req.body[key] !== undefined) {
        if (typeof req.body[key] !== "boolean") {
          return res.status(400).json({
            message: `${key} must be a boolean`,
          });
        }
        permissions[key] = req.body[key];
      }
    }
    if (Object.keys(permissions).length === 0) {
      return res.status(400).json({
        message: "No valid permissions provided",
      });
    }
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // CANNOT MODIFY YOURSELF
    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(403).json({
        message: "You cannot modify your own permissions",
      });
    }
    // MANAGER RESTRICTIONS
    if (req.user.role === "manager") {
      // MANAGER CANNOT MODIFY ADMIN/MANAGER
      if (targetUser.role === "admin" || targetUser.role === "manager") {
        return res.status(403).json({
          message: "Managers cannot modify Admin or Manager accounts",
        });
      }
      // MANAGER CANNOT GIVE SETTINGS ACCESS
      if (permissions.canAccessSettings !== undefined) {
        return res.status(403).json({
          message: "Managers cannot assign Settings access",
        });
      }
    }
    // UPDATE PERMISSIONS
    Object.keys(permissions).forEach((key) => {
      targetUser.permissions[key] = permissions[key];
    });
    targetUser.markModified("permissions");
    await targetUser.save();
    await AuditLog.create({
      userId: req.user._id,
      action: "PERMISSIONS_UPDATED",
      details: `Updated permissions for ${targetUser.name}`,
    });
    const updatedUser = await User.findById(req.params.id).select("-password");
    const io = req.app.get("io");
    emitEmployeePermissionsChanged(io, updatedUser);
    emitEmployeePermissionsNotification(
      io,
      updatedUser,
      req.user._id.toString(),
    );
    await refreshUserSocketRooms(io, updatedUser._id);
    res.json({
      message: "Permissions updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to update permissions",
    });
  }
});

// CREATE USER
router.post("/create", protect, managerOrAdmin, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    // VALIDATION
    if (!name || !email || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    // EXISTING USER
    const existingUser = await User.findOne({
      email,
    });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    // ROLE RESTRICTIONS
    if (req.user.role === "manager") {
      const allowedRoles = ["operations", "analyst", "employee"];
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({
          message:
            "Managers can only create Operations, Analyst or Employee accounts",
        });
      }
    }
    // PASSWORD
    const temporaryPassword = generateTemporaryPassword();

    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
    // ROLE DEFAULT PERMISSIONS
    let permissions = {
      canCreateOrders: false,
      canUpdateOrders: false,
      canDeleteOrders: false,
      canManageEmployees: false,
      canViewAdvancedAnalytics: false,
      canExportReports: false,
      canAccessSettings: false,
    };
    if (role === "employee") {
      permissions = {
        canCreateOrders: false,
        canUpdateOrders: false,
        canDeleteOrders: false,
        canManageEmployees: false,
        canViewAdvancedAnalytics: false,
        canExportReports: false,
        canAccessSettings: false,
      };
    }
    if (role === "operations") {
      permissions = {
        canCreateOrders: true,
        canUpdateOrders: true,
        canDeleteOrders: false,
        canManageEmployees: false,
        canViewAdvancedAnalytics: false,
        canExportReports: false,
        canAccessSettings: false,
      };
    }
    if (role === "analyst") {
      permissions = {
        canCreateOrders: false,
        canUpdateOrders: false,
        canDeleteOrders: false,
        canManageEmployees: false,
        canViewAdvancedAnalytics: true,
        canExportReports: true,
        canAccessSettings: false,
      };
    }
    if (role === "manager") {
      permissions = {
        canCreateOrders: true,
        canUpdateOrders: true,
        canDeleteOrders: true,
        canManageEmployees: true,
        canViewAdvancedAnalytics: true,
        canExportReports: true,
        canAccessSettings: true,
      };
    }
    if (role === "admin") {
      permissions = {
        canCreateOrders: true,
        canUpdateOrders: true,
        canDeleteOrders: true,
        canManageEmployees: true,
        canViewAdvancedAnalytics: true,
        canExportReports: true,
        canAccessSettings: true,
      };
    }
    // CREATE USER
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      permissions,
      isEmailVerified: true,
    });
    const createdUser = await User.findById(user._id).select("-password");
    await AuditLog.create({
      userId: req.user._id,
      action: "USER_CREATED",
      details: `Created user ${user.name} (${user.role})`,
    });
    const io = req.app.get("io");
    emitEmployeeCreated(io, createdUser, req.user._id.toString());
    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        temporaryPassword,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create user",
    });
  }
});

// REQUEST PERMISSION
router.post("/requests", protect, async (req, res) => {
  try {
    const { permissionKey } = req.body;

    if (!permissionKey) {
      return res.status(400).json({
        message: "Permission is required",
      });
    }
    // SETTINGS ACCESS CAN ONLY BE GRANTED BY ADMIN
    if (permissionKey === "canAccessSettings") {
      return res.status(403).json({
        message: "Settings access cannot be requested",
      });
    }
    // EXISTING PENDING REQUEST
    const existingRequest = await PermissionRequest.findOne({
      employeeId: req.user._id,
      permissionKey,
      status: "pending",
    });
    if (existingRequest) {
      return res.status(400).json({
        message: "Request already pending",
      });
    }
    const request = await PermissionRequest.create({
      employeeId: req.user._id,
      permissionKey,
    });
    const employee = await User.findById(req.user._id).select(
      "name email role avatar avatarType avatarSeed",
    );
    await sendEmail({
      to: process.env.PERMISSION_REQUEST_ADMIN_EMAIL,
      subject: `New Permission Request from ${employee.name}`,
      html: permissionRequestEmailTemplate({
        employeeName: employee.name,
        employeeEmail: employee.email,
        permissionName: permissionKey,
      }),
    });
    const io = req.app.get("io");
    emitPermissionRequestCreated(io, request, employee);
    res.status(201).json({
      message: "Permission request submitted",
      request,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create request",
    });
  }
});

// GET PERMISSION REQUESTS
router.get("/requests", protect, async (req, res) => {
  try {
    let query = {};
    const isManagerOrAdmin =
      req.user.role === "admin" || req.user.role === "manager";
    // Team requests are only available to managers/admins
    if (req.query.scope === "team") {
      if (!isManagerOrAdmin) {
        return res.status(403).json({
          message: "Only managers and admins can view team requests",
        });
      }
    } else {
      // Default = only the logged-in user's requests
      query.employeeId = req.user._id;
    }
    const requests = await PermissionRequest.find(query)
      .populate("employeeId", "name email role avatar avatarType avatarSeed")
      .sort({
        createdAt: -1,
      });
    res.json(requests);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch requests",
    });
  }
});

// APPROVE REQUEST
router.put(
  "/requests/:id/approve",
  protect,
  managerOrAdmin,
  async (req, res) => {
    try {
      const request = await PermissionRequest.findById(req.params.id);
      if (!request) {
        return res.status(404).json({
          message: "Request not found",
        });
      }
      if (request.status !== "pending") {
        return res.status(400).json({
          message: "Request already processed",
        });
      }
      // FIND USER
      const user = await User.findById(request.employeeId);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      // MANAGER RESTRICTIONS
      if (req.user.role === "manager") {
        if (
          request.permissionKey === "canAccessSettings" ||
          request.permissionKey === "canManageEmployees"
        ) {
          return res.status(403).json({
            message: "Managers cannot approve this permission",
          });
        }
      }
      // GRANT PERMISSION
      user.permissions[request.permissionKey] = true;
      user.markModified("permissions");
      await user.save();
      // UPDATE REQUEST
      request.status = "approved";
      request.reviewedBy = req.user._id;
      request.reviewedAt = new Date();
      await request.save();
      await AuditLog.create({
        userId: req.user._id,
        action: "PERMISSION_APPROVED",
        details: `Approved ${request.permissionKey} for ${user.name}`,
      });
      const updatedUser = await User.findById(user._id).select("-password");
      const io = req.app.get("io");
      emitPermissionRequestApproved(
        io,
        request,
        updatedUser,
        req.user._id.toString(),
      );
      emitEmployeePermissionsChanged(io, updatedUser);
      await refreshUserSocketRooms(io, updatedUser._id.toString());
      res.json({
        message: "Permission approved successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Failed to approve request",
      });
    }
  },
);

// REJECT REQUEST
router.put(
  "/requests/:id/reject",
  protect,
  managerOrAdmin,
  async (req, res) => {
    try {
      const request = await PermissionRequest.findById(req.params.id);
      if (!request) {
        return res.status(404).json({
          message: "Request not found",
        });
      }
      if (request.status !== "pending") {
        return res.status(400).json({
          message: "Request already processed",
        });
      }
      request.status = "rejected";
      request.reviewedBy = req.user._id;
      request.reviewedAt = new Date();
      await request.save();
      const employee = await User.findById(request.employeeId);
      await AuditLog.create({
        userId: req.user._id,
        action: "PERMISSION_REJECTED",
        details: `Rejected ${request.permissionKey} for ${employee.name}`,
      });
      const io = req.app.get("io");
      emitPermissionRequestRejected(
        io,
        request,
        employee,
        req.user._id.toString(),
      );
      res.json({
        message: "Request rejected successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Failed to reject request",
      });
    }
  },
);

// GET AUDIT LOGS
router.get("/audit-logs", protect, managerOrAdmin, async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("userId", "name role")
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(logs);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch audit logs",
    });
  }
});

// DELETE USER
router.delete("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admins can delete users",
      });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(403).json({
        message: "You cannot delete your own account",
      });
    }
    await User.findByIdAndDelete(req.params.id);
    const io = req.app.get("io");
    await disconnectUserSockets(io, req.params.id);
    emitEmployeeDeleted(io, req.params.id, req.user._id);
    await AuditLog.create({
      userId: req.user._id,
      action: "USER_DELETED",
      details: `Deleted user ${user.name} (${user.role})`,
    });
    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to delete user",
    });
  }
});

module.exports = router;
