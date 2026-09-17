import { TriangleAlert } from "lucide-react";

function DeleteConfirmModal({
  deleteModal,
  setDeleteModal,
  onDelete,
  title = "Delete Order",
  message = "Are you sure you want to delete this order? This action cannot be undone.",
}) {
  if (!deleteModal) return null;

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/50
        backdrop-blur-sm
        flex
        justify-center
        items-center
        p-4
        z-50
      "
    >
      <div
        className="
          w-full
          max-w-md
          bg-white
          dark:bg-[#111827]
          border
          border-gray-100
          dark:border-gray-800
          rounded-3xl
          shadow-2xl
          md:p-8
          p-6
          transition-colors
        "
      >
        <div className="flex justify-center mb-5">
          <div
            className="
              w-16
              h-16
              rounded-full
              bg-red-100
              dark:bg-red-500/20
              flex
              items-center
              justify-center
            "
          >
            <TriangleAlert size={32} className="text-red-500" />
          </div>
        </div>

        <div className="text-center">
          <h2
            className="
              text-2xl
              font-bold
              text-[#0C2B4E]
              dark:text-white
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-3
              text-gray-500
              dark:text-gray-400
              leading-relaxed
            "
          >
            {message}
          </p>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => setDeleteModal(false)}
            className="
              flex-1
              py-3
              rounded-xl
              border
              border-gray-300
              dark:border-gray-700
              text-gray-700
              dark:text-gray-300
              hover:bg-gray-100
              dark:hover:bg-[#1F2937]
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="
              flex-1
              py-3
              rounded-xl
              bg-red-500
              hover:bg-red-600
              text-white
              transition
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
