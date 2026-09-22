import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is FlowSync?",
    answer:
      "FlowSync is a MERN-based ERP platform built to bring everyday business operations into one place, including order management, employee management, analytics, permissions, reporting and activity tracking.",
  },
  {
    question: "Can I explore FlowSync?",
    answer:
      "Yes. You can create an account and explore the workflows and features available in the application. Some capabilities are controlled by your assigned role and permissions.",
  },
  {
    question: "What can I do with FlowSync?",
    answer:
      "FlowSync includes order management, analytics, employee management, role-based permissions, activity and audit tracking, report exports, profile management, real-time updates and an AI-powered assistant.",
  },
  {
    question: "How does access control work?",
    answer:
      "FlowSync uses role-based access with granular permissions. Different users can have different capabilities, while sensitive actions remain restricted to authorized users.",
  },
  {
    question: "What can the FlowSync Assistant do?",
    answer:
      "The FlowSync Assistant can help users understand features, workflows and platform capabilities. For signed-in users, it can also provide answers based on their role and assigned permissions.",
  },
  {
    question: "How does FlowSync keep accounts secure?",
    answer:
      "FlowSync uses secure authentication with account verification and password recovery workflows. Access to protected areas is also enforced through authentication, roles and permissions.",
  },
  {
    question: "Can I share feedback or suggest a feature?",
    answer:
      "Absolutely. Use the contact form to share feedback, report an issue, ask a question or suggest an idea for FlowSync.",
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
            Everything you need to know before getting started with FlowSync.
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
                rounded-sm
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
