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
  completeOnboarding,
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

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many login attempts. Please try again later.",
  },
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many password reset requests. Please try again later.",
  },
});

const verificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many verification attempts. Please try again later.",
  },
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many password reset attempts. Please try again later.",
  },
});

// AUTH ROUTES
// Register
router.post("/register", registrationLimiter, registerUser);

// Email verification
router.post("/verify-email", verificationLimiter, verifyEmail);
// Resend verification code
router.post(
  "/resend-verification",
  verificationLimiter,
  resendVerificationCode,
);

// Login
router.post("/login", loginLimiter, loginUser);

// Forgot password
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);

// Reset password
router.post("/reset-password/:token", resetPasswordLimiter, resetPassword);

// PROTECTED ROUTES
router.get("/me", protect, getMe);
router.patch("/onboarding", protect, completeOnboarding);
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
