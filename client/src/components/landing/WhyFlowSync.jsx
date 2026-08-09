import { motion } from "framer-motion";
import {
  Database,
  BarChart3,
  ShieldCheck,
  Eye,
} from "lucide-react";

function WhyFlowSync() {
  const benefits = [
    {
      icon: Database,
      title: "Centralized Operations",
      description:
        "Manage orders, employees, analytics and workflows from a single platform instead of multiple disconnected tools.",
    },
    {
      icon: BarChart3,
      title: "Actionable Analytics",
      description:
        "Transform operational data into meaningful insights through dashboards, reports and performance metrics.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Access Control",
      description:
        "Role-based permissions ensure users only access the information and actions relevant to their responsibilities.",
    },
    {
      icon: Eye,
      title: "Operational Transparency",
      description:
        "Activity logs and audit tracking provide visibility into critical actions across the organization.",
    },
  ];

  return (
    <section
      className="
      pt-15
      md:py-24
      bg-[#F8FAFC]
      dark:bg-[#0B1120]
      pb-80
      "
    >
      <div className="max-w-7xl mx-auto px-6">
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
            Why Choose FlowSync?
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
            Designed to simplify operations, improve
            visibility and help teams make informed
            decisions with confidence.
          </p>
        </div>

        <div
          className="
            mt-16
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-6
          "
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                }}
                className="
                  p-7
                  rounded-3xl
                  border
                  border-gray-200
                  dark:border-gray-800
                  bg-white
                  dark:bg-[#111827]
                  hover:-translate-y-1
                  transition-all
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

                <h3
                  className="
                    mt-5
                    text-xl
                    font-semibold
                    text-[#0C2B4E]
                    dark:text-white
                  "
                >
                  {benefit.title}
                </h3>

                <p
                  className="
                    mt-3
                    text-gray-600
                    dark:text-gray-400
                    leading-relaxed
                  "
                >
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyFlowSync;