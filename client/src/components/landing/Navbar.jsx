import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

const MotionLink = motion(Link);

const navItems = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const underlineVariants = {
  rest: { scaleX: 0, opacity: 0 },
  hover: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.28, ease: "easeOut" },
  },
};

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0C2B4E]/95 backdrop-blur-md border-b border-[#1D546C] dark:bg-[#020817]/95 dark:border-[#111827] transition-colors">
      <div className="mx-auto px-4 md:px-12 h-20 flex items-center justify-between">
        {/* Logo */}

        <Link to="/">
          <img src="/White-Logo.png" alt="FlowSync ERP" className="h-10" />
        </Link>

        {/* Desktop Menu */}

        <div className="hidden lg:flex items-center gap-8 text-white/90">
          {navItems.map((item) => (
            <MotionLink
              to={item.to}
              key={item.to}
              className="relative overflow-hidden px-1 py-1"
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              <span className="relative z-10 transition-colors duration-200 group-hover:text-white">
                {item.label}
              </span>
              <motion.span
                className="absolute left-0 bottom-0 h-[2px] w-full origin-left bg-white"
                variants={underlineVariants}
              />
            </MotionLink>
          ))}
        </div>

        {/* Desktop Buttons */}

        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/login"
            className="
                px-5
                py-2
                rounded-xl
                border
                border-white/30
                text-white
                hover:bg-white
                hover:text-[#0C2B4E]
                transition
                "
          >
            Login
          </Link>

          <Link
            to="/register"
            className="
                px-5
                py-2
                rounded-xl
                bg-white
                text-[#0C2B4E]
                font-medium
                hover:bg-[#0C2B4E]
                hover:text-white
                hover:border
                hover:border-white/40
                transition
                dark:bg-white
                dark:text-[#020817]
                dark:hover:bg-[#020817]
                dark:hover:text-white
                dark:hover:border-white/40
                "
          >
            Register
          </Link>
        </div>

        {/* Mobile Button */}

        <div className="lg:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}

      {mobileOpen && (
        <div
          className="
      lg:hidden
      relative
      bg-[#0C2B4E]
      dark:bg-[#020817]
      border-t
      border-[#1D546C]
      dark:border-[#111827]
    "
        >
          <div className="absolute top-5 right-5">
            <ThemeToggle />
          </div>
          <div className="flex flex-col p-6 gap-4">
            <Link to="/" className="text-white font-medium">
              Home
            </Link>

            <Link to="/features" className="text-white">
              Features
            </Link>

            <Link to="/about" className="text-white">
              About
            </Link>

            <Link to="/contact" className="text-white">
              Contact
            </Link>

            <div className=" pt-2 flex flex-col gap-3">
              <Link
                to="/login"
                className="
            text-center
            border
            border-white/30
            text-white
            py-3
            rounded-xl
          "
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
            text-center
            bg-white
            text-[#0C2B4E]
            py-3
            rounded-xl
            font-medium
          "
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
