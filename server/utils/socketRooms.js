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
  if (user.role === "admin") {
    socket.join("admins");
  } else {
    socket.leave("admins");
  }

  for (const [permission, room] of Object.entries(permissionRooms)) {
    if (user.permissions?.[permission]) {
      socket.join(room);
    } else {
      socket.leave(room);
    }
  }
};

const refreshUserSocketRooms = async (io, userId) => {
  const user = await User.findById(userId).select("-password").lean();
  if (!user) return;
  const sockets = await io.in(`user:${userId}`).fetchSockets();
  for (const socket of sockets) {
    socket.user = user;
    await syncUserRooms(socket, user);
  }
};

module.exports = {
  syncUserRooms,
  refreshUserSocketRooms,
};
