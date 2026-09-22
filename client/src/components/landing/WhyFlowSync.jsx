import { motion } from "framer-motion";
import { Database, BarChart3, ShieldCheck, Eye } from "lucide-react";

function WhyFlowSync() {
  const benefits = [
    {
      icon: Database,
      title: "One Connected Workspace",
      description:
        "Keep day-to-day operations, team management and business insights connected instead of scattered across separate workflows.",
    },
    {
      icon: BarChart3,
      title: "Built Around Real Workflows",
      description:
        "From creating an order to tracking its progress and reviewing performance, FlowSync follows the way teams actually work.",
    },
    {
      icon: ShieldCheck,
      title: "Access With Purpose",
      description:
        "Roles and permissions give teams the access they need while keeping sensitive actions under control.",
    },
    {
      icon: Eye,
      title: "Visibility That Goes Beyond Numbers",
      description:
        "Analytics, activity records and audit trails help teams understand not just what happened, but how the platform is being used.",
    },
  ];

  return (
    <section
      className="
      pt-15
      py-24
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
            Designed to simplify operations, improve visibility and help teams
            make informed decisions with confidence.
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
