// User model that stores user accounts, roles, permissions, email verification, password reset, and avatar data.

const mongoose = require("mongoose");

// Permission schema for controlling what each user can access or modify.
const permissionSchema = new mongoose.Schema(
  {
    canCreateOrders: {
      type: Boolean,
      default: false,
    },

    canUpdateOrders: {
      type: Boolean,
      default: false,
    },

    canDeleteOrders: {
      type: Boolean,
      default: false,
    },

    canManageEmployees: {
      type: Boolean,
      default: false,
    },

    canViewAdvancedAnalytics: {
      type: Boolean,
      default: false,
    },

    canExportReports: {
      type: Boolean,
      default: false,
    },

    canAccessSettings: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

// User schema.
const userSchema = new mongoose.Schema(
  {
    // Basic user information.
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Email verification information.
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationCode: {
      type: String,
    },

    emailVerificationExpire: {
      type: Date,
    },

    // Stores when the latest verification code was sent.
    emailVerificationLastSentAt: {
      type: Date,
    },

    // Counts verification code sends within the current limit period.
    emailVerificationSendCount: {
      type: Number,
      default: 0,
    },

    // Stores when the current verification send limit period ends.
    emailVerificationSendCountResetAt: {
      type: Date,
    },

    // Password reset information.
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },

    // User role.
    role: {
      type: String,
      enum: ["admin", "manager", "employee", "operations", "analyst"],
      default: "employee",
    },
    // User permissions.
    permissions: {
      type: permissionSchema,

      default: () => ({
        canCreateOrders: false,
        canUpdateOrders: false,
        canDeleteOrders: false,
        canManageEmployees: false,
        canViewAdvancedAnalytics: false,
        canExportReports: false,
        canAccessSettings: false,
      }),
    },
    hasCompletedOnboarding: {
      type: Boolean,
      default: false,
    },
    // User avatar information.
    avatar: {
      type: String,
      default: "",
    },

    avatarType: {
      type: String,
      default: "",
    },

    avatarSeed: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
