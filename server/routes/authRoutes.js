const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getMe,
} = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
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
