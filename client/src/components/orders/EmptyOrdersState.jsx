import { PackageSearch } from "lucide-react";

function EmptyOrdersState() {
  return (
    <div
      className="
        bg-white
        dark:bg-[#111827]
        border
        border-gray-100
        dark:border-gray-800
        rounded-3xl
        p-10
        flex
        flex-col
        items-center
        justify-center
        text-center
        transition-colors
      "
    >
      <div
        className="
          w-20
          h-20
          rounded-full
          bg-[#F4F7FA]
          dark:bg-[#1F2937]
          flex
          items-center
          justify-center
          mb-5
        "
      >
        <PackageSearch
          size={36}
          className="
            text-[#1D546C]
            dark:text-white
          "
        />
      </div>

      <h2
        className="
          text-2xl
          font-bold
          text-[#0C2B4E]
          dark:text-white
        "
      >
        No Orders Found
      </h2>

      <p
        className="
          text-gray-500
          dark:text-gray-400
          mt-2
          max-w-md
        "
      >
        No orders match your current
        search or filter selection.
      </p>
    </div>
  );
}

export default EmptyOrdersState;