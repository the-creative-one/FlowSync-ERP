const Order = require("../models/Order");

const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      status: "pending",
    });

    const deliveredOrders = await Order.countDocuments({
      status: "delivered",
    });

    const orders = await Order.find();

    const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);

    res.status(200).json({
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};
