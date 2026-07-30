import { useEffect, useRef, useState } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

function ExportDropdown({
  onExcel,
  onCSV,
  label = "Export",
  variant = "button",
}) {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={
          variant === "icon"
            ? `
              relative
              h-12
              w-12
              rounded-xl
              bg-cyan-700
              hover:bg-cyan-600
              text-white
              flex
              items-center
              justify-center
              transition-all
              duration-200
            `
            : `
              flex
              items-center
              gap-2
              px-5
              h-12
              rounded-xl
              bg-cyan-700
              hover:bg-cyan-600
              text-white
              font-medium
              transition-all
              duration-200
            `
        }
      >
        {variant === "icon" ? (
          <>
            <Download size={20} />
          </>
        ) : (
          <>
            <Download size={18} />

            <span>{label}</span>
          </>
        )}
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            mt-2
            w-52
            rounded-xl
            bg-white
            dark:bg-gray-900
            border
            border-gray-200
            dark:border-gray-700
            shadow-xl
            overflow-hidden
            z-50
          "
        >
          <button
            onClick={() => {
              onExcel();
              setOpen(false);
            }}
            className="
              flex
              items-center
              gap-3
              w-full
              px-4
              py-3
              hover:bg-gray-100
              dark:hover:bg-gray-800
              transition
            "
          >
            <FileSpreadsheet size={18} className="text-green-600" />

            <div className="text-left">
              <p className="font-medium dark:text-white">Excel</p>
              <p className="text-xs text-gray-500">.xlsx</p>
            </div>
          </button>

          <button
            onClick={() => {
              onCSV();
              setOpen(false);
            }}
            className="
              flex
              items-center
              gap-3
              w-full
              px-4
              py-3
              hover:bg-gray-100
              dark:hover:bg-gray-800
              transition
            "
          >
            <FileText size={18} className="text-blue-600" />

            <div className="text-left">
              <p className="font-medium dark:text-white">CSV</p>
              <p className="text-xs text-gray-500">.csv</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export default ExportDropdown;