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

    //
    // CURRENT MONTH REVENUE
    //

    const currentDate = new Date();

    const currentMonth = currentDate.getMonth() + 1;

    const currentYear = currentDate.getFullYear();

    const currentMonthRevenueResult = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(currentYear, currentMonth - 1, 1),

            $lt: new Date(currentYear, currentMonth, 1),
          },
        },
      },

      {
        $group: {
          _id: null,

          revenue: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const currentMonthRevenue = currentMonthRevenueResult[0]?.revenue || 0;

    //
    // PREVIOUS MONTH REVENUE
    //

    const previousMonthRevenueResult = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(currentYear, currentMonth - 2, 1),

            $lt: new Date(currentYear, currentMonth - 1, 1),
          },
        },
      },

      {
        $group: {
          _id: null,

          revenue: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const previousMonthRevenue = previousMonthRevenueResult[0]?.revenue || 0;

    //
    // AVERAGE ORDER VALUE
    //

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    //
    // HIGHEST ORDER VALUE
    //

    const highestOrder = await Order.findOne()
      .sort({
        amount: -1,
      })
      .select("amount");

    //
    // TOP STATUS
    //

    const topStatusResult = await Order.aggregate([
      {
        $group: {
          _id: "$status",

          count: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          count: -1,
        },
      },

      {
        $limit: 1,
      },
    ]);

    const topStatus = topStatusResult[0]?._id || "N/A";

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
      currentMonthRevenue,
      previousMonthRevenue,
      averageOrderValue,
      highestOrderValue: highestOrder?.amount || 0,
      topStatus,
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
