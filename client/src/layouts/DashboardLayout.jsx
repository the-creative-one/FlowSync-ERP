import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import NotificationBell from "../components/common/NotificationBell";
import { Menu } from "lucide-react";
function DashboardLayout({ children, title, subtitle }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="
        h-screen
        flex
        overflow-hidden
        bg-[#F4F4F4]
        dark:bg-[#020817]
        transition-colors
      "
    >
      {/* SIDEBAR */}
      <>
        {/* DESKTOP SIDEBAR */}
        <div className="hidden md:flex h-screen sticky top-0">
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />
        </div>
        {/* MOBILE SIDEBAR */}
        <div
          className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
            mobileOpen ? "visible bg-black/50" : "invisible"
          }`}
          onClick={() => setMobileOpen(false)}
        >
          <div
            className={`h-full transition-transform duration-300 ${
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <Sidebar
              collapsed={false}
              setCollapsed={setCollapsed}
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
            />
          </div>
        </div>
      </>
      {/* MAIN CONTENT */}
      <div
        className="
          flex-1
          overflow-y-auto
          overflow-x-hidden
          bg-[#F4F4F4]
          dark:bg-[#020817]
          transition-colors
        "
      >
        {/* MOBILE FLOATING BUTTONS */}
        <div
          className="
            md:hidden
            fixed
            top-4
            left-0
            right-0
            z-40
            px-4
            flex
            items-center
            justify-between
          "
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="
              w-12
              h-12
              rounded-2xl
              bg-[#0C2B4E]
              dark:bg-[#111827]
              text-white
              flex
              items-center
              justify-center
              shadow-lg
            "
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </div>
        {/* DESKTOP TOP CONTROLS */}
        <div
          className="
            hidden
            md:flex
            fixed
            top-6
            right-6
            z-40
            items-center
            gap-2
          "
        >
          <NotificationBell />
          <ThemeToggle />
        </div>
        {/* PAGE WRAPPER */}
        <div className="p-4 md:p-6 mt-16 md:mt-2">
          {/* PAGE HEADER */}
          <div className="mb-8">
            <h1
              className="
                text-3xl
                md:text-4xl
                font-bold
                text-[#0C2B4E]
                dark:text-white
                transition-colors
              "
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="
                  mt-2
                  text-base
                  md:text-lg
                  text-gray-500
                  dark:text-gray-400
                  transition-colors
                "
              >
                {subtitle}
              </p>
            )}
          </div>
          {/* PAGE CONTENT */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
