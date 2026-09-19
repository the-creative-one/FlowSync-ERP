import { IndianRupee, TrendingUp, Package } from "lucide-react";

function LifetimeRevenue({ stats }) {
  const previousYear = stats?.previousYear || {};
  const currentYear = stats?.currentYear || {};

  const previousRevenue = previousYear.totalRevenue || 0;
  const previousOrders = previousYear.totalOrders || 0;

  const currentRevenue = currentYear.totalRevenue || 0;

  const revenueGrowth =
    previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : null;

  const previousYearLabel = new Date().getFullYear() - 1;
  const currentYearLabel = new Date().getFullYear();

  const formattedRevenue = new Intl.NumberFormat("en-IN").format(
    previousRevenue,
  );

  const formattedGrowth =
    revenueGrowth === null
      ? "New"
      : `${revenueGrowth >= 0 ? "+" : ""}${revenueGrowth.toFixed(1)}%`;

  return (
    <div className="rounded-sm bg-gradient-to-br from-[#1D546C] via-[#266B88] to-[#2F87A8] text-white shadow-sm overflow-hidden relative">
      {/* Decorative Background */}

      <div className="absolute -top-14 -right-14 h-40 w-40 rounded-full bg-white/10" />

      <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-white/5" />

      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-cyan-100 text-sm">
              {previousYearLabel} Performance
            </p>
            <h2 className="text-2xl font-bold mt-1">Revenue Summary</h2>
          </div>
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center backdrop-blur">
            <IndianRupee size={28} />
          </div>
        </div>

        {/* Revenue */}

        <div className="mt-10">
          <p className="text-cyan-100 text-sm">Total Revenue</p>

          <h1 className="text-4xl font-bold mt-2">₹ {formattedRevenue}</h1>
        </div>

        {/* Stats */}

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/10 backdrop-blur p-4">
            <div className="flex items-center gap-2 text-cyan-100">
              <Package size={18} />

              <span className="text-sm">Orders Placed</span>
            </div>

            <h3 className="text-2xl font-bold mt-2">{previousOrders}</h3>
          </div>

          <div className="rounded-2xl bg-white/10 backdrop-blur p-4">
            <div className="flex items-center gap-2 text-cyan-100">
              <TrendingUp size={18} />

              <span className="text-sm">Growth</span>
            </div>

            <h3 className="text-2xl font-bold mt-2">{formattedGrowth}</h3>

            <p className="text-xs text-cyan-100 mt-1">
              {previousYearLabel} → {currentYearLabel}
            </p>
          </div>
        </div>

        {/* Footer */}

        <div className="mt-auto pt-8">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-cyan-300 to-white rounded-full" />
          </div>

          <p className="mt-3 text-xs text-cyan-100">
            Revenue growth compares {currentYearLabel} performance with{" "}
            {previousYearLabel}.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LifetimeRevenue;
