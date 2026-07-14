const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: "",
    },

    companyEmail: {
      type: String,
      default: "",
    },

    companyPhone: {
      type: String,
      default: "",
    },

    companyAddress: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      default: "INR",
    },

    orderPrefix: {
      type: String,
      default: "ORD",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Settings", settingsSchema);
