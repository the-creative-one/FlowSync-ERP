const mongoose = require("mongoose");

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

const userSchema = new mongoose.Schema(
  {
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

   
    // EMAIL VERIFICATION
   

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

   
    // PASSWORD RESET
   

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },

   
    // USER ROLE
   

    role: {
      type: String,
      enum: ["admin", "manager", "employee", "operations", "analyst"],
      default: "employee",
    },

   
    // PERMISSIONS
   

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

   
    // AVATAR
   

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
