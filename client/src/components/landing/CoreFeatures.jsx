import { motion } from "framer-motion";
import {
  ShoppingCart,
  BarChart3,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  Bell,
  Activity,
  BotIcon,
} from "lucide-react";

function CoreFeatures() {
  const features = [
    {
      icon: ShoppingCart,
      title: "Order Management",
      description:
        "Create, update and manage orders through a structured workflow from one centralized workspace.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Turn order and revenue data into useful insights with flexible time-based analytics and performance views.",
    },
    {
      icon: Users,
      title: "User Management",
      description:
        "Manage employee accounts, roles and access as responsibilities change across the organization.",
    },
    {
      icon: ShieldCheck,
      title: "Role Permissions",
      description:
        "Give every user the right level of access with roles and granular permissions built around their responsibilities.",
    },
    {
      icon: BotIcon,
      title: "AI-Powered Assistant",
      description:
        "Get contextual help with FlowSync features, workflows and available capabilities through an assistant built into the platform.",
    },
    {
      icon: Activity,
      title: "Real-Time Updates",
      description:
        "Keep teams in sync with live updates across orders, employees, permissions and other operational changes.",
    },
    {
      icon: FileSpreadsheet,
      title: "Reports & Data Export",
      description:
        "Export operational data in practical formats for further analysis, sharing and record keeping.",
    },
    {
      icon: Bell,
      title: "Audit Tracking",
      description:
        "Keep a clear record of important actions, administrative changes, permission updates and report exports.",
    },
  ];

  return (
    <section
      className="
      py-16
        md:py-24
        bg-white
        dark:bg-[#020817]
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
            Core Platform Features
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
            Everything needed to manage operations,
            reporting, employees and business workflows
            from a single platform.
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
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
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
                  delay: index * 0.05,
                }}
                className="
                  p-6
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
                    w-12
                    h-12
                    rounded-2xl
                    bg-blue-100
                    dark:bg-blue-500/10
                    flex
                    items-center
                    justify-center
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

                <h3
                  className="
                    mt-5
                    text-xl
                    font-semibold
                    text-[#0C2B4E]
                    dark:text-white
                  "
                >
                  {feature.title}
                </h3>

                <p
                  className="
                    mt-3
                    text-gray-600
                    dark:text-gray-400
                    leading-relaxed
                  "
                >
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CoreFeatures;