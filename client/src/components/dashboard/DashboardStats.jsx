import {
  ShoppingBag,
  Clock3,
  CheckCircle2,
  IndianRupee,
} from "lucide-react";

function DashboardStats({ stats }) {
  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  const currentYear = stats.currentYear || {};

  const cards = [
    {
      title: "Total Orders",
      subtitle: "This year",
      value: currentYear.totalOrders || 0,
      icon: ShoppingBag,
      valueColor: "text-[#0C2B4E] dark:text-white",
      iconBg: "bg-blue-100 dark:bg-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Pending Orders",
      subtitle: "Awaiting processing",
      value: currentYear.pendingOrders || 0,
      icon: Clock3,
      valueColor: "text-yellow-500 dark:text-yellow-400",
      iconBg: "bg-yellow-100 dark:bg-yellow-500/20",
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      title: "Delivered Orders",
      subtitle: "Completed this year",
      value: currentYear.deliveredOrders || 0,
      icon: CheckCircle2,
      valueColor: "text-green-600 dark:text-green-400",
      iconBg: "bg-green-100 dark:bg-green-500/20",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Revenue",
      subtitle: "This year",
      value: `₹${formatCurrency(currentYear.totalRevenue)}`,
      icon: IndianRupee,
      valueColor: "text-[#1D546C] dark:text-cyan-400",
      iconBg: "bg-cyan-100 dark:bg-cyan-500/20",
      iconColor: "text-cyan-700 dark:text-cyan-400",
    },
  ];

  return (
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
      "
    >
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
              bg-white
              dark:bg-[#111827]
              border
              border-gray-100
              dark:border-gray-800
              rounded-sm
              p-6
              shadow-sm
              hover:shadow-xl
              transition-all
              duration-300
              hover:-translate-y-1
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {card.title}
                </p>

                <h2
                  className={`text-3xl font-bold mt-3 break-words ${card.valueColor}`}
                >
                  {card.value}
                </h2>

                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  {card.subtitle}
                </p>
              </div>

              <div
                className={`
                  w-14
                  h-14
                  rounded-full
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
          </div>
        );
      })}
    </div>
  );
}

export default DashboardStats;