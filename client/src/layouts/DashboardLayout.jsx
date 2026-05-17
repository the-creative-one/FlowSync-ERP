import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";

function DashboardLayout({ children, title }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F4F4F4]">
      {/* Sidebar */}
      <>
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />
        </div>

        {/* Mobile Sidebar */}
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

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
        <div className="md:hidden flex items-center justify-between mb-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="bg-[#0C2B4E] text-white p-3 rounded-xl"
          >
            <Menu size={20} />
          </button>
        </div>
        <div className=" px-6 py-5 mb-6">
          <h1 className="text-3xl font-bold text-[#0C2B4E] mb-6">{title}</h1>
        </div>

        {/* Page Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
