import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserAvatar from "../common/UserAvatar";
import ThemeToggle from "../ThemeToggle";

const MotionNavLink = motion(NavLink);

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

  const { user, loading } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0C2B4E]/95 backdrop-blur-md border-b border-[#1D546C] dark:bg-[#020817]/95 dark:border-[#111827] transition-colors">
      <div className="mx-auto  px-4 md:ps-12 md:pe-8 h-20 flex items-center justify-between">
        {/* Logo */}

        <Link to="/">
          <img src="/White-Logo.png" alt="FlowSync ERP" className="h-10" />
        </Link>

        {/* Desktop Menu */}

        <div className="hidden lg:flex items-center gap-8 text-white/90">
          {navItems.map((item) => (
            <MotionNavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              initial="rest"
              whileHover="hover"
              animate="rest"
              className={({ isActive }) =>
                `relative overflow-hidden px-1 py-1 transition-colors duration-200 ${
                  isActive
                    ? "text-white font-medium"
                    : "text-white/90 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative z-10">{item.label}</span>

                  {isActive ? (
                    <span
                      className="
                absolute
                left-0
                bottom-0
                h-[3px]
                w-full
                rounded-full
                bg-white
              "
                    />
                  ) : (
                    <motion.span
                      className="
                absolute
                left-0
                bottom-0
                h-[2px]
                w-full
                origin-left
                bg-white
              "
                      variants={underlineVariants}
                    />
                  )}
                </>
              )}
            </MotionNavLink>
          ))}
        </div>

        {/* Desktop Buttons */}

        <div className="hidden lg:flex items-center gap-3">
          {!loading &&
            (user ? (
              <Link
                to="/dashboard"
                title="Dashboard"
                className="
                    hover:scale-105
                    transition-transform
                    duration-200
                  "
              >
                <UserAvatar user={user} size="sm" iconClassName="text-white" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="
                      mt-0.5
                      px-6
                      py-2
                      rounded-sm
                      border
                      border-gray-400
                      text-white
                      hover:bg-white
                      hover:text-[#0C2B4E]
                      hover:border-white
                      transition-all
                      duration-300
                    "
                >
                  Login
                </Link>
              </>
            ))}
          <ThemeToggle />
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

          <div className="flex flex-col p-6 gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `
              group
              flex
              items-center
              gap-2
              py-2
              transition-all
              duration-300
              ${
                isActive
                  ? "text-white font-medium"
                  : "text-white/80 hover:text-white"
              }
            `
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Indicator */}

                    <div className="w-[3px] h-7 flex items-center justify-center">
                      {isActive && (
                        <motion.span
                          layoutId="mobile-active-nav"
                          className="w-[3px] h-7 rounded-full bg-white"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                    </div>

                    <span className="text-lg">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}

            <div className="pt-3 flex flex-col gap-3">
              {!loading &&
                (user ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="
                      flex
                      items-center
                      gap-3
                      py-2
                      text-white
                    "
                  >
                    <UserAvatar
                      user={user}
                      size="sm"
                      iconClassName="text-white"
                    />

                    <span className="font-medium">Dashboard</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="
                        text-center
                        bg-white
                        text-[#0C2B4E]
                        py-3
                        rounded-xl
                        font-medium
                        hover:bg-gray-100
                        transition
                      "
                    >
                      Login
                    </Link>
                  </>
                ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
