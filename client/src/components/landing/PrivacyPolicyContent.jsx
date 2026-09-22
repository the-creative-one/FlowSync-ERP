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
      "FlowSync respects your privacy and is committed to protecting the information you provide while using the application. This Privacy Policy explains what information may be collected, how it is used, and the steps taken to keep it secure.",
  },
  {
    icon: Database,
    title: "Information We Collect",
    content:
      "FlowSync may collect information you provide when creating an account, verifying your email address, managing your profile, using application features, or submitting a contact request. This may include account details, profile information, and information required to provide and secure the application's features.",
  },
  {
    icon: Lock,
    title: "How We Use Your Information",
    content:
      "Information is used to authenticate accounts, provide access to application features, manage user profiles and permissions, respond to inquiries, maintain application security, and operate the platform. We only use information where it is necessary for these purposes.",
  },
  {
    icon: Cookie,
    title: "Third-Party Services",
    content:
      "FlowSync uses selected third-party services to support specific application functionality, such as media storage and contact form submissions. Information shared with these services is handled according to their respective privacy policies and the purpose for which the service is used.",
  },
  {
    icon: RefreshCcw,
    title: "Policy Updates",
    content:
      "As FlowSync evolves, this Privacy Policy may be updated to reflect changes to the application, its features, or how information is handled. Any changes will be published on this page along with an updated revision date.",
  },
  {
    icon: Mail,
    title: "Contact Us",
    content:
      "If you have questions about this Privacy Policy, your information, or how FlowSync handles data, you can reach us through the Contact page. We will do our best to address your concerns and provide the relevant information.",
  },
];

const lastUpdated = new Date().toLocaleDateString("en-IN", {
  month: "long",
  year: "numeric",
});

function PrivacyPolicyContent() {
  return (
    <section className="bg-slate-50 dark:bg-[#020817] pt-28 pb-20">
      <div className="px-6 md:px-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mx-auto"
        >
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
            FlowSync collects, uses, and safeguards your information.
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
                {/* Mobile: Icon + Title */}
                <div className="flex items-center gap-4 md:hidden">
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

                  <h2
                    className="
              text-2xl
              font-semibold
              text-slate-900
              dark:text-white
            "
                  >
                    {section.title}
                  </h2>
                </div>

                {/* Mobile: Paragraph */}
                <p
                  className="
            mt-5
            leading-8
            text-slate-600
            dark:text-slate-400
            md:hidden
          "
                >
                  {section.content}
                </p>

                {/* Desktop / Tablet */}
                <div className="hidden md:flex items-start gap-5">
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
                    <h2
                      className="
                text-2xl
                font-semibold
                text-slate-900
                dark:text-white
              "
                    >
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
            text-center
          "
        >
          <h3
            className="
              text-2xl
              font-semibold
              text-slate-900
              dark:text-white
            "
          >
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
            If you'd like to know more about how FlowSync handles your data,
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
