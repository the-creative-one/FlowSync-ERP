import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-[#F8FAFC] dark:bg-[#020817] pt-30 transition-colors">
      <div className="max-w-7xl mx-auto px-5 md:px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              bg-blue-100
              dark:bg-blue-500/10
              text-[#0C2B4E]
              dark:text-blue-300
              mb-6
            "
          >
            <Sparkles size={16} />
            <span>Modern ERP Platform</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0C2B4E] dark:text-white leading-[1.1]">
            Streamline Your Business Operations With One Powerful ERP Platform
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Manage orders, track performance, collaborate with teams and gain
            real-time insights through a centralized business management system.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-2xl bg-[#0C2B4E] text-white hover:scale-103
                transition-all duration-300"
            >
              Get Started
            </Link>

            <a
              href="#features"
              className="
                px-6
                py-3
                rounded-2xl
                border
                border-gray-300
                text-[#0C2B4E]
                hover:bg-gray-100
                hover:scale-103
                transition-all duration-300
                dark:border-gray-600
                dark:text-white
                dark:hover:bg-[#111827]
                "
            >
              Explore Features
            </a>
          </div>
        </motion.div>

        {/* Right */}

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-xl p-6 transition-colors">
            <div className="relative h-[350px] rounded-2xl bg-gradient-to-br from-[#0C2B4E] to-[#2563EB]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
