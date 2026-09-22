import { motion } from "framer-motion";
import { Send, SearchCheck, Clock3, MessagesSquare } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Submit Your Message",
    description:
      "Share your question, feedback, feature request, or anything you'd like to discuss about FlowSync.",
    icon: Send,
  },
  {
    number: "02",
    title: "We'll Review It",
    description:
      "We'll carefully review your message and understand your request before responding.",
    icon: SearchCheck,
  },
  {
    number: "03",
    title: "Response Within 24 Hours",
    description:
      "If your inquiry requires a reply, we'll get back to you through the email address you provided.",
    icon: Clock3,
  },
  {
    number: "04",
    title: "Continue The Conversation",
    description:
      "We'll answer your questions and continue the discussion about FlowSync or your feedback.",
    icon: MessagesSquare,
  },
];

function ContactProcess() {
  return (
    <section className="py-10 md:py-20 bg-slate-50 dark:bg-[#020817]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span
            className="
              inline-flex
              rounded-full
              bg-slate-100
              dark:bg-slate-800
              px-4
              py-1
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Simple & Transparent
          </span>

          <h2 className="mt-5 text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            What Happens Next?
          </h2>

          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Once you submit the contact form, here's what you can expect from
            us.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.02,
                }}
                whileHover={{
                  y: -8,
                }}
                className="
                 relative
                 rounded-3xl
                 border
                 border-slate-200
                 dark:border-slate-800
                 bg-white
                 dark:bg-[#0B1121]
                 p-8
                 shadow-sm
                 hover:shadow-xl
                 transition-all
                 duration-300
                 "
              >
                <span
                  className="
                    absolute
                    right-6
                    top-6
                    text-sm
                    font-bold
                    text-sky-500
                    "
                >
                  {step.number}
                </span>
                <div
                  className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    bg-gradient-to-br
                    from-[#0C2B4E]
                    to-[#1A568E]
                    text-white
                    shadow-lg
                    shadow-[#0C2B4E]/20
                    "
                >
                  <Icon size={28} />
                </div>
                <h3
                  className="
                    mt-6
                    text-xl
                    font-semibold
                    text-slate-900
                    dark:text-white
                    "
                >
                  {step.title}
                </h3>
                <p
                  className="
                    mt-3
                    leading-7
                    text-slate-600
                    dark:text-slate-400
                    "
                >
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ContactProcess;
