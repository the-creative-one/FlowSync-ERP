const express = require("express");

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

// AUTH ROUTES

// Register
router.post("/register", registerUser);

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
