import React from "react";
import {
  ShoppingBag,
  BarChart3,
  Users,
  FileText,
  Settings,
} from "lucide-react";

function HeroPreview({ modules }) {
  const hasModule = (id) => modules.some((m) => m.id === id);

  return (
    <div className="hidden xl:block w-full max-w-md ml-auto">
      <div className="grid grid-cols-2 gap-4">
        {/* Orders */}
        {hasModule("orders") && (
          <div className="col-span-2 rounded-xl bg-white/10 backdrop-blur-lg border border-white/10 p-5 shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-cyan-100">Orders</h3>

              <ShoppingBag size={22} className="text-cyan-300" />
            </div>

            <div className="mt-5 space-y-3">
              <div className="h-2 rounded-full bg-white/20 w-full" />

              <div className="h-2 rounded-full bg-white/15 w-5/6" />

              <div className="h-2 rounded-full bg-white/10 w-2/3" />
            </div>
          </div>
        )}

        {/* Analytics */}
        {hasModule("analytics") && (
          <div className="rounded-xl bg-white/10 backdrop-blur-lg border border-white/10 p-5 shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-cyan-100">
                Analytics
              </span>

              <BarChart3 size={22} className="text-cyan-300" />
            </div>

            <div className="flex items-end gap-2 mt-6 h-16">
              <div className="w-3 h-6 rounded bg-cyan-300" />

              <div className="w-3 h-10 rounded bg-cyan-300" />

              <div className="w-3 h-8 rounded bg-cyan-300" />

              <div className="w-3 h-14 rounded bg-cyan-300" />
            </div>
          </div>
        )}

        {/* Team */}
        {hasModule("employees") && (
          <div className="rounded-xl bg-white/10 backdrop-blur-lg border border-white/10 p-5 shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-cyan-100">Team</span>

              <Users size={22} className="text-cyan-300" />
            </div>

            <div className="flex mt-6 -space-x-3">
              <div className="w-10 h-10 rounded-full bg-cyan-400 border-2 border-[#164766]" />

              <div className="w-10 h-10 rounded-full bg-blue-300 border-2 border-[#164766]" />

              <div className="w-10 h-10 rounded-full bg-teal-300 border-2 border-[#164766]" />

              <div className="w-10 h-10 rounded-full bg-indigo-300 border-2 border-[#164766]" />
            </div>
          </div>
        )}

        {/* Reports */}
        {hasModule("reports") && (
          <div className="rounded-xl bg-white/10 backdrop-blur-lg border border-white/10 p-5 shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-cyan-100">
                Reports
              </span>

              <FileText size={22} className="text-cyan-300" />
            </div>

            <div className="mt-6 flex gap-2">
              <span className="text-xs text-white bg-white/15 rounded-full px-3 py-2">
                CSV
              </span>

              <span className="text-xs text-white bg-white/15 rounded-full px-3 py-2">
                XLSX
              </span>
            </div>
          </div>
        )}

        {/* Settings */}
        {hasModule("settings") && (
          <div className="rounded-xl bg-white/10 backdrop-blur-lg border border-white/10 p-5 shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-cyan-100">
                Settings
              </span>

              <Settings size={22} className="text-cyan-300" />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-xs text-white bg-white/15 rounded-full px-3 py-2">
                Profile
              </span>

              <span className="text-xs text-white bg-white/15 rounded-full px-3 py-2">
                Security
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroPreview;
