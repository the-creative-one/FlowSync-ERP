const express = require("express");

const router = express.Router();

const { createOrder, getOrders, updateOrderStatus, deleteOrder } = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.patch("/:id", protect, updateOrderStatus);
router.delete("/:id", protect, adminOnly, deleteOrder);

module.exports = router;
