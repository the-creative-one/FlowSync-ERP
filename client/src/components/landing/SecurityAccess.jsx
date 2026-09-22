import { motion } from "framer-motion";
import {
  ShieldCheck,
  Users,
  Lock,
  Activity,
  ShieldUser,
} from "lucide-react";

function SecurityAccess() {
  const items = [
    {
      icon: ShieldUser,
      title: "Secure Authentication",
      description:
        "Protected accounts with authenticated access, verified email addresses and secure password recovery.",
    },
    {
      icon: Lock,
      title: "Permission Control",
      description:
        "Grant or restrict actions such as employee management, analytics access and report exports.",
    },
    {
      icon: ShieldCheck,
      title: "Approval Workflows",
      description:
        "Employees can request additional permissions which are reviewed and approved by authorized users.",
    },
    {
      icon: Activity,
      title: "Audit & Activity Logs",
      description:
        "Track administrative actions, permission changes and operational activity across the platform.",
    },
  ];

  return (
    <section
      className="
      pt-16
        md:pt-24
        bg-white
        dark:bg-[#020817]
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
            Security & Access Control
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
            Maintain control over users, permissions and
            sensitive business operations through a secure,
            role-based access system.
          </p>
        </div>

        <div
          className="
            mt-16
            grid
            grid-cols-1
            md:grid-cols-2
            gap-8
          "
        >
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
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
                  delay: index * 0.1,
                }}
                className="
                  p-8
                  rounded-3xl
                  border
                  border-gray-200
                  dark:border-gray-800
                  bg-[#F8FAFC]
                  dark:bg-[#111827]
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
                    text-2xl
                    font-semibold
                    text-[#0C2B4E]
                    dark:text-white
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mt-4
                    text-gray-600
                    dark:text-gray-400
                    leading-relaxed
                  "
                >
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default SecurityAccess;