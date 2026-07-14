import { motion } from "framer-motion";
import {
  ShoppingCart,
  BarChart3,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  Bell,
  Activity,
  Mail,
} from "lucide-react";

function CoreFeatures() {
  const features = [
    {
      icon: ShoppingCart,
      title: "Order Management",
      description:
        "Create, update, track and manage customer orders from a centralized dashboard.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Visualize business performance through reports, trends and key metrics.",
    },
    {
      icon: Users,
      title: "User Management",
      description:
        "Manage employees, roles and account access across the organization.",
    },
    {
      icon: ShieldCheck,
      title: "Role Permissions",
      description:
        "Fine-grained permission control for Admins, Managers, Analysts and Employees.",
    },
    {
      icon: Activity,
      title: "Activity Logs",
      description:
        "Track system actions including order updates, exports and operational activity.",
    },
    {
      icon: FileSpreadsheet,
      title: "Excel Export",
      description:
        "Export orders and reports into structured spreadsheets for further analysis.",
    },
    {
      icon: Mail,
      title: "Email Notifications",
      description:
        "Automated email workflows powered by Resend for operational communication.",
    },
    {
      icon: Bell,
      title: "Audit Tracking",
      description:
        "Maintain visibility into administrative actions and permission changes.",
    },
  ];

  return (
    <section
      className="
        py-24
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