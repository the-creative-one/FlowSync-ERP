import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText,
  UserCheck,
  Shield,
  Ban,
  Copyright,
  AlertTriangle,
  RefreshCcw,
  Mail,
} from "lucide-react";

const sections = [
  {
    icon: FileText,
    title: "Acceptance of Terms",
    content:
      "By accessing or using FlowSync ERP, you agree to comply with these Terms and Conditions. If you do not agree with any part of these terms, please discontinue the use of this application.",
  },
  {
    icon: UserCheck,
    title: "User Responsibilities",
    content:
      "Users are responsible for maintaining accurate account information, protecting their login credentials, and using the platform responsibly. Any misuse of the application or attempts to compromise its security are strictly prohibited.",
  },
  {
    icon: Shield,
    title: "Account Security",
    content:
      "You are responsible for maintaining the confidentiality of your account credentials. FlowSync ERP cannot be held responsible for unauthorized access resulting from compromised login information.",
  },
  {
    icon: Copyright,
    title: "Intellectual Property",
    content:
      "All source code, branding, user interface designs, graphics, documentation, and content associated with FlowSync ERP remain the intellectual property of the project owner unless otherwise stated.",
  },
  {
    icon: Ban,
    title: "Acceptable Use",
    content:
      "Users must not misuse the application, attempt unauthorized access, interfere with platform functionality, upload malicious content, or engage in activities that could negatively impact other users or system stability.",
  },
  {
    icon: AlertTriangle,
    title: "Disclaimer",
    content:
      "FlowSync ERP is a learning and portfolio project developed to demonstrate modern full-stack application development. While every effort has been made to ensure reliability, no guarantees are provided regarding uninterrupted availability or complete accuracy.",
  },
  {
    icon: RefreshCcw,
    title: "Changes to These Terms",
    content:
      "These Terms and Conditions may be updated periodically as the application evolves. Continued use of the application after updates constitutes acceptance of the revised terms.",
  },
  {
    icon: Mail,
    title: "Contact Information",
    content:
      "If you have any questions regarding these Terms and Conditions, please reach out using the Contact page available on this website.",
  },
];

const lastUpdated = new Date().toLocaleDateString("en-IN", {
  month: "long",
  year: "numeric",
});

function TermsConditionsContent() {
  return (
    <section className="bg-slate-50 dark:bg-[#020817] pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-6">

        {/* Hero */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
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
            Legal Information
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
            Terms & Conditions
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
            These Terms and Conditions outline the rules, responsibilities, and
            expectations for using FlowSync ERP. By using this application, you
            agree to abide by the terms described below.
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

        {/* Content */}

        <div className="mt-6">
          {sections.map((section, index) => {
            const Icon = section.icon;

            return (
              <motion.section
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
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
            pt-12
            border-t
            border-slate-200
            dark:border-slate-800
            text-center
          "
        >
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Questions About These Terms?
          </h3>

          <p
            className="
              mt-4
              max-w-2xl
              mx-auto
              leading-8
              text-slate-600
              dark:text-slate-400
            "
          >
            If anything within these Terms and Conditions is unclear, feel free
            to contact us. We'll be happy to provide additional clarification.
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

export default TermsConditionsContent;