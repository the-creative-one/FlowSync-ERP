import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { ChevronLeft, ChevronRight, Download } from "lucide-react";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Analytics() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    monthlyRevenue: [],
    recentOrders: [],
  });

  const [activeFilter, setActiveFilter] = useState("ytd");

  //
  // PAGINATION
  //

  const [currentPage, setCurrentPage] = useState(1);

  const ORDERS_PER_PAGE = 10;

  //
  // FETCH ANALYTICS
  //

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats({
        totalOrders: response.data.totalOrders || 0,
        totalRevenue: response.data.totalRevenue || 0,
        pendingOrders: response.data.pendingOrders || 0,
        processingOrders: response.data.processingOrders || 0,
        shippedOrders: response.data.shippedOrders || 0,
        deliveredOrders: response.data.deliveredOrders || 0,
        monthlyRevenue: response.data.monthlyRevenue || [],
        recentOrders: response.data.recentOrders || [],
      });
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  //
  // RESET PAGE ON FILTER CHANGE
  //

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  //
  // FORMATTERS
  //

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  //
  // MONTH LABELS
  //

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  //
  // FILTERS
  //

  const filters = [
    {
      label: "Year to Date",
      value: "ytd",
    },

    {
      label: "Last Year",
      value: "lastYear",
    },

    {
      label: "Month to Date",
      value: "mtd",
    },

    {
      label: "Last Month",
      value: "lastMonth",
    },
  ];

  //
  // FILTERED REVENUE DATA
  //

  const revenueData = useMemo(() => {
    const currentDate = new Date();

    const currentYear = currentDate.getFullYear();

    const currentMonth = currentDate.getMonth() + 1;

    let filteredData = [...(stats?.monthlyRevenue || [])];

    if (activeFilter === "ytd") {
      filteredData = filteredData.filter(
        (item) => item?._id?.year === currentYear,
      );
    }

    if (activeFilter === "lastYear") {
      filteredData = filteredData.filter(
        (item) => item?._id?.year === currentYear - 1,
      );
    }

    if (activeFilter === "mtd") {
      filteredData = filteredData.filter(
        (item) =>
          item?._id?.year === currentYear && item?._id?.month === currentMonth,
      );
    }

    if (activeFilter === "lastMonth") {
      filteredData = filteredData.filter((item) => {
        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;

        const previousMonthYear =
          currentMonth === 1 ? currentYear - 1 : currentYear;

        return (
          item?._id?.year === previousMonthYear &&
          item?._id?.month === previousMonth
        );
      });
    }

    return filteredData.map((item) => ({
      month: monthNames[(item?._id?.month || 1) - 1],
      revenue: item?.revenue || 0,
    }));
  }, [stats.monthlyRevenue, activeFilter]);

  //
  // FILTERED ORDERS
  //

  const filteredOrders = useMemo(() => {
    const currentDate = new Date();

    const currentYear = currentDate.getFullYear();

    const currentMonth = currentDate.getMonth() + 1;

    let orders = [...(stats?.recentOrders || [])];

    if (activeFilter === "ytd") {
      orders = orders.filter(
        (order) => new Date(order.createdAt).getFullYear() === currentYear,
      );
    }

    if (activeFilter === "lastYear") {
      orders = orders.filter(
        (order) => new Date(order.createdAt).getFullYear() === currentYear - 1,
      );
    }

    if (activeFilter === "mtd") {
      orders = orders.filter((order) => {
        const date = new Date(order.createdAt);

        return (
          date.getFullYear() === currentYear &&
          date.getMonth() + 1 === currentMonth
        );
      });
    }

    if (activeFilter === "lastMonth") {
      orders = orders.filter((order) => {
        const date = new Date(order.createdAt);

        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;

        const previousMonthYear =
          currentMonth === 1 ? currentYear - 1 : currentYear;

        return (
          date.getFullYear() === previousMonthYear &&
          date.getMonth() + 1 === previousMonth
        );
      });
    }

    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [stats.recentOrders, activeFilter]);

  //
  // FILTERED TOP CARDS
  //

  const filteredRevenue = filteredOrders.reduce(
    (acc, order) => acc + order.amount,
    0,
  );

  const deliveredCount = filteredOrders.filter(
    (order) => order.status === "delivered",
  ).length;

  const pendingCount = filteredOrders.filter(
    (order) => order.status === "pending",
  ).length;

  //
  // PIE CHART
  //

  const orderStatusData = [
    {
      name: "Pending",
      value: pendingCount,
      color: "#EAB308",
    },

    {
      name: "Processing",
      value: filteredOrders.filter((order) => order.status === "processing")
        .length,
      color: "#2563EB",
    },

    {
      name: "Shipped",
      value: filteredOrders.filter((order) => order.status === "shipped")
        .length,
      color: "#9333EA",
    },

    {
      name: "Delivered",
      value: deliveredCount,
      color: "#16A34A",
    },
  ];

  //
  // PAGINATION
  //

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;

  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ORDERS_PER_PAGE,
  );
  //
  // EXPORT EXCEL
  //

  const exportOrders = () => {
    //
    // NO DATA CHECK
    //

    if (!filteredOrders.length) {
      alert("No orders available to export.");

      return;
    }

    //
    // EXPORT DATA
    //

    const exportData = filteredOrders.map((order) => ({
      Customer: order.customerName,

      Product: order.product,

      Amount: order.amount,

      Status: order.status,

      OrderedOn: formatDate(order.createdAt),

      UpdatedOn: formatDate(order.updatedAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(data, `orders-${activeFilter}.xlsx`);
  };

  return (
    <DashboardLayout
      title="Analytics Dashboard"
      subtitle="Track revenue, order flow and business performance"
    >
      <div className="space-y-6">
        {/* TOP CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Revenue</p>

            <h2 className="text-2xl md:text-3xl font-bold text-[#1D546C] mt-2">
              ₹{formatCurrency(filteredRevenue)}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Orders</p>

            <h2 className="text-2xl md:text-3xl font-bold text-[#0C2B4E] mt-2">
              {filteredOrders.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Delivered Orders</p>

            <h2 className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
              {deliveredCount}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Pending Orders</p>

            <h2 className="text-2xl md:text-3xl font-bold text-yellow-500 mt-2">
              {pendingCount}
            </h2>
          </div>
        </div>
        {/* CHART SECTION */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* REVENUE CHART */}

          <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-gray-100 xl:col-span-2 overflow-hidden">
            {/* HEADER */}

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[#0C2B4E]">
                  Revenue Timeline
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Revenue insights based on selected timeline
                </p>
              </div>

              {/* FILTERS */}

              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap
                    ${
                      activeFilter === filter.value
                        ? "bg-[#0C2B4E] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }
                  `}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DESKTOP CHART */}

            <div className="hidden md:block w-full h-[380px]">
              {revenueData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 10,
                    }}
                    barCategoryGap={20}
                  >
                    <XAxis
                      dataKey="month"
                      tick={{
                        fontSize: 12,
                        fill: "#6B7280",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      tickFormatter={(value) =>
                        `₹${(value / 1000).toFixed(0)}k`
                      }
                      tick={{
                        fontSize: 12,
                        fill: "#6B7280",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      cursor={{
                        fill: "transparent",
                      }}
                      formatter={(value) => [
                        `₹${formatCurrency(value)}`,
                        "Revenue",
                      ]}
                    />

                    <Bar
                      dataKey="revenue"
                      fill="#1D546C"
                      radius={[12, 12, 0, 0]}
                      activeBar={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-400 text-lg font-medium">
                    No revenue data available
                  </p>
                </div>
              )}
            </div>

            {/* MOBILE HORIZONTAL CHART */}

            <div className="md:hidden w-full h-[420px]">
              {revenueData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={revenueData}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 10,
                      bottom: 10,
                    }}
                    barCategoryGap={18}
                  >
                    <XAxis
                      type="number"
                      tickFormatter={(value) =>
                        `₹${(value / 1000).toFixed(0)}k`
                      }
                      tick={{
                        fontSize: 11,
                        fill: "#6B7280",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      type="category"
                      dataKey="month"
                      tick={{
                        fontSize: 11,
                        fill: "#6B7280",
                      }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />

                    <Tooltip
                      cursor={{
                        fill: "transparent",
                      }}
                      formatter={(value) => [
                        `₹${formatCurrency(value)}`,
                        "Revenue",
                      ]}
                    />

                    <Bar
                      dataKey="revenue"
                      fill="#1D546C"
                      radius={[0, 12, 12, 0]}
                      activeBar={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-400 text-base font-medium text-center">
                    No revenue data available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* PIE CHART */}

          {/* PIE CHART */}

          <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-[#0C2B4E]">
                Order Status
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Distribution based on selected filter
              </p>
            </div>

            {/* PIE */}

            <div className="w-full h-[280px] sm:h-[320px]">
              {filteredOrders.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      innerRadius={60}
                      paddingAngle={4}
                      activeShape={false}
                      stroke="none"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>

                    <Tooltip formatter={(value, name) => [value, name]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-400 text-lg font-medium text-center">
                    No order data available
                  </p>
                </div>
              )}
            </div>

            {/* LEGEND */}

            {filteredOrders.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {orderStatusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: item.color,
                      }}
                    />

                    <p className="text-sm text-gray-600">{item.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RECENT ORDERS */}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 md:p-6 border-b border-gray-100 flex flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-[#0C2B4E]">
              Recent Orders
            </h2>
            <button
              onClick={exportOrders}
              disabled={!filteredOrders.length}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition w-fit
                    ${
                      filteredOrders.length
                        ? "border-gray-200 hover:bg-gray-50"
                        : "border-gray-100 bg-gray-100 text-gray-400 cursor-not-allowed"
                    }
                  `}
            >
              <Download size={18} />
              Export
            </button>
          </div>

          {/* DESKTOP TABLE */}

          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0C2B4E] text-white">
                <tr>
                  <th className="p-5 text-left">Customer</th>
                  <th className="p-5 text-left">Product</th>
                  <th className="p-5 text-left">Amount</th>
                  <th className="p-5 text-left">Status</th>
                  <th className="p-5 text-left">Ordered On</th>
                  <th className="p-5 text-left">Updated On</th>
                </tr>
              </thead>

              <tbody>
                {paginatedOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-5">{order.customerName}</td>

                    <td className="p-5">{order.product}</td>

                    <td className="p-5 font-medium">
                      ₹{formatCurrency(order.amount)}
                    </td>

                    <td className="p-5">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium capitalize
                        ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "processing"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "shipped"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-green-100 text-green-700"
                        }
                      `}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="p-5 text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="p-5 text-gray-600">
                      {formatDate(order.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE */}

          <div className="xl:hidden p-4 space-y-4">
            {paginatedOrders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-100 rounded-2xl p-4"
              >
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-semibold mt-1">{order.customerName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Product</p>
                    <p>{order.product}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium">
                        ₹{formatCurrency(order.amount)}
                      </p>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium capitalize
                      ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "processing"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "shipped"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                      }
                    `}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 p-6 border-t border-gray-100">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="w-8 h-8 rounded-2xl bg-gray-100 flex items-center justify-center disabled:opacity-50 hover:bg-gray-200 transition"
              >
                <ChevronLeft size={20} />
              </button>

              <p className="text-sm md:text-base font-semibold">
                Page {currentPage} of {totalPages}
              </p>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="w-8 h-8 rounded-2xl bg-gray-100 flex items-center justify-center disabled:opacity-50 hover:bg-gray-200 transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Analytics;
