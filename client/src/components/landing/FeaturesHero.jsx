import { motion } from "framer-motion";
import {
  ShoppingCart,
  BarChart3,
  ShieldCheck,
  Mail,
} from "lucide-react";

function FeaturesHero() {
  const badges = [
    {
      icon: ShoppingCart,
      label: "Order Management",
    },
    {
      icon: BarChart3,
      label: "Analytics",
    },
    {
      icon: ShieldCheck,
      label: "Permissions",
    },
    {
      icon: Mail,
      label: "Email Notifications",
    },
  ];

  return (
    <section
      className="
        relative
        overflow-hidden
        pt-28
        md:pt-40
        pb-24
        bg-[#F8FAFC]
        dark:bg-[#020817]
      "
    >
      {/* Glow Effects */}

      <div
        className="
          absolute
          inset-0
          pointer-events-none
        "
      >
        <div
          className="
            absolute
            top-0
            left-1/4
            w-96
            h-96
            bg-blue-500/10
            blur-[140px]
            rounded-full
          "
        />

        <div
          className="
            absolute
            bottom-0
            right-1/4
            w-96
            h-96
            bg-cyan-500/10
            blur-[140px]
            rounded-full
          "
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="text-center"
        >
          <span
            className="
              inline-flex
              items-center
              px-4
              py-2
              rounded-full
              bg-blue-100
              text-blue-700
              dark:bg-blue-500/10
              dark:text-blue-300
              text-sm
              font-medium
            "
          >
            Everything FlowSync Offers
          </span>

          <h1
            className="
              mt-6
              text-[45px]
              md:text-6xl
              font-bold
              text-[#0C2B4E]
              dark:text-white
              leading-tight
            "
          >
            Powerful Features For
            <br />
            Modern Business Operations
          </h1>

          <p
            className="
              mt-6
              max-w-3xl
              mx-auto
              text-lg
              text-gray-600
              dark:text-gray-400
            "
          >
            Manage orders, employees, analytics,
            permissions, notifications and business
            workflows from one centralized ERP platform.
          </p>

          {/* Badges */}

          <div
            className="
              mt-10
              flex
              flex-wrap
              justify-center
              gap-4
            "
          >
            {badges.map((badge) => {
              const Icon = badge.icon;

              return (
                <div
                  key={badge.label}
                  className="
                    flex
                    items-center
                    gap-2
                    px-4
                    py-3
                    rounded-2xl
                    bg-white
                    dark:bg-[#111827]
                    border
                    border-gray-200
                    dark:border-gray-800
                    shadow-sm
                  "
                >
                  <Icon
                    size={18}
                    className="
                      text-[#0C2B4E]
                      dark:text-blue-400
                    "
                  />

                  <span
                    className="
                      text-sm
                      font-medium
                      dark:text-white
                    "
                  >
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturesHero;