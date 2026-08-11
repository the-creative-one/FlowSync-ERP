// Main server file that starts Express, connects MongoDB, and sets up Socket.IO.

require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { Server } = require("socket.io");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const profileRoutes = require("./routes/profileRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");

const app = express();

//Connect to MongoDB

connectDB();

//Configure CORS

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

//Configure middleware

app.use(express.json());
app.use(morgan("dev"));

//Create basic API route

app.get("/", (req, res) => {
  res.send("FlowSync ERP API Running...");
});

//Authentication routes

app.use("/api/auth", authRoutes);

//Order routes

app.use("/api/orders", orderRoutes);

//Dashboard routes

app.use("/api/dashboard", dashboardRoutes);

//Employee routes

app.use("/api/employees", employeeRoutes);

//Analytics routes

app.use("/api/analytics", analyticsRoutes);

//Profile routes

app.use("/api/profile", profileRoutes);

//Settings routes

app.use("/api/settings", settingsRoutes);

//Activity log routes

app.use("/api/activity-logs", activityLogRoutes);

//Serve uploaded files

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Create HTTP server

const server = http.createServer(app);

//Create Socket.IO server

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

//Handle Socket.IO connections

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

//Start server

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
