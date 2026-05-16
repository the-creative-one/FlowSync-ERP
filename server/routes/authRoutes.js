const express = require("express");

const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
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
