import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Clock,
  User,
  MessageSquare,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

const categories = [
  "General Inquiry",
  "Project Feedback",
  "Feature Request",
  "Bug Report",
  "Learning Discussion",
  "Other",
];

const formVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.35, ease: "easeOut" },
  }),
};

function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "",
    message: "",
  });

  const inputClass = `
    w-full
    rounded
    border
    border-slate-200
    dark:border-slate-800
    bg-slate-50
    dark:bg-[#08101F]
    text-slate-900
    dark:text-white
    placeholder:text-slate-400
    focus:outline-none
    focus:ring-2
    focus:ring-sky-400/80
    focus:border-transparent
    transition-all
    duration-300
    shadow-sm
    shadow-slate-900/5
    `;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.inquiryType ||
      !formData.message.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          subject: `FlowSync Contact - ${formData.inquiryType}`,
          message: formData.message,
          replyto: formData.email,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Message sent successfully");
        setFormData({
          name: "",
          email: "",
          inquiryType: "",
          message: "",
        });
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      className="relative overflow-hidden pt-10 md:pt-20 pb-12 sm:pt-32 sm:pb-24 bg-slate-50 dark:bg-[#020817]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 sm:h-64 bg-gradient-to-b from-sky-500/10 to-transparent dark:from-slate-900/0" />
      <div className="pointer-events-none absolute right-0 top-24 hidden h-72 w-72 rounded-full bg-sky-500/10 blur-3xl xl:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
            Ready to talk about your workflow goals?
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-400">
            Submit your request and our team will respond with the fastest
            route.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 xl:grid-cols-[2fr_1.05fr]">
          <motion.div
            variants={formVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="min-w-0 relative rounded border border-slate-200/80 bg-white/95 shadow-[0_40px_120px_-80px_rgba(15,23,42,0.25)] dark:border-slate-800 dark:bg-[#0b1121]"
          >
            <div className="hidden sm:block absolute -left-10 top-10 h-28 w-28 rounded-full bg-sky-400/10 blur-3xl" />
            <div className="hidden sm:block absolute right-8 top-8 h-20 w-20 rounded-full border border-sky-300/40 bg-white/30 blur-xl dark:border-sky-500/30 dark:bg-slate-900/50" />
            <div className="relative z-10 p-5 sm:p-6 md:p-10">
              <div className="mb-8 space-y-3">
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Let's collaborate
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
                  Send Us A Message
                </h3>
                <p className="max-w-2xl text-slate-600 dark:text-slate-400">
                  Tell us about your project, question, or the employee workflow
                  you want to streamline.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-5">
                <motion.div
                  custom={0}
                  variants={fieldVariants}
                  className="grid gap-2"
                >
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`${inputClass} pl-12 py-4`}
                    />
                  </div>
                </motion.div>

                <motion.div
                  custom={1}
                  variants={fieldVariants}
                  className="grid gap-2"
                >
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${inputClass} pl-12 py-4`}
                    />
                  </div>
                </motion.div>

                <motion.div
                  custom={2}
                  variants={fieldVariants}
                  className="grid gap-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Inquiry Type
                    </label>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Choose one
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categories.map((item) => (
                      <motion.button
                        key={item}
                        type="button"
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            inquiryType: item,
                          }))
                        }
                        className={`rounded border px-4 py-3 text-left text-sm font-medium transition-all duration-100 ${
                          formData.inquiryType === item
                            ? "border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-500/15"
                            : "border-slate-200 bg-white text-slate-700 hover:border-sky-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#08101F] dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-900/60 dark:hover:text-slate-100"
                        }`}
                      >
                        {item}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  custom={3}
                  variants={fieldVariants}
                  className="relative"
                >
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Your Message
                  </label>
                  <div className="relative">
                    <MessageSquare
                      size={18}
                      className="pointer-events-none absolute left-4 top-4 text-slate-400"
                    />
                    <textarea
                      id="message"
                      rows={5}
                      name="message"
                      placeholder="Tell us about your requirements, timeline, or workflow goals."
                      value={formData.message}
                      onChange={handleChange}
                      className={`${inputClass} pl-12 resize-none min-h-[150px] pt-4`}
                    />
                  </div>
                </motion.div>

                <motion.button
                  custom={4}
                  variants={fieldVariants}
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: submitting ? 1 : 1.01 }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                  className="inline-flex w-full items-center justify-center gap-3 rounded bg-gradient-to-r from-[#0C2B4E] via-[#123963] to-[#1A568E] px-6 py-4 text-base font-semibold text-white shadow-lg shadow-[#0C2B4E]/25 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, delay: 0.12 }}
            className="min-w-0 space-y-7 rounded border border-slate-200/80 bg-slate-50/90 p-6 sm:p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.2)] dark:border-slate-800 dark:bg-[#07111f]/90"
          >
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Get In Touch
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                We’re here to help you move faster with reliable ERP support,
                product demos and backend integration guidance.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4 rounded border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-[#08101F]">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-500">
                  <Mail size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    Email
                  </h4>

                  <p
                    className="
                      text-slate-500
                      dark:text-slate-400
                      break-all
                      text-sm
                      sm:text-base
                    "
                  >
                    shruti.kashyap.dubey@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-[#08101F]">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-500">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    Location
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400">India</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-[#08101F]">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-500">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    Response Time
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400">
                    Usually within 24 hours
                  </p>
                </div>
              </div>
              <div className="mt-8 rounded border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-[#08101F] p-5">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Why FlowSync?
                </h4>

                <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                  <li>✓ Role-based employee management</li>
                  <li>✓ Real-time workflow tracking</li>
                  <li>✓ Analytics & reporting dashboard</li>
                  <li>✓ Secure JWT authentication</li>
                  <li>✓ Modern responsive interface</li>
                </ul>
              </div>
              <div className="rounded border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-[#08101F] p-5">
                <h4 className="text-slate-900 dark:text-white font-semibold mb-3">
                  Availability
                </h4>

                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>

                  <span className="text-slate-400 dark:text-slate-500">
                    Accepting new projects
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                  Average response time under 24 hours.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export default ContactFormSection;
