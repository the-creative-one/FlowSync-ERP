import { Search, Plus, X } from "lucide-react";
import ExportDropdown from "../common/ExportDropdown";
import FilterDropdown from "./FilterDropdown";

function OrdersToolbar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onExportExcel,
  onExportCSV,
  canCreateOrders,
  canExportReports,
  setShowModal,
  totalOrders,
}) {
  return (
    <div
      className="
        bg-white
        dark:bg-[#0F172A]
        border
        border-gray-100
        dark:border-gray-800
        rounded-3xl
        p-5
        md:p-6
        shadow-sm
        transition-colors
      "
    >
      <div className="space-y-5">
        {/* TOP SECTION */}

        <div
          className="
            flex
            flex-col
            gap-5

            min-[450px]:flex-row
            min-[450px]:items-start
            min-[450px]:justify-between
          "
        >
          {/* LEFT */}

          <div className="shrink-0">
            <h2
              className="
                text-3xl
                font-bold
                text-[#0C2B4E]
                dark:text-white
                leading-tight
              "
            >
              Orders Overview
            </h2>

            <p
              className="
                mt-2
                text-gray-500
                dark:text-gray-400
              "
            >
              Total Orders: {totalOrders}
            </p>
          </div>

          {/* TOP RIGHT ACTIONS */}

          <div
            className="
              hidden
              min-[450px]:flex
              items-center
              gap-3
              self-start
            "
          >
            {/* EXPORT */}
            {canExportReports && (
              <ExportDropdown
                variant="icon"
                onExcel={onExportExcel}
                onCSV={onExportCSV}
              />
            )}
            {/* CREATE */}

            {canCreateOrders && (
              <button
                onClick={() => setShowModal(true)}
                className="
                  h-14
                  w-14
                  rounded-2xl
                  bg-[#1D546C]
                  hover:bg-[#16485c]
                  text-white
                  flex
                  items-center
                  justify-center
                  transition
                  hover:scale-[1.03]
                "
              >
                <Plus size={22} />
              </button>
            )}
          </div>
        </div>

        {/* DESKTOP + TABLET */}

        <div
          className="
            hidden
            min-[450px]:flex
            items-center
            gap-3
          "
        >
          {/* SEARCH */}

          <div className="relative flex-1">
            <Search
              size={20}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="Search customer, product or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                h-14
                rounded-2xl
                border
                border-gray-200
                dark:border-[#243041]
                bg-[#F8FAFC]
                dark:bg-[#1E293B]
                pl-14
                pr-12
                text-[#0F172A]
                dark:text-white
                placeholder:text-gray-400
                outline-none
                transition
                focus:border-[#2563EB]
              "
            />

            {/* CLEAR SEARCH */}

            {search && (
              <button
                onClick={() => setSearch("")}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  w-7
                  h-7
                  rounded-full
                  bg-gray-200
                  dark:bg-[#334155]
                  flex
                  items-center
                  justify-center
                  hover:scale-105
                  transition
                "
              >
                <X
                  size={15}
                  className="
                    text-gray-600
                    dark:text-gray-300
                  "
                />
              </button>
            )}
          </div>

          {/* STATUS */}

          <div className="w-[145px] shrink-0">
            <FilterDropdown value={statusFilter} onChange={setStatusFilter} />
          </div>
        </div>

        {/* MOBILE */}

        <div className="space-y-3 min-[450px]:hidden">
          {/* SEARCH */}

          <div className="relative">
            <Search
              size={20}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="Search customer, product or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                h-14
                rounded-2xl
                border
                border-gray-200
                dark:border-[#243041]
                bg-[#F8FAFC]
                dark:bg-[#1E293B]
                pl-14
                pr-12
                text-[#0F172A]
                dark:text-white
                placeholder:text-gray-400
                outline-none
                transition
                focus:border-[#2563EB]
              "
            />

            {/* CLEAR SEARCH */}

            {search && (
              <button
                onClick={() => setSearch("")}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  w-7
                  h-7
                  rounded-full
                  bg-gray-200
                  dark:bg-[#334155]
                  flex
                  items-center
                  justify-center
                  hover:scale-105
                  transition
                "
              >
                <X
                  size={15}
                  className="
                    text-gray-600
                    dark:text-gray-300
                  "
                />
              </button>
            )}
          </div>

          {/* STATUS + ACTIONS */}

          <div
            className="
              flex
              items-center
              justify-start
              gap-3
            "
          >
            {/* STATUS */}

            <div>
              <FilterDropdown value={statusFilter} onChange={setStatusFilter} />
            </div>

            {/* RIGHT ACTIONS */}

            <div className="flex items-center gap-3 shrink-0">
              {/* EXPORT */}

              <ExportDropdown
                variant="icon"
                onExcel={onExportExcel}
                onCSV={onExportCSV}
              />

              {/* CREATE */}

              {canCreateOrders && (
                <button
                  onClick={() => setShowModal(true)}
                  className="
                    h-14
                    w-14
                    rounded-2xl
                    bg-[#1D546C]
                    hover:bg-[#16485c]
                    text-white
                    flex
                    items-center
                    justify-center
                    transition
                    hover:scale-[1.03]
                  "
                >
                  <Plus size={22} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersToolbar;
