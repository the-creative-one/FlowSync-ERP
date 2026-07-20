import { motion } from "framer-motion";
import { TrendingUp, ShoppingCart, Users, IndianRupee } from "lucide-react";

function AnalyticsShowcase() {
  return (
    <section
      className="
        py-24
        bg-white
        dark:bg-[#020817]
        transition-colors
        md:pb-80
        pb-[350px]
        overflow-x-hidden
      "
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-blue-100
                text-blue-700
                dark:bg-blue-500/10
                dark:text-blue-300
              "
            >
              <TrendingUp size={16} />
              Analytics & Reporting
            </span>

            <h2
              className="
                mt-6
                text-4xl
                font-bold
                text-[#0C2B4E]
                dark:text-white
              "
            >
              Make Better Decisions With Real-Time Insights
            </h2>

            <p
              className="
                mt-5
                text-gray-600
                dark:text-gray-400
                leading-relaxed
              "
            >
              Monitor orders, revenue, employee activity and operational
              performance through a centralized analytics dashboard.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <TrendingUp size={18} className="text-green-500" />
                Performance Trends
              </div>

              <div className="flex items-center gap-3">
                <ShoppingCart size={18} className="text-blue-500" />
                Order Monitoring
              </div>

              <div className="flex items-center gap-3">
                <Users size={18} className="text-purple-500" />
                Team Insights
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Dashboard Card */}

            {/* Desktop */}
            <div
              className="
                bg-[#0C2B4E]
                rounded-3xl
                p-8
                shadow-2xl
                hidden md:block
              "
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-2xl p-5">
                  <ShoppingCart className="text-white" size={24} />

                  <p className="text-white/70 mt-3">Orders</p>

                  <h3 className="text-white text-3xl font-bold">1,245</h3>
                </div>

                <div className="bg-white/10 rounded-2xl p-5">
                  <IndianRupee className="text-white" size={24} />

                  <p className="text-white/70 mt-3">Revenue</p>

                  <h3 className="text-white text-3xl font-bold">8.5L</h3>
                </div>

                <div className="bg-white/10 rounded-2xl p-5">
                  <Users className="text-white" size={24} />

                  <p className="text-white/70 mt-3">Employees</p>

                  <h3 className="text-white text-3xl font-bold">42</h3>
                </div>

                <div className="bg-white/10 rounded-2xl p-5">
                  <TrendingUp className="text-white" size={24} />

                  <p className="text-white/70 mt-3">Growth</p>

                  <h3 className="text-white text-3xl font-bold">+24%</h3>
                </div>
              </div>
            </div>

            {/* Mobile */}

            <div className="md:hidden space-y-4">
              {[
                {
                  label: "Orders",
                  value: "1,245",
                  icon: ShoppingCart,
                },
                {
                  label: "Revenue",
                  value: "₹8.5L",
                  icon: IndianRupee,
                },
                {
                  label: "Employees",
                  value: "42",
                  icon: Users,
                },
                {
                  label: "Growth",
                  value: "+24%",
                  icon: TrendingUp,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="
          bg-[#0C2B4E]
          rounded-2xl
          p-5
          flex
          items-center
          justify-between
        "
                  >
                    <div>
                      <p className="text-white/70">{item.label}</p>

                      <h3 className="text-white text-3xl font-bold">
                        {item.value}
                      </h3>
                    </div>

                    <Icon size={30} className="text-white" />
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AnalyticsShowcase;
