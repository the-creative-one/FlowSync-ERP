const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/permissionMiddleware");

// GET ORDERS
router.get("/", protect, getOrders);
// CREATE ORDER
router.post("/", protect, checkPermission("canCreateOrders"), createOrder);
// UPDATE ORDER STATUS
router.patch(
  "/:id",
  protect,
  checkPermission("canUpdateOrders"),
  updateOrderStatus,
);
// DELETE ORDER
router.delete("/:id", protect, checkPermission("canDeleteOrders"), deleteOrder);

module.exports = router;
