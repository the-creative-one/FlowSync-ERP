const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect Routes
const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization Header
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No Token
    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get User
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token failed",
    });
  }
};

// Optional Authentication
const optionalProtect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    // No token = guest user
    if (!token) {
      return next();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    // Invalid/expired token = continue as guest
    next();
  }
};

// Admin Only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      message: "Admin access only",
    });
  }
};

// Admin + Manager
const managerOrAdmin = (req, res, next) => {
  if (req.user && ["admin", "manager"].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({
      message: "Manager/Admin access only",
    });
  }
};

// Permission Middleware
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (req.user?.permissions?.[permission]) {
      next();
    } else {
      res.status(403).json({
        message: "Permission denied",
      });
    }
  };
};

module.exports = {
  protect,
  optionalProtect,
  adminOnly,
  managerOrAdmin,
  checkPermission,
};
