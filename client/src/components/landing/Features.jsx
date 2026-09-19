import { motion } from "framer-motion";
import {
  ShoppingCart,
  BarChart3,
  Users,
  ShieldCheck,
  Settings,
  Activity,
} from "lucide-react";

function Features() {
  const features = [
    {
      icon: ShoppingCart,
      title: "Order Management",
      description:
        "Create, track and manage customer orders with real-time updates.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Visualize performance metrics and business insights instantly.",
    },
    {
      icon: Users,
      title: "Employee Management",
      description:
        "Manage employees, roles, permissions and access controls.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Authentication",
      description:
        "Protected access using JWT authentication and role-based permissions.",
    },
    {
      icon: Settings,
      title: "System Settings",
      description:
        "Customize prefixes, currency settings and platform configurations.",
    },
    {
      icon: Activity,
      title: "Activity Tracking",
      description:
        "Monitor user actions, exports and operational activities.",
    },
  ];

  return (
    <section
      id="features"
      className="
        py-24
        bg-white
        dark:bg-[#020817]
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
            Everything You Need To Manage Operations
          </h2>

          <p
            className="
              mt-4
              text-gray-600
              dark:text-gray-400
            "
          >
            Built to centralize business operations, employee management,
            reporting and analytics in one place.
          </p>
        </div>

        {/* Cards */}

        <div
          className="
            mt-16
            grid
            md:grid-cols-2
            lg:grid-cols-3
            gap-8
          "
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="
                  bg-[#F8FAFC]
                  dark:bg-[#111827]
                  rounded-3xl
                  p-8
                  border
                  border-gray-200
                  dark:border-gray-800
                  hover:-translate-y-2
                  transition-all
                  duration-300
                "
              >
                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-[#0C2B4E]
                    flex
                    items-center
                    justify-center
                    text-white
                  "
                >
                  <Icon size={26} />
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

export default Features;