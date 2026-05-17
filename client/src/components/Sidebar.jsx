import {
  LayoutDashboard,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  return (
    <div
      className={`bg-[#0C2B4E] text-white min-h-screen transition-all duration-300 flex flex-col ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-5 border-b border-[#1D546C]">
        {!collapsed && (
          <img src="/FS Logo-transparent.png" alt="FlowSync" className="h-10" />
        )}

        <button
          onClick={() => {
            if (window.innerWidth < 768) {
              setMobileOpen(false);
            } else {
              setCollapsed(!collapsed);
            }
          }}
          className="p-2 hover:bg-[#1D546C] rounded-lg transition"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex flex-col justify-between flex-1 p-4">
        <div className="space-y-3">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive ? "bg-[#1D546C]" : "hover:bg-[#1A3D64]"
              }`
            }
          >
            <LayoutDashboard size={20} />

            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive ? "bg-[#1D546C]" : "hover:bg-[#1A3D64]"
              }`
            }
          >
            <ShoppingCart size={20} />

            {!collapsed && <span>Orders</span>}
          </NavLink>
        </div>
        <div className="border-t border-[#1D546C] pt-4">
          <button
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition ${
              collapsed
                ? "justify-center hover:scale-94"
                : "hover:bg-[#1A3D64]"
            }`}
          >
            <div className="min-w-10 min-h-10 w-10 h-10 rounded-full bg-[#1D546C] flex items-center justify-center font-bold">
              S
            </div>

            {!collapsed && (
              <div className="text-left">
                <p className="font-semibold">Shruti</p>

                <p className="text-sm text-gray-300">Admin</p>
              </div>
            )}
          </button>

          <button className="mt-3 w-full bg-[#1D546C] hover:bg-[#16485c] py-3 rounded-xl transition flex items-center justify-center gap-2">
            <LogOut size={18} />

            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
