import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";

function DashboardLayout({ children, title, subtitle }) {
  const [collapsed, setCollapsed] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-screen flex bg-[#F4F4F4] overflow-hidden">
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
            mobileOpen ? "visible bg-black/40" : "invisible"
          }`}
          onClick={() => setMobileOpen(false)}
        >
          <div
            className={`h-full transition-transform duration-300 ${
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
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
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* MOBILE HEADER */}
        <div className="md:hidden p-4 pb-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="bg-[#0C2B4E] text-white p-3 rounded-xl shadow-md"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* PAGE WRAPPER */}
        <div className="p-4 md:p-6 mt-2">
          {/* PAGE HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0C2B4E]">
              {title}
            </h1>

            {subtitle && (
              <p className="text-gray-500 mt-2 text-base md:text-lg">
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
