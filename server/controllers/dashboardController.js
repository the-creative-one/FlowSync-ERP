const Order = require("../models/Order");

const getDashboardStats = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear + 1, 0, 1);

    console.log("Current Year:", currentYear);
    console.log("Start Of Year:", startOfYear);
    console.log("End Of Year:", endOfYear);

    //
    // CURRENT YEAR STATS
    //

    const currentYearOrders = await Order.find({
      createdAt: {
        $gte: startOfYear,
        $lt: endOfYear,
      },
    });
    console.log("Orders Found:", currentYearOrders.length);

    if (currentYearOrders.length > 0) {
      console.log("First Order Date:", currentYearOrders[0].createdAt);
    }

    const totalOrders = currentYearOrders.length;

    const pendingOrders = currentYearOrders.filter(
      (order) => order.status === "pending",
    ).length;

    const deliveredOrders = currentYearOrders.filter(
      (order) => order.status === "delivered",
    ).length;

    const totalRevenue = currentYearOrders.reduce(
      (total, order) => total + Number(order.amount || 0),
      0,
    );

    //
    // LIFETIME STATS
    //

    const lifetimeOrders = await Order.find();

    const lifetimeRevenue = lifetimeOrders.reduce(
      (total, order) => total + Number(order.amount || 0),
      0,
    );

    res.status(200).json({
      currentYear: {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue,
      },

      lifetime: {
        totalOrders: lifetimeOrders.length,
        totalRevenue: lifetimeRevenue,
      },
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
