import { motion } from "framer-motion";
import {
  ShoppingCart,
  Truck,
  BarChart3,
  Users,
} from "lucide-react";

function Workflow() {
  const steps = [
    {
      icon: ShoppingCart,
      title: "Create Orders",
      description:
        "Create and manage customer orders from a centralized dashboard.",
    },
    {
      icon: Truck,
      title: "Track Progress",
      description:
        "Monitor order status from Pending to Delivered in real time.",
    },
    {
      icon: BarChart3,
      title: "Analyze Performance",
      description:
        "Generate insights through analytics and reporting dashboards.",
    },
    {
      icon: Users,
      title: "Manage Teams",
      description:
        "Control employee access, permissions and operational workflows.",
    },
  ];

  return (
    <section
      className="
        py-24
        bg-[#F8FAFC]
        dark:bg-[#0B1120]
        transition-colors
      "
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}

        <div className="text-center max-w-3xl mx-auto">
          <h2
            className="
              text-4xl
              font-bold
              text-[#0C2B4E]
              dark:text-white
            "
          >
            How FlowSync Works
          </h2>

          <p
            className="
              mt-4
              text-gray-600
              dark:text-gray-400
            "
          >
            A streamlined workflow that helps businesses manage operations
            from order creation to performance analysis.
          </p>
        </div>

        {/* Steps */}

        <div
          className="
            mt-20
            grid
            md:grid-cols-2
            lg:grid-cols-4
            gap-8
          "
        >
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                className="
                  relative
                  bg-white
                  dark:bg-[#111827]
                  rounded-3xl
                  p-8
                  border
                  border-gray-200
                  dark:border-gray-800
                  text-center
                "
              >
                <div
                  className="
                    w-16
                    h-16
                    mx-auto
                    rounded-full
                    bg-[#0C2B4E]
                    flex
                    items-center
                    justify-center
                    text-white
                  "
                >
                  <Icon size={28} />
                </div>

                <div
                  className="
                    absolute
                    -top-3
                    -right-3
                    w-10
                    h-10
                    rounded-full
                    bg-[#2563EB]
                    text-white
                    flex
                    items-center
                    justify-center
                    font-bold
                  "
                >
                  {index + 1}
                </div>

                <h3
                  className="
                    mt-6
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
                  "
                >
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Workflow;