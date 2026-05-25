const Order = require("../models/Order");

const getAnalytics = async (req, res) => {
  try {
    // TOTAL ORDERS
    const totalOrders = await Order.countDocuments();
    // TOTAL REVENUE
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    // STATUS COUNTS
    const pendingOrders = await Order.countDocuments({
      status: "pending",
    });

    const processingOrders = await Order.countDocuments({
      status: "processing",
    });

    const shippedOrders = await Order.countDocuments({
      status: "shipped",
    });

    const deliveredOrders = await Order.countDocuments({
      status: "delivered",
    });
    // MONTHLY REVENUE
    const monthlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },

          revenue: {
            $sum: "$amount",
          },
        },
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);
    // RECENT ORDERS
    const recentOrders = await Order.find()
      .sort({
        createdAt: -1,
      })
      .limit(50);
    // RESPONSE
    res.json({
      totalOrders,
      totalRevenue,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      monthlyRevenue,
      recentOrders,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch analytics",
    });
  }
};

module.exports = {
  getAnalytics,
};
