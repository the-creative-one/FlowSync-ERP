// Shows the most recent customer orders on the dashboard.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";

import api from "../../../api/axios";

function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recent orders.
  const fetchRecentOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.slice(0, 3));
    } catch (error) {
      console.log(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  // Return styles based on order status.
  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300";

      case "processing":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300";

      case "shipped":
        return "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300";

      case "delivered":
        return "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300";

      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div
      className="
        xl:col-span-2
        rounded-3xl
        border
        border-gray-200
        dark:border-gray-700
        bg-white
        dark:bg-gray-900
        shadow-sm
        p-6
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Latest Activity
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            Recent Orders
          </h2>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-[#1D546C]/10 flex items-center justify-center">
          <ShoppingBag size={24} className="text-[#1D546C]" />
        </div>
      </div>

      {/* Loading */}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="
                animate-pulse
                flex
                items-center
                justify-between
                gap-4
                rounded-2xl
                border
                border-gray-100
                dark:border-gray-700
                p-4
              "
            >
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-48" />
              </div>

              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        // Empty state

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <ShoppingBag
              size={26}
              className="text-gray-400 dark:text-gray-500"
            />
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white">
            No orders yet
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Recent customer orders will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Recent orders */}

          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  gap-3
                  rounded-2xl
                  border
                  border-gray-100
                  dark:border-gray-700
                  hover:border-[#1D546C]/20
                  hover:bg-gray-50
                  dark:hover:bg-gray-800
                  transition-all
                  duration-300
                  p-4
                "
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1D546C] dark:text-blue-400">
                    {order.orderNumber}
                  </p>

                  <p className="font-semibold text-gray-900 dark:text-white mt-1 truncate">
                    {order.customerName}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {order.product}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span
                    className={`
                      text-xs
                      font-semibold
                      capitalize
                      px-3
                      py-1.5
                      rounded-full
                      whitespace-nowrap
                      ${getStatusStyles(order.status)}
                    `}
                  >
                    {order.status}
                  </span>

                  <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {new Date(order.createdAt)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}

          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-5">
            <Link
              to="/orders"
              className="
                inline-flex
                items-center
                gap-2
                text-[#1D546C]
                dark:text-blue-400
                font-semibold
                hover:gap-3
                transition-all
              "
            >
              View All Orders
              <ArrowRight size={18} />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default RecentOrders;
