import { motion } from "framer-motion";
import { ShoppingCart, Settings, BarChart3, Activity } from "lucide-react";

function OperationalWorkflow() {
  const steps = [
    {
      icon: ShoppingCart,
      title: "Order Creation",
      description:
        "Orders are created and managed through a centralized workflow.",
    },
    {
      icon: Settings,
      title: "Processing & Updates",
      description:
        "Teams update statuses, quantities and operational details in real-time.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description:
        "Business insights and performance metrics are generated automatically.",
    },
    {
      icon: Activity,
      title: "Activity Tracking",
      description:
        "Every important action is logged for visibility and accountability.",
    },
  ];

  return (
    <section
      className="
      py-16
        md:py-24
        bg-[#F8FAFC]
        dark:bg-[#0B1120]
      "
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}

        <div className="text-center">
          <h2
            className="
              text-4xl
              md:text-5xl
              font-bold
              text-[#0C2B4E]
              dark:text-white
            "
          >
            Operational Workflow
          </h2>

          <p
            className="
              mt-4
              max-w-3xl
              mx-auto
              text-lg
              text-gray-600
              dark:text-gray-400
            "
          >
            From creating an order to understanding what happened, FlowSync
            keeps the operational cycle connected.
          </p>
        </div>

        {/* Desktop Timeline */}

        <div
          className="
            hidden
            lg:grid
            grid-cols-4
            gap-8
            mt-20
            relative
          "
        >
          {/* Line */}

          <div
            className="
              absolute
              top-8
              left-0
              right-0
              h-[2px]
              bg-gradient-to-r
              from-blue-500
              via-cyan-500
              to-blue-500
            "
          />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                }}
                className="relative"
              >
                <div
                  className="
                    w-16
                    h-16
                    mx-auto
                    rounded-full
                    bg-white
                    dark:bg-[#111827]
                    border
                    border-gray-200
                    dark:border-gray-800
                    flex
                    items-center
                    justify-center
                    shadow-sm
                    relative
                    z-10
                  "
                >
                  <Icon
                    size={28}
                    className="
                      text-[#0C2B4E]
                      dark:text-blue-400
                    "
                  />
                </div>

                <div className="mt-8 text-center">
                  <span
                    className="
                      inline-flex
                      items-center
                      justify-center
                      w-8
                      h-8
                      rounded-full
                      bg-[#0C2B4E]
                      text-white
                      text-sm
                      font-semibold
                    "
                  >
                    {index + 1}
                  </span>

                  <h3
                    className="
                      mt-4
                      text-xl
                      font-semibold
                      text-[#0C2B4E]
                      dark:text-white
                    "
                  >
                    {step.title}
                  </h3>

                  <p
                    className="
                      mt-3
                      text-gray-600
                      dark:text-gray-400
                      leading-relaxed
                    "
                  >
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile */}

        <div className="lg:hidden mt-14 space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="
                  flex
                  gap-4
                  p-5
                  rounded-3xl
                  bg-white
                  dark:bg-[#111827]
                  border
                  border-gray-200
                  dark:border-gray-800
                "
              >
                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-blue-100
                    dark:bg-blue-500/10
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  <Icon
                    size={24}
                    className="
                      text-[#0C2B4E]
                      dark:text-blue-400
                    "
                  />
                </div>

                <div>
                  <div
                    className="
                      text-sm
                      font-semibold
                      text-blue-600
                      dark:text-blue-400
                    "
                  >
                    STEP {index + 1}
                  </div>

                  <h3
                    className="
                      mt-1
                      text-lg
                      font-semibold
                      dark:text-white
                    "
                  >
                    {step.title}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-gray-600
                      dark:text-gray-400
                    "
                  >
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default OperationalWorkflow;
