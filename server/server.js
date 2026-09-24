// Main server file that starts Express, connects MongoDB, and sets up Socket.IO.

require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { Server } = require("socket.io");
const path = require("path");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const profileRoutes = require("./routes/profileRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const User = require("./models/User");
const { syncUserRooms } = require("./utils/socketRooms");

const app = express();
// Connect to MongoDB
connectDB();
// Configure CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
// Configure middleware
app.use(express.json());
app.use(morgan("dev"));

// Basic API route
app.get("/", (req, res) => {
  res.send("FlowSync API Running...");
});

// Authentication routes
app.use("/api/auth", authRoutes);
// Order routes
app.use("/api/orders", orderRoutes);
// Dashboard routes
app.use("/api/dashboard", dashboardRoutes);
// Employee routes
app.use("/api/employees", employeeRoutes);
// Analytics routes
app.use("/api/analytics", analyticsRoutes);
// Profile routes
app.use("/api/profile", profileRoutes);
// Settings routes
app.use("/api/settings", settingsRoutes);
// Activity log routes
app.use("/api/activity-logs", activityLogRoutes);
// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/chatbot", chatbotRoutes);
// Create HTTP server
const server = http.createServer(app);
// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
app.set("io", io);
// Socket authentication
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("Authentication required"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      return next(new Error("Invalid authentication token"));
    }
    const user = await User.findById(decoded.id).select("-password").lean();
    if (!user) {
      return next(new Error("User not found"));
    }
    socket.user = user;
    next();
  } catch (error) {
    next(new Error("Invalid or expired token"));
  }
});

// Handle Socket.IO connections
io.on("connection", async (socket) => {
  try {
    // Private room for this specific user.
    socket.join(`user:${socket.user._id}`);
    // Join permission-based rooms.
    await syncUserRooms(socket, socket.user);
  } catch (error) {
    socket.disconnect(true);
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    message:
      err.status && err.status < 500
        ? err.message
        : "Something went wrong on the server. Please try again later.",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
