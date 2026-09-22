import { motion } from "framer-motion";
import { Target, Compass } from "lucide-react";

function BuiltWithPurpose() {
  const cards = [
    {
      icon: Target,
      title: "Why We Built FlowSync",
      description:
        "Managing operations shouldn't mean jumping between disconnected tools or losing track of who can access what. FlowSync brings orders, people, analytics and operational activity together so the bigger picture is easier to understand.",
    },
    {
      icon: Compass,
      title: "Our Long-Term Direction",
      description:
        "FlowSync is designed around a modular foundation that can grow with the needs of a business, from everyday order management and team access to analytics, reporting and intelligent assistance.",
    },
  ];

  return (
    <section
      className="
        pt-15
        pb-20
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
            Behind The Build
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
            FlowSync is designed to simplify business
            operations while providing the visibility and
            control teams need to work effectively.
          </p>
        </div>

        <div
          className="
            mt-16
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-8
          "
        >
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
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
                  duration: 0.5,
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
                    mt-6
                    text-2xl
                    font-semibold
                    text-[#0C2B4E]
                    dark:text-white
                  "
                >
                  {card.title}
                </h3>

                <p
                  className="
                    mt-4
                    text-gray-600
                    dark:text-gray-400
                    leading-relaxed
                  "
                >
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default BuiltWithPurpose;