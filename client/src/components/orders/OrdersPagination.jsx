import { ChevronLeft, ChevronRight } from "lucide-react";

function OrdersPagination({
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-center
        gap-6
      "
    >
      {/* PREV */}

      <button
        disabled={currentPage === 1}
        onClick={() =>
          setCurrentPage((prev) => prev - 1)
        }
        className="
          w-7
          h-7
          rounded-2xl
          border
          border-gray-200
          dark:border-[#243041]
          bg-[#F8FAFC]
          dark:bg-[#1E293B]
          flex
          items-center
          justify-center
          text-[#0F172A]
          dark:text-white
          transition
          disabled:opacity-40
          hover:scale-105
        "
      >
        <ChevronLeft size={20} />
      </button>

      {/* PAGE */}

      <p
        className="
          text-lg
          text-[#0F172A]
          dark:text-white
        "
      >
        Page {currentPage} of {totalPages}
      </p>

      {/* NEXT */}

      <button
        disabled={currentPage === totalPages}
        onClick={() =>
          setCurrentPage((prev) => prev + 1)
        }
        className="
          w-7
          h-7
          rounded-2xl
          border
          border-gray-200
          dark:border-[#243041]
          bg-[#F8FAFC]
          dark:bg-[#1E293B]
          flex
          items-center
          justify-center
          text-[#0F172A]
          dark:text-white
          transition
          disabled:opacity-40
          hover:scale-105
        "
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

export default OrdersPagination;