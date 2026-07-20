import { Link, Links } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiGlobeAlt } from "react-icons/hi";

function Footer({ hasCTA = false }) {
  return (
    <footer
      className={`
        bg-[#06152B]
        text-white
         ${hasCTA ? "pt-75 md:pt-48" : "md:pt-16 pt-12"}
        pb-5
        relative
        overflow-hidden`}
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
            left-0
            top-0
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
            right-0
            bottom-0
            w-96
            h-96
            bg-cyan-500/10
            blur-[140px]
            rounded-full
          "
        />
      </div>

      <div className=" mx-auto px-4 md:px-14 relative z-10">
        <div
          className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-[2fr_1fr_1fr_1fr]
              gap-12
            "
        >
          {/* Brand */}

          <div>
            <Link to="/">
             <img src="/White-Logo.png" alt="FlowSync ERP" className="h-14" />
            </Link>
            

            <p
              className="
                  mt-5
                  max-w-md
                  text-gray-400
                  leading-relaxed
                "
            >
              Centralized ERP platform for managing orders, analytics, employee
              administration and business operations from a single dashboard.
            </p>

            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://github.com/the-creative-one"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <FaGithub size={32} />
              </a>

              <a
                href="https://www.linkedin.com/in/shrutidubey17"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <FaLinkedin size={32} />
              </a>

              <a
                href="https://shrutidubey.netlify.app"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <HiGlobeAlt size={32} />
              </a>
            </div>
          </div>

          {/* Quick Links */}

          <div>
            <h3 className="font-semibold text-lg mb-5">Quick Links</h3>

            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to="/features" className="hover:text-white transition">
                  Features
                </Link>
              </li>

              <li>
                <Link to="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>

              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}

          <div>
            <h3 className="font-semibold text-lg mb-5">Features</h3>

            <ul className="space-y-3 text-gray-400">
              <li>Orders Management</li>

              <li>Analytics Dashboard</li>

              <li>User Management</li>

              <li>Role Permissions</li>
              <li>AI Assistant</li>
            </ul>
          </div>

          {/* Legal Pages */}

          <div>
            <h3 className="font-semibold text-lg mb-5">Legal</h3>

            <ul className="space-y-3 text-gray-400">
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-white transition"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms-conditions"
                  className="hover:text-white transition"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}

        <div
          className="
            mt-12
            pt-5
            border-t
            border-white/10
            flex
            flex-col
            md:flex-row
            justify-between
            items-center
            gap-4
          "
        >
          <p className="text-gray-500 text-sm">
            © 2026 FlowSync ERP. All rights reserved.
          </p>

          <p className="text-gray-500 text-sm">Smart. Fast. Connected.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
