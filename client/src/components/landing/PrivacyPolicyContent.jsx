import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Database,
  Lock,
  Cookie,
 Mail,
  RefreshCcw,
} from "lucide-react";

const sections = [
  {
    icon: ShieldCheck,
    title: "Introduction",
    content:
      "FlowSync ERP values your privacy and is committed to protecting your information. This Privacy Policy explains what information we collect, how we use it, and the measures we take to keep it secure while you use the application.",
  },
  {
    icon: Database,
    title: "Information We Collect",
    content:
      "We may collect information that you voluntarily provide during account registration, authentication, profile updates, and contact form submissions. Basic application usage information may also be collected to improve the platform and enhance the overall user experience.",
  },
  {
    icon: Lock,
    title: "How We Use Your Information",
    content:
      "Your information is used to authenticate users, manage application features, personalize the user experience, respond to inquiries, improve application performance, and maintain platform security.",
  },
  {
    icon: Cookie,
    title: "Third-Party Services",
    content:
      "FlowSync ERP integrates trusted third-party services including Cloudinary for media storage and Web3Forms for contact form submissions. These providers process information according to their own privacy policies.",
  },
  {
    icon: RefreshCcw,
    title: "Policy Updates",
    content:
      "As FlowSync ERP continues to evolve, this Privacy Policy may be updated from time to time. Any future modifications will be reflected on this page with an updated revision date.",
  },
  {
    icon: Mail,
    title: "Contact Us",
    content:
      "If you have any questions regarding this Privacy Policy or how your information is handled, you can reach us through the Contact page available on this website.",
  },
];

const lastUpdated = new Date().toLocaleDateString("en-IN", {
  month: "long",
  year: "numeric",
});

function PrivacyPolicyContent() {
  return (
    <section className="bg-slate-50 dark:bg-[#020817] pt-28 pb-20">
      <div className="px-16">
        {/* Hero */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mx-auto"
        >
          <span
            className="
              inline-flex
              items-center
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
            Privacy & Security
          </span>

          <h1
            className="
              mt-6
              text-4xl
              md:text-5xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            Privacy Policy
          </h1>

          <p
            className="
              mt-6
              text-lg
              leading-8
              text-slate-600
              dark:text-slate-400
            "
          >
            We believe transparency builds trust. This page explains how
            FlowSync ERP collects, uses, and safeguards your information.
          </p>

          <p
            className="
              mt-4
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            Last Updated • {lastUpdated}
          </p>
        </motion.div>

        {/* Divider */}

        <div className="mt-16 border-t border-slate-200 dark:border-slate-800" />

        {/* Sections */}

        <div>
          {sections.map((section, index) => {
            const Icon = section.icon;

            return (
              <motion.section
                key={section.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                }}
                className="
                  py-10
                  border-b
                  border-slate-200
                  dark:border-slate-800
                "
              >
                <div className="flex items-start gap-5">
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-gradient-to-br
                      from-[#0C2B4E]
                      to-[#1A568E]
                      text-white
                    "
                  >
                    <Icon size={22} />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                      {section.title}
                    </h2>

                    <p
                      className="
                        mt-5
                        leading-8
                        text-slate-600
                        dark:text-slate-400
                      "
                    >
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.section>
            );
          })}
        </div>

        {/* Footer */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="
            mt-16
            dark:border-slate-800
            text-center
          "
        >
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Still Have Questions?
          </h3>

          <p
            className="
              mt-4
              max-w-3xl
              mx-auto
              leading-8
              text-slate-600
              dark:text-slate-400
            "
          >
            If you'd like to know more about how FlowSync ERP handles your data,
            feel free to reach out through our contact page. We'll be happy to
            answer any questions you may have.
          </p>

          <Link
            to="/contact"
            className="
              inline-flex
              items-center
              gap-2
              mt-8
              font-semibold
              text-[#0C2B4E]
              dark:text-sky-400
              hover:gap-3
              transition-all
            "
          >
            Contact Us →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default PrivacyPolicyContent;