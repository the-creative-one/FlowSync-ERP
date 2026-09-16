const User = require("../models/User");

const permissionRooms = {
  canManageEmployees: "employees",
  canViewAdvancedAnalytics: "analytics",
  canExportReports: "reports",
  canAccessSettings: "settings",
};

const syncUserRooms = async (socket, user) => {
  socket.join(`user:${user._id}`);

  socket.join("orders");

  for (const [permission, room] of Object.entries(permissionRooms)) {
    if (user.permissions?.[permission]) {
      socket.join(room);
    } else {
      socket.leave(room);
    }
  }
};

const loadSocketUser = async (socket) => {
  const user = await User.findById(socket.user.id).select("-password").lean();
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
const refreshUserSocketRooms = async (io, userId) => {
  const User = require("../models/User");

  const user = await User.findById(userId).select("-password").lean();

  if (!user) {
    return;
  }

  const sockets = await io.in(`user:${userId}`).fetchSockets();

  for (const socket of sockets) {
    socket.user = user;

    await syncUserRooms(socket, user);
  }
};

module.exports = {
  syncUserRooms,
  loadSocketUser,
  refreshUserSocketRooms,
};
