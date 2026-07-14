import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is FlowSync ERP?",
    answer:
      "FlowSync ERP is a MERN-stack enterprise resource planning application built to manage business operations such as authentication, order management, analytics, employee management, and role-based access control.",
  },
  {
    question: "Can I explore FlowSync ERP?",
    answer:
      "Yes. You can register and explore the available modules and workflows implemented within the application.",
  },
  {
    question: "Which features are currently available?",
    answer:
      "FlowSync currently includes secure authentication, role-based access, dashboards, order management, analytics, activity logs, responsive UI, image uploads, email services, and profile management.",
  },
  {
    question: "Can I share feedback or suggest new features?",
    answer:
      "Simply use the contact form above and select the appropriate inquiry type. We'd love to hear your suggestions and feedback.",
  },
  {
    question: "Will new features continue to be added?",
    answer:
      "Absolutely. The application is designed with scalability in mind, making it easier to extend with additional modules and capabilities over time.",
  },
  {
    question: "How quickly can I expect a response?",
    answer:
      "We usually respond within 24–48 hours depending on the nature of the inquiry.",
  },
];

function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-20 bg-white dark:bg-[#020817] pb-80">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span
            className="
                inline-flex
                px-4
                py-1
                rounded-full
                bg-slate-100
                dark:bg-slate-800
                text-sm
                font-semibold
                text-slate-700
                dark:text-slate-200
                "
          >
            Frequently Asked Questions
          </span>

          <h2
            className="
                mt-5
                text-3xl
                md:text-4xl
                font-bold
                text-slate-900
                dark:text-white
                "
          >
            Got Questions?
          </h2>

          <p
            className="
                mt-4
                text-slate-600
                dark:text-slate-400
                "
          >
            Everything you need to know before getting started with FlowSync
            ERP.
          </p>
        </motion.div>
        <div className="mt-14 space-y-5">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              className="
                rounded-3xl
                border
                border-slate-200
                dark:border-slate-800
                bg-slate-50
                dark:bg-[#0B1121]
                overflow-hidden
                transition-all
                duration-300
                hover:border-sky-900/60
                hover:shadow-lg
                "
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="
                 w-full
                 flex
                 items-center
                 justify-between
                 text-left
                 p-6
                 "
              >
                <h3
                  className="
                    font-semibold
                    text-lg
                    text-slate-900
                    dark:text-white
                    "
                >
                  {faq.question}
                </h3>
                <ChevronDown
                  size={22}
                  className={`transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                    className="overflow-hidden"
                  >
                    <p
                      className="
                        px-6
                        pb-6
                        leading-7
                        text-slate-600
                        dark:text-slate-400
                        "
                    >
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default ContactFAQ;
