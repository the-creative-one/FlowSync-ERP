import { motion } from "framer-motion";

function AboutHero() {
  return (
    <section
      className="
        relative
        overflow-hidden
        pt-40
        pb-24
        bg-[#F8FAFC]
        dark:bg-[#020817]
      "
    >
      {/* Background Glow */}

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
            About FlowSync ERP
          </span>

          <h1
            className="
              mt-6
              text-5xl
              md:text-6xl
              font-bold
              text-[#0C2B4E]
              dark:text-white
              leading-tight
            "
          >
            Built To Simplify
            <br />
            Business Operations
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
            FlowSync ERP centralizes order management,
            analytics, employee administration and
            operational workflows into a unified platform
            designed for modern businesses.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutHero;