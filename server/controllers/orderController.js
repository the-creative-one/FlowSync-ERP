const Order = require("../models/Order");
const logActivity = require("../utils/logActivity");
const Settings = require("../models/Settings");
const {
  emitOrderCreated,
  emitOrderUpdated,
  emitOrderDeleted,
} = require("../utils/socketEvents");

const createOrder = async (req, res) => {
  try {
    const { customerName, product, quantity, amount, status } = req.body;

    const settings = await Settings.findOne();

    const prefix = settings?.orderPrefix || "ORD";

    const lastOrder = await Order.findOne().sort({ createdAt: -1 });

    let nextNumber = 1001;

    if (lastOrder?.orderNumber) {
      const numericPart = parseInt(lastOrder.orderNumber.split("-")[1]);

      nextNumber = numericPart + 1;
    }

    const orderNumber = `${prefix}-${nextNumber}`;

    const order = await Order.create({
      orderNumber,
      customerName,
      product,
      quantity,
      amount,
      status,
      createdBy: req.user.id,
    });

    await logActivity({
      userId: req.user.id,
      userName: req.user.name,
      action: "Created Order",
      module: "Orders",
      details: order.orderNumber,
    });

    const io = req.app.get("io");
    emitOrderCreated(io, order);

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order",
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { status, customerName, product, quantity, amount } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }
    const oldStatus = order.status;
    // UPDATE FIELDS
    if (status !== undefined) {
      order.status = status;
    }

    if (customerName !== undefined) {
      order.customerName = customerName;
    }

    if (product !== undefined) {
      order.product = product;
    }

    if (quantity !== undefined) {
      order.quantity = quantity;
    }

    if (amount !== undefined) {
      order.amount = amount;
    }

    await order.save();

    const io = req.app.get("io");
    emitOrderUpdated(io, order);

    if (status !== undefined && status !== oldStatus) {
      await logActivity({
        userId: req.user.id,
        userName: req.user.name,
        action: "Updated Order Status",
        module: "Orders",
        details: `${order.orderNumber} → ${status}`,
      });
    } else {
      await logActivity({
        userId: req.user.id,
        userName: req.user.name,
        action: "Updated Order",
        module: "Orders",
        details: order.orderNumber,
      });
    }

    res.status(200).json({
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order",
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    await logActivity({
      userId: req.user.id,
      userName: req.user.name,
      action: "Deleted Order",
      module: "Orders",
      details: order.orderNumber,
    });

    await order.deleteOne();
    // Socket Update
    const io = req.app.get("io");

    emitOrderDeleted(io, order._id, order.orderNumber);

    res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete order",
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
};
