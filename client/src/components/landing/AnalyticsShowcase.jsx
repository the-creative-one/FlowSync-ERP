import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, ShoppingCart, Users, IndianRupee } from "lucide-react";

function Counter({ value, prefix = "", suffix = "", decimals = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.4,
  });

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 1400;
    const startTime = performance.now();

    let animationFrame;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out effect
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCount(value * easedProgress);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value]);

  const formattedValue =
    decimals > 0
      ? count.toFixed(decimals)
      : Math.floor(count).toLocaleString("en-IN");

  return (
    <span ref={ref}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}

function AnalyticsShowcase() {
  const stats = [
    {
      label: "Orders",
      value: 1245,
      icon: ShoppingCart,
      iconClass: "text-sky-400",
    },
    {
      label: "Revenue",
      value: 8.5,
      prefix: "₹",
      suffix: "L",
      decimals: 1,
      icon: IndianRupee,
      iconClass: "text-emerald-400",
    },
    {
      label: "Employees",
      value: 42,
      icon: Users,
      iconClass: "text-purple-400",
    },
    {
      label: "Growth",
      value: 24,
      prefix: "+",
      suffix: "%",
      icon: TrendingUp,
      iconClass: "text-orange-400",
    },
  ];

  return (
    <section
      className="
        pt-28
        pb-[350px]
        md:pt-24
        md:pb-80
        bg-white
        dark:bg-[#020817]
        transition-colors
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
            <h2
              className="
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
                <TrendingUp
                  size={18}
                  className="text-green-500"
                  aria-hidden="true"
                />
                Performance Trends
              </div>

              <div className="flex items-center gap-3">
                <ShoppingCart
                  size={18}
                  className="text-blue-500"
                  aria-hidden="true"
                />
                Order Monitoring
              </div>

              <div className="flex items-center gap-3">
                <Users
                  size={18}
                  className="text-purple-500"
                  aria-hidden="true"
                />
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
            {/* Desktop */}

            <div
              className="
                bg-[#0C2B4E]
                rounded-3xl
                p-8
                shadow-2xl
                hidden
                md:block
              "
            >
              <div className="grid grid-cols-2 gap-4">
                {stats.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="
                        bg-white/10
                        rounded-2xl
                        p-5
                      "
                    >
                      <Icon
                        className={item.iconClass}
                        size={24}
                        aria-hidden="true"
                      />

                      <p className="text-white/70 mt-3">{item.label}</p>

                      <h3 className="text-white text-3xl font-bold">
                        <Counter
                          value={item.value}
                          prefix={item.prefix}
                          suffix={item.suffix}
                          decimals={item.decimals}
                        />
                      </h3>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile */}

            <div className="md:hidden space-y-4">
              {stats.map((item) => {
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
                        <Counter
                          value={item.value}
                          prefix={item.prefix}
                          suffix={item.suffix}
                          decimals={item.decimals}
                        />
                      </h3>
                    </div>

                    <Icon
                      size={30}
                      className={item.iconClass}
                      aria-hidden="true"
                    />
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
