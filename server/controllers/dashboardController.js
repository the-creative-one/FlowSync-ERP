const Order = require("../models/Order");

const getDashboardStats = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const startOfCurrentYear = new Date(currentYear, 0, 1);
    const startOfNextYear = new Date(currentYear + 1, 0, 1);

    const startOfPreviousYear = new Date(currentYear - 1, 0, 1);
    const startOfCurrentYearForPrevious = new Date(currentYear, 0, 1);

    // CURRENT YEAR STATS

    const currentYearOrders = await Order.find({
      createdAt: {
        $gte: startOfCurrentYear,
        $lt: startOfNextYear,
      },
    });

    const currentYearTotalOrders = currentYearOrders.length;

    const currentYearPendingOrders = currentYearOrders.filter(
      (order) => order.status?.toLowerCase() === "pending",
    ).length;

    const currentYearDeliveredOrders = currentYearOrders.filter(
      (order) => order.status?.toLowerCase() === "delivered",
    ).length;

    const currentYearRevenue = currentYearOrders.reduce(
      (total, order) => total + Number(order.amount || 0),
      0,
    );

    // PREVIOUS YEAR STATS

    const previousYearOrders = await Order.find({
      createdAt: {
        $gte: startOfPreviousYear,
        $lt: startOfCurrentYearForPrevious,
      },
    });

    const previousYearTotalOrders = previousYearOrders.length;

    const previousYearRevenue = previousYearOrders.reduce(
      (total, order) => total + Number(order.amount || 0),
      0,
    );

    // REVENUE GROWTH

    const revenueGrowth =
      previousYearRevenue > 0
        ? ((currentYearRevenue - previousYearRevenue) / previousYearRevenue) *
          100
        : null;

    res.status(200).json({
      currentYear: {
        totalOrders: currentYearTotalOrders,
        pendingOrders: currentYearPendingOrders,
        deliveredOrders: currentYearDeliveredOrders,
        totalRevenue: currentYearRevenue,
      },

      previousYear: {
        totalOrders: previousYearTotalOrders,
        totalRevenue: previousYearRevenue,
      },

      revenueGrowth,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
    });
  }
};

module.exports = {
  getDashboardStats,
};
