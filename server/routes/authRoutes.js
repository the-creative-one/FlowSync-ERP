const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const {
  registerUser,
  verifyEmail,
  resendVerificationCode,
  loginUser,
  forgotPassword,
  resetPassword,
  getMe,
} = require("../controllers/authController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many registration attempts. Please try again later.",
  },
});
// AUTH ROUTES

// Register
router.post("/register", registrationLimiter, registerUser);

// Email verification
router.post("/verify-email", verifyEmail);

// Resend verification code
router.post("/resend-verification", resendVerificationCode);

// Login
router.post("/login", loginUser);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password/:token", resetPassword);

// PROTECTED ROUTES

router.get("/me", protect, getMe);

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected profile route",
    user: req.user,
  });
});

router.get("/admin", protect, adminOnly, (req, res) => {
  res.json({
    message: "Welcome Admin",
  });
});

module.exports = router;
