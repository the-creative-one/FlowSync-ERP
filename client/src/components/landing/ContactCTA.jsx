import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function ContactCTA() {
  return (
    <section
      className="
        relative
        overflow-visible
        md:-mt-60
        md:-mb-36
        -mt-64
        -mb-64
      "
    >

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="
            relative
            bg-white
            dark:bg-[#0F172A]
            border
            border-gray-200
            dark:border-gray-800
            rounded-[6px]
            shadow-2xl
            px-8
            md:px-16
            py-14
            text-center
          "
        >
          {/* Decorative Circles */}

          <div
            className="
              absolute
              top-5
              left-4
              lg:top-10
              lg:left-10
              w-3
              h-3
              rounded-full
              bg-cyan-400
            "
          />

          <div
            className="
              absolute
              bottom-5
              right-4
              lg:bottom-10
              lg:right-10
              w-3
              h-3
              rounded-full
              bg-blue-500
            "
          />

          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              pointer-events-none
            "
          ></div>

          <div className="relative z-10">
            <h2
              className="
                text-3xl
                md:text-[40px]
                font-bold
                text-[#0C2B4E]
                dark:text-white
              "
            >
              Ready To Scale Your Operations?
            </h2>

            <p
              className="
                mt-5
                max-w-3xl
                mx-auto
                text-lg
                text-gray-600
                dark:text-gray-400
              "
            >
              Manage orders, employees, analytics and business workflows from
              one centralized platform built for modern teams.
            </p>

            <div
              className="
                mt-10
                flex
                flex-col
                sm:flex-row
                justify-center
                gap-4
              "
            >
              <Link
                to="/register"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-8
                  py-3
                  rounded-full
                  bg-[#0C2B4E]
                  text-white
                  font-semibold
                  hover:scale-102
                  transition-all
                "
              >
                Get Started
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/contact"
                className="
                  inline-flex
                  items-center
                  justify-center
                  px-8
                  py-3
                  rounded-full
                  border
                  border-gray-300
                  dark:border-gray-700
                  text-[#0C2B4E]
                  dark:text-white
                  hover:bg-gray-50
                  dark:hover:bg-[#1E293B]
                  transition-all
                "
              >
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ContactCTA;
