import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function FilterDropdown({
  value,
  onChange,
}) {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const statuses = [
    "all",
    "pending",
    "processing",
    "shipped",
    "delivered",
  ];

  //
  // CLOSE OUTSIDE
  //

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative shrink-0"
    >
      {/* BUTTON */}

      <button
        onClick={() => setOpen(!open)}
        className="
          h-14
          min-w-[140px]
          px-5
          rounded-2xl
          border
          border-gray-200
          dark:border-[#294061]
          bg-[#F8FAFC]
          dark:bg-[#1E293B]
          text-[#0F172A]
          dark:text-white
          flex
          items-center
          justify-between
          gap-4
          transition
          hover:border-[#2563EB]
        "
      >
        <span className="capitalize">
          {value === "all"
            ? "All Status"
            : value}
        </span>

        <ChevronDown
          size={18}
          className={`transition duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DROPDOWN */}

      {open && (
        <div
          className="
            absolute
            left-0
            top-[64px]
            z-[999]
           min-w-[180px]
            overflow-hidden
            rounded-[28px]
            border
            border-gray-200
            dark:border-[#243041]
            bg-white
            dark:bg-[#0F172A]
            shadow-2xl
            animate-fadeIn
          "
        >
          {statuses.map((status) => {
            const active =
              value === status;

            return (
              <button
                key={status}
                onClick={() => {
                  onChange(status);

                  setOpen(false);
                }}
                className={`
                  w-full
                  px-6
                  py-4
                  text-left
                  capitalize
                  transition
                  font-medium

                  ${
                    active
                      ? `
                        bg-[#E0ECFF]
                        dark:bg-[#172554]
                        text-[#2563EB]
                        dark:text-[#60A5FA]
                      `
                      : `
                        text-[#0F172A]
                        dark:text-gray-200
                        hover:bg-[#F8FAFC]
                        dark:hover:bg-[#172033]
                      `
                  }
                `}
              >
                {status === "all"
                  ? "All Status"
                  : status}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;