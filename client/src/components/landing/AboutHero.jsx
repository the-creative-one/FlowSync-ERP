import { motion } from "framer-motion";

function AboutHero() {
  return (
    <section
      className="
        relative
        overflow-hidden
        pt-30
        md:pt-40
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
            FlowSync was built to bring everyday business operations into one
            connected workspace, giving teams a clearer view of their work,
            better control over access, and the tools to act on what matters.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutHero;
