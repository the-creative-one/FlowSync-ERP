import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import ExportDropdown from "../components/common/ExportDropdown";
import { exportToExcel, exportToCSV } from "../utils/exportData";

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

import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Search,
  X,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

function Analytics() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,

    currentMonthRevenue: 0,
    previousMonthRevenue: 0,
    averageOrderValue: 0,
    highestOrderValue: 0,
    topStatus: "N/A",

    monthlyRevenue: [],
    recentOrders: [],
  });

  const [activeFilter, setActiveFilter] = useState("ytd");
  // SEARCH
  const [search, setSearch] = useState("");
  // SORTING
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });
  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [currency, setCurrency] = useState("INR");

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

        currentMonthRevenue: response.data.currentMonthRevenue || 0,

        previousMonthRevenue: response.data.previousMonthRevenue || 0,

        averageOrderValue: response.data.averageOrderValue || 0,

        highestOrderValue: response.data.highestOrderValue || 0,

        topStatus: response.data.topStatus || "N/A",

        monthlyRevenue: response.data.monthlyRevenue || [],

        recentOrders: response.data.recentOrders || [],
      });

      const settingsResponse = await api.get("/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCurrency(settingsResponse.data.currency || "INR");
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
  }, [activeFilter, search]);

  //
  // FORMATTERS
  //

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  const getCurrencySymbol = () => {
    switch (currency) {
      case "USD":
        return "$";

      case "EUR":
        return "€";

      case "GBP":
        return "£";

      default:
        return "₹";
    }
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
      label: "7 Days",
      value: "7days",
    },

    {
      label: "30 Days",
      value: "30days",
    },

    {
      label: "90 Days",
      value: "90days",
    },

    {
      label: "YTD",
      value: "ytd",
    },

    {
      label: "Last Year",
      value: "lastYear",
    },

    {
      label: "MTD",
      value: "mtd",
    },

    {
      label: "Last Month",
      value: "lastMonth",
    },
  ];

  //
  // FILTERED ORDERS
  //

  const filteredOrders = useMemo(() => {
    const currentDate = new Date();

    const currentYear = currentDate.getFullYear();

    const currentMonth = currentDate.getMonth() + 1;

    let orders = [...(stats?.recentOrders || [])];
    // LAST 7 DAYS

    if (activeFilter === "7days") {
      const last7Days = new Date();

      last7Days.setDate(currentDate.getDate() - 7);

      orders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);

        return orderDate >= last7Days;
      });
    }
    // LAST 30 DAYS

    if (activeFilter === "30days") {
      const last30Days = new Date();

      last30Days.setDate(currentDate.getDate() - 30);

      orders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);

        return orderDate >= last30Days;
      });
    }
    // LAST 90 DAYS
    if (activeFilter === "90days") {
      const last90Days = new Date();

      last90Days.setDate(currentDate.getDate() - 90);

      orders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);

        return orderDate >= last90Days;
      });
    }
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

    //
    // SEARCH FILTER
    //

    if (search.trim()) {
      orders = orders.filter((order) =>
        [order.customerName, order.product, order.status]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    }

    //
    // DEFAULT SORT
    //

    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    //
    // CUSTOM SORT
    //

    if (sortConfig.key && sortConfig.direction) {
      orders.sort((a, b) => {
        let aValue;
        let bValue;

        switch (sortConfig.key) {
          case "amount":
            aValue = a.amount;
            bValue = b.amount;
            break;

          case "status":
            aValue = a.status;
            bValue = b.status;
            break;

          case "createdAt":
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
            break;

          case "updatedAt":
            aValue = new Date(a.updatedAt);

            bValue = new Date(b.updatedAt);

            break;

          default:
            return 0;
        }

        if (sortConfig.direction === "asc") {
          return aValue > bValue ? 1 : -1;
        }

        return aValue < bValue ? 1 : -1;
      });
    }

    return orders;
  }, [stats.recentOrders, activeFilter, sortConfig, search]);

  //
  // FILTERED REVENUE DATA
  //

  const revenueData = useMemo(() => {
    //
    // SHORT RANGE FILTERS
    // USE FILTERED ORDERS INSTEAD OF monthlyRevenue
    //

    if (
      activeFilter === "7days" ||
      activeFilter === "30days" ||
      activeFilter === "90days"
    ) {
      const groupedData = {};

      filteredOrders.forEach((order) => {
        const orderDate = new Date(order.createdAt);

        //
        // DATE LABEL
        //

        const label = orderDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        });

        //
        // INIT
        //

        if (!groupedData[label]) {
          groupedData[label] = 0;
        }

        //
        // ADD REVENUE
        //

        groupedData[label] += Number(order.amount || 0);
      });

      //
      // CONVERT TO ARRAY
      //

      return Object.entries(groupedData).map(([day, revenue]) => ({
        month: day,
        revenue,
      }));
    }

    //
    // MONTHLY DATA
    //

    const currentDate = new Date();

    const currentYear = currentDate.getFullYear();

    const currentMonth = currentDate.getMonth() + 1;

    let filteredData = [...(stats?.monthlyRevenue || [])];

    //
    // YTD
    //

    if (activeFilter === "ytd") {
      filteredData = filteredData.filter(
        (item) => item?._id?.year === currentYear,
      );
    }

    //
    // LAST YEAR
    //

    if (activeFilter === "lastYear") {
      filteredData = filteredData.filter(
        (item) => item?._id?.year === currentYear - 1,
      );
    }

    //
    // MTD
    //

    if (activeFilter === "mtd") {
      filteredData = filteredData.filter(
        (item) =>
          item?._id?.year === currentYear && item?._id?.month === currentMonth,
      );
    }

    //
    // LAST MONTH
    //

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

    //
    // FORMAT
    //

    return filteredData.map((item) => ({
      month: monthNames[(item?._id?.month || 1) - 1],

      revenue: item?.revenue || 0,
    }));
  }, [stats.monthlyRevenue, activeFilter, filteredOrders]);

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

  // EXPORT EXCEL
  const getExportRows = () =>
    filteredOrders.map((order) => ({
      "Order ID": order.orderNumber,
      Customer: order.customerName,
      Product: order.product,
      Quantity: order.quantity,
      Amount: order.amount,
      Status: order.status,
      "Ordered On": formatDate(order.createdAt),
      "Updated On": formatDate(order.updatedAt),
    }));

  // SORT FUNCTION
  const handleSort = (key) => {
    setSortConfig((prev) => {
      //
      // NEW SORT
      //

      if (prev.key !== key) {
        return {
          key,
          direction: "asc",
        };
      }

      //
      // ASC -> DESC
      //

      if (prev.direction === "asc") {
        return {
          key,
          direction: "desc",
        };
      }

      //
      // DESC -> RESET
      //

      return {
        key: null,
        direction: null,
      };
    });
  };

  //
  // SORT ICON
  //

  const renderSortIcon = (key) => {
    const active = sortConfig?.key === key;

    //
    // NO SORT
    //

    if (!active) {
      return (
        <ArrowDown
          size={16}
          className="
          opacity-60
          transition
        "
        />
      );
    }

    //
    // ASC
    //

    if (sortConfig.direction === "asc") {
      return (
        <ArrowUp
          size={16}
          className="
          text-blue-400
        "
        />
      );
    }

    //
    // DESC
    //

    return (
      <ArrowDown
        size={16}
        className="
        text-blue-400
      "
      />
    );
  };

  //
  // SORTABLE HEADER
  //

  const SortableHeader = ({ label, sortKey }) => (
    <button
      onClick={() => handleSort(sortKey)}
      className="
      flex
      items-center
      gap-2
      transition
      hover:text-blue-400
    "
    >
      <span>{label}</span>

      {renderSortIcon(sortKey)}
    </button>
  );

  return (
    <DashboardLayout
      title="Analytics Dashboard"
      subtitle="Track revenue, order flow and business performance"
    >
      <div className="space-y-6">
        {/* TOP CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <div
            className="
              bg-white
              dark:bg-[#111827]
              rounded-3xl
              p-5
              md:p-6
              shadow-sm
              border
              border-gray-100
              dark:border-gray-800
              transition-colors
            "
          >
            <p
              className="
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Total Revenue
            </p>

            <h2
              className="
                text-2xl
                md:text-3xl
                font-bold
                text-[#1D546C]
                dark:text-blue-400
                mt-2
              "
            >
              {getCurrencySymbol()}
              {formatCurrency(filteredRevenue)}
            </h2>
          </div>

          <div
            className="
              bg-white
              dark:bg-[#111827]
              rounded-3xl
              p-5
              md:p-6
              shadow-sm
              border
              border-gray-100
              dark:border-gray-800
              transition-colors
            "
          >
            <p
              className="
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Total Orders
            </p>

            <h2
              className="
                text-2xl
                md:text-3xl
                font-bold
                text-[#0C2B4E]
                dark:text-white
                mt-2
              "
            >
              {filteredOrders.length}
            </h2>
          </div>

          <div
            className="
              bg-white
              dark:bg-[#111827]
              rounded-3xl
              p-5
              md:p-6
              shadow-sm
              border
              border-gray-100
              dark:border-gray-800
              transition-colors
            "
          >
            <p
              className="
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Delivered Orders
            </p>

            <h2
              className="
                text-2xl
                md:text-3xl
                font-bold
                text-green-600
                dark:text-green-400
                mt-2
              "
            >
              {deliveredCount}
            </h2>
          </div>

          <div
            className="
              bg-white
              dark:bg-[#111827]
              rounded-3xl
              p-5
              md:p-6
              shadow-sm
              border
              border-gray-100
              dark:border-gray-800
              transition-colors
            "
          >
            <p
              className="
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Pending Orders
            </p>

            <h2
              className="
                text-2xl
                md:text-3xl
                font-bold
                text-yellow-500
                dark:text-yellow-400
                mt-2
              "
            >
              {pendingCount}
            </h2>
          </div>
        </div>

        {/* CHART SECTION */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* REVENUE CHART */}

          <div
            className="
              bg-white
              dark:bg-[#111827]
              rounded-3xl
              p-5
              md:p-6
              shadow-sm
              border
              border-gray-100
              dark:border-gray-800
              xl:col-span-2
              overflow-hidden
              transition-colors
            "
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-8">
              <div>
                <h2
                  className="
                    text-xl
                    md:text-2xl
                    font-bold
                    text-[#0C2B4E]
                    dark:text-white
                  "
                >
                  Revenue Timeline
                </h2>

                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                    mt-1
                  "
                >
                  Revenue insights based on selected timeline
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap
                    ${
                      activeFilter === filter.value
                        ? "bg-[#0C2B4E] text-white dark:bg-blue-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#1F2937] dark:text-gray-300 dark:hover:bg-[#374151]"
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
                        fill: "#9CA3AF",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      tickFormatter={(value) =>
                        `${getCurrencySymbol()}${(value / 1000).toFixed(0)}k`
                      }
                      tick={{
                        fontSize: 12,
                        fill: "#9CA3AF",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      cursor={{
                        fill: "transparent",
                      }}
                      formatter={(value) => [
                        `${getCurrencySymbol()}${formatCurrency(value)}`,
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
                  <p
                    className="
                      text-gray-400
                      dark:text-gray-500
                      text-lg
                      font-medium
                    "
                  >
                    No revenue data available
                  </p>
                </div>
              )}
            </div>

            {/* MOBILE CHART */}

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
                        `${getCurrencySymbol()}${(value / 1000).toFixed(0)}k`
                      }
                      tick={{
                        fontSize: 11,
                        fill: "#9CA3AF",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      type="category"
                      dataKey="month"
                      tick={{
                        fontSize: 11,
                        fill: "#9CA3AF",
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
                        `${getCurrencySymbol()}${formatCurrency(value)}`,
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
                  <p
                    className="
                      text-gray-400
                      dark:text-gray-500
                      text-base
                      font-medium
                      text-center
                    "
                  >
                    No revenue data available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* PIE CHART */}

          <div
            className="
              bg-white
              dark:bg-[#111827]
              rounded-3xl
              p-5
              md:p-6
              shadow-sm
              border
              border-gray-100
              dark:border-gray-800
              transition-colors
            "
          >
            <div className="mb-6">
              <h2
                className="
                  text-xl
                  md:text-2xl
                  font-bold
                  text-[#0C2B4E]
                  dark:text-white
                "
              >
                Order Status
              </h2>

              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                  mt-1
                "
              >
                Distribution based on selected filter
              </p>
            </div>

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
                  <p
                    className="
                      text-gray-400
                      dark:text-gray-500
                      text-lg
                      font-medium
                      text-center
                    "
                  >
                    No order data available
                  </p>
                </div>
              )}
            </div>

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

                    <p
                      className="
                          text-sm
                          text-gray-600
                          dark:text-gray-300
                        "
                    >
                      {item.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RECENT ORDERS */}

        <div
          className="
            bg-white
            dark:bg-[#111827]
            rounded-3xl
            shadow-sm
            border
            border-gray-100
            dark:border-gray-800
            overflow-hidden
            transition-colors
          "
        >
          <div
            className="
              p-5
              md:p-6
              border-b
              border-gray-100
              dark:border-gray-800
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-4
            "
          >
            {/* LEFT */}

            <div>
              <h2
                className="
        text-xl
        md:text-2xl
        font-bold
        text-[#0C2B4E]
        dark:text-white
      "
              >
                Recent Orders
              </h2>

              <p
                className="
        text-sm
        text-gray-500
        dark:text-gray-400
        mt-1
      "
              >
                Search and analyze recent order activity
              </p>
            </div>

            {/* RIGHT */}

            <div
              className="
      flex
      flex-col
      sm:flex-row
      gap-3
      w-full
      lg:w-auto
    "
            >
              {/* SEARCH */}

              <div className="relative w-full sm:w-[320px]">
                <Search
                  size={18}
                  className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-gray-400
        "
                />

                <input
                  type="text"
                  placeholder="Search customer, product or status..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="
          w-full
          h-11
          rounded-2xl
          border
          border-gray-200
          dark:border-gray-700
          bg-[#F8FAFC]
          dark:bg-[#0F172A]
          pl-11
          pr-10
          text-sm
          text-[#0F172A]
          dark:text-white
          placeholder:text-gray-400
          outline-none
          transition
          focus:border-[#2563EB]
        "
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            w-6
            h-6
            rounded-full
            bg-gray-200
            dark:bg-[#334155]
            flex
            items-center
            justify-center
            transition
          "
                  >
                    <X
                      size={14}
                      className="
              text-gray-600
              dark:text-gray-300
            "
                    />
                  </button>
                )}
              </div>

              {/* EXPORT */}

              <ExportDropdown
                fullWidth
                onExcel={() =>
                  exportToExcel(getExportRows(), "analytics-report")
                }
                onCSV={() => exportToCSV(getExportRows(), "analytics-report")}
              />
            </div>
          </div>

          {/* DESKTOP TABLE */}

          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full">
              <thead
                className="
                  bg-[#0C2B4E]
                  dark:bg-[#020617]
                  text-white
                "
              >
                <tr>
                  <th className="p-5 text-left">Order ID</th>
                  <th className="p-5 text-left">Customer</th>

                  <th className="p-5 text-left">Product</th>

                  <th className="p-5 text-left">
                    <SortableHeader label="Amount" sortKey="amount" />
                  </th>

                  <th className="p-5 text-left">
                    <SortableHeader label="Status" sortKey="status" />
                  </th>

                  <th className="p-5 text-left">
                    <SortableHeader label="Ordered On" sortKey="createdAt" />
                  </th>

                  <th className="p-5 text-left">
                    <SortableHeader label="Updated On" sortKey="updatedAt" />
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedOrders.length ? (
                  paginatedOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="
                        border-b
                        border-gray-100
                        dark:border-gray-800
                        hover:bg-gray-50
                        dark:hover:bg-[#1A2438]
                        transition
                      "
                    >
                      <td
                        className="
                        p-5
                        font-semibold
                        text-[#1D546C]
                        dark:text-blue-400
                        whitespace-nowrap
                      "
                      >
                        {order.orderNumber}
                      </td>
                      <td
                        className="
                          p-5
                          dark:text-white
                        "
                      >
                        {order.customerName}
                      </td>

                      <td
                        className="
                          p-5
                          dark:text-gray-300
                        "
                      >
                        {order.product}
                      </td>

                      <td
                        className="
                          p-5
                          font-medium
                          dark:text-blue-400
                        "
                      >
                        {getCurrencySymbol()}
                        {formatCurrency(order.amount)}
                      </td>

                      <td className="p-5">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-medium capitalize
                          ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300"
                              : order.status === "processing"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                                : order.status === "shipped"
                                  ? "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300"
                                  : "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300"
                          }
                        `}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td
                        className="
                          p-5
                          text-gray-600
                          dark:text-gray-400
                        "
                      >
                        {formatDate(order.createdAt)}
                      </td>

                      <td
                        className="
                          p-5
                          text-gray-600
                          dark:text-gray-400
                        "
                      >
                        {formatDate(order.updatedAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="
                        p-10
                        text-center
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      No matching orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE */}

          <div className="xl:hidden p-4 space-y-4">
            {paginatedOrders.length ? (
              paginatedOrders.map((order) => (
                <div
                  key={order._id}
                  className="
                    border
                    border-gray-100
                    dark:border-gray-800
                    rounded-2xl
                    p-4
                    dark:bg-[#0F172A]
                  "
                >
                  <div className="space-y-4">
                    <div
                      className="
                        inline-flex
                        items-center
                        px-3
                        py-1
                        rounded-full
                        bg-blue-50
                        dark:bg-blue-900/20
                        text-[#1D546C]
                        dark:text-blue-400
                        text-xs
                        font-semibold
                        tracking-wide
                      "
                    >
                      {order.orderNumber}
                    </div>
                    <div>
                      <p
                        className="
                          text-sm
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        Customer
                      </p>

                      <p
                        className="
                          font-semibold
                          mt-1
                          dark:text-white
                        "
                      >
                        {order.customerName}
                      </p>
                    </div>

                    <div>
                      <p
                        className="
                          text-sm
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        Product
                      </p>

                      <p
                        className="
                          dark:text-gray-300
                        "
                      >
                        {order.product}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="
                            text-sm
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          Amount
                        </p>

                        <p
                          className="
                            font-medium
                            dark:text-blue-400
                          "
                        >
                          {getCurrencySymbol()}
                          {formatCurrency(order.amount)}
                        </p>
                      </div>

                      <span
                        className={`px-5 md:px-4 py-2 rounded-full text-sm font-medium capitalize
                        ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300"
                            : order.status === "processing"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                              : order.status === "shipped"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300"
                                : "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300"
                        }
                      `}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="
      bg-white
      dark:bg-[#111827]
      border
      border-gray-100
      dark:border-gray-800
      rounded-3xl
      p-10
      text-center
    "
              >
                <p className="text-gray-500 dark:text-gray-400">
                  No matching orders found.
                </p>
              </div>
            )}
          </div>

          {/* PAGINATION */}

          {totalPages > 1 && (
            <div
              className="
                flex
                items-center
                justify-center
                gap-3
                p-6
                border-t
                border-gray-100
                dark:border-gray-800
              "
            >
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="
                  w-8
                  h-8
                  rounded-2xl
                  bg-gray-100
                  dark:bg-[#1F2937]
                  dark:text-white
                  flex
                  items-center
                  justify-center
                  disabled:opacity-50
                  hover:bg-gray-200
                  dark:hover:bg-[#374151]
                  transition
                "
              >
                <ChevronLeft size={20} />
              </button>

              <p
                className="
                  text-sm
                  md:text-base
                  font-semibold
                  dark:text-white
                "
              >
                Page {currentPage} of {totalPages}
              </p>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="
                  w-8
                  h-8
                  rounded-2xl
                  bg-gray-100
                  dark:bg-[#1F2937]
                  dark:text-white
                  flex
                  items-center
                  justify-center
                  disabled:opacity-50
                  hover:bg-gray-200
                  dark:hover:bg-[#374151]
                  transition
                "
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
