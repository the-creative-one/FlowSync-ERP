const ActivityLog = require("../models/ActivityLog");

const logActivity = async ({
  userId,
  userName,
  action,
  module,
  details = "",
}) => {
  try {
    await ActivityLog.create({
      userId,
      userName,
      action,
      module,
      details,
    });
  } catch (error) {
    console.log("Activity Log Error:", error.message);
  }
};

module.exports = logActivity;