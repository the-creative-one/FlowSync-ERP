import { useEffect, useState } from "react";

import api from "../api/axios";

import DashboardLayout from "../layouts/DashboardLayout";

import {
  ShoppingBag,
  Clock3,
  CheckCircle2,
  IndianRupee,
} from "lucide-react";

function Dashboard() {
  const [stats, setStats] = useState({});

  //
  // FETCH STATS
  //

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(response.data);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  //
  // FORMAT CURRENCY
  //

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  //
  // DASHBOARD CARDS
  //

  const cards = [
    {
      title: "Total Orders",
      value: stats.totalOrders || 0,
      icon: ShoppingBag,
      valueColor: "text-[#0C2B4E] dark:text-white",
      iconBg:
        "bg-blue-100 dark:bg-blue-500/20",
      iconColor:
        "text-blue-600 dark:text-blue-400",
    },

    {
      title: "Pending Orders",
      value: stats.pendingOrders || 0,
      icon: Clock3,
      valueColor:
        "text-yellow-500 dark:text-yellow-400",
      iconBg:
        "bg-yellow-100 dark:bg-yellow-500/20",
      iconColor:
        "text-yellow-600 dark:text-yellow-400",
    },

    {
      title: "Delivered Orders",
      value: stats.deliveredOrders || 0,
      icon: CheckCircle2,
      valueColor:
        "text-green-600 dark:text-green-400",
      iconBg:
        "bg-green-100 dark:bg-green-500/20",
      iconColor:
        "text-green-600 dark:text-green-400",
    },

    {
      title: "Revenue",
      value: `₹${formatCurrency(
        stats.totalRevenue,
      )}`,
      icon: IndianRupee,
      valueColor:
        "text-[#1D546C] dark:text-blue-400",
      iconBg:
        "bg-cyan-100 dark:bg-cyan-500/20",
      iconColor:
        "text-cyan-700 dark:text-cyan-400",
    },
  ];

  return (
    <DashboardLayout
      title="Dashboard Overview"
      subtitle="Monitor business performance and order insights"
    >
      <div className="space-y-6">
        {/* STATS GRID */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-6
          "
        >
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={index}
                className="
                  bg-white
                  dark:bg-[#111827]
                  border
                  border-gray-100
                  dark:border-gray-800
                  rounded-3xl
                  p-6
                  shadow-sm
                  hover:shadow-xl
                  transition-all
                  duration-300
                  hover:-translate-y-1
                "
              >
                {/* TOP */}

                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className="
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      {card.title}
                    </p>

                    <h2
                      className={`
                        text-3xl
                        font-bold
                        mt-3
                        break-words
                        ${card.valueColor}
                      `}
                    >
                      {card.value}
                    </h2>
                  </div>

                  {/* ICON */}

                  <div
                    className={`
                      w-14
                      h-14
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      ${card.iconBg}
                    `}
                  >
                    <Icon
                      size={26}
                      className={card.iconColor}
                    />
                  </div>
                </div>

                {/* BOTTOM LINE */}

                <div
                  className="
                    mt-6
                    h-[1px]
                    bg-gray-100
                    dark:bg-gray-800
                  "
                />
              </div>
            );
          })}
        </div>

        {/* QUICK OVERVIEW */}

        <div
          className="
            bg-white
            dark:bg-[#111827]
            border
            border-gray-100
            dark:border-gray-800
            rounded-3xl
            p-6
            shadow-sm
            transition-colors
          "
        >
          <h2
            className="
              text-2xl
              font-bold
              text-[#0C2B4E]
              dark:text-white
            "
          >
            Welcome to FlowSync ERP
          </h2>

          <p
            className="
              mt-3
              text-gray-500
              dark:text-gray-400
              leading-relaxed
              max-w-3xl
            "
          >
            Manage your orders, employees, analytics and
            overall business operations from one centralized
            dashboard. Track real-time insights, monitor
            performance and streamline workflows with a
            modern ERP experience.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;