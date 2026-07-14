import { X } from "lucide-react";

function EditOrderModal({
  showEditModal,
  setShowEditModal,
  editFormData,
  setEditFormData,
  updateOrder,
}) {
  if (!showEditModal) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/50
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-4
      "
    >
      <div
        className="
          w-full
          max-w-2xl
          rounded-3xl
          bg-white
          dark:bg-[#111827]
          border
          border-gray-100
          dark:border-gray-800
          shadow-2xl
          p-6
          relative
        "
      >
        {/* CLOSE */}

        <button
          onClick={() => setShowEditModal(false)}
          className="
            absolute
            top-5
            right-5
            text-gray-500
            hover:text-[#0C2B4E]
            dark:hover:text-white
            transition
          "
        >
          <X size={24} />
        </button>

        {/* TITLE */}

        <h2
          className="
            text-3xl
            font-bold
            text-[#0C2B4E]
            dark:text-white
          "
        >
          Edit Order
        </h2>

        <p
          className="
            mt-2
            text-gray-500
            dark:text-gray-400
          "
        >
          Update order details
        </p>

        {/* FORM */}

        <div className="grid md:grid-cols-2 gap-5 mt-8">
          {/* CUSTOMER */}

          <div>
            <label
              className="
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Customer Name
            </label>

            <input
              type="text"
              value={editFormData.customerName}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  customerName: e.target.value,
                })
              }
              className="
                mt-2
                w-full
                h-12
                rounded-xl
                border
                border-gray-200
                dark:border-[#243041]
                bg-[#F8FAFC]
                dark:bg-[#1E293B]
                px-4
                text-[#0F172A]
                dark:text-white
                outline-none
              "
            />
          </div>

          {/* PRODUCT */}

          <div>
            <label
              className="
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Product
            </label>

            <input
              type="text"
              value={editFormData.product}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  product: e.target.value,
                })
              }
              className="
                mt-2
                w-full
                h-12
                rounded-xl
                border
                border-gray-200
                dark:border-[#243041]
                bg-[#F8FAFC]
                dark:bg-[#1E293B]
                px-4
                text-[#0F172A]
                dark:text-white
                outline-none
              "
            />
          </div>

          {/* QUANTITY */}

          <div>
            <label
              className="
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Quantity
            </label>

            <input
              type="number"
              value={editFormData.quantity}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  quantity: e.target.value,
                })
              }
              className="
                mt-2
                w-full
                h-12
                rounded-xl
                border
                border-gray-200
                dark:border-[#243041]
                bg-[#F8FAFC]
                dark:bg-[#1E293B]
                px-4
                text-[#0F172A]
                dark:text-white
                outline-none
              "
            />
          </div>

          {/* AMOUNT */}

          <div>
            <label
              className="
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Amount
            </label>

            <input
              type="number"
              value={editFormData.amount}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  amount: e.target.value,
                })
              }
              className="
                mt-2
                w-full
                h-12
                rounded-xl
                border
                border-gray-200
                dark:border-[#243041]
                bg-[#F8FAFC]
                dark:bg-[#1E293B]
                px-4
                text-[#0F172A]
                dark:text-white
                outline-none
              "
            />
          </div>
        </div>

        {/* ACTIONS */}

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => setShowEditModal(false)}
            className="
              px-5
              h-12
              rounded-xl
              border
              border-gray-200
              dark:border-[#243041]
            "
          >
            Cancel
          </button>

          <button
            onClick={updateOrder}
            className="
              px-6
              h-12
              rounded-xl
              bg-[#1D546C]
              hover:bg-[#16485c]
              text-white
              transition
            "
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditOrderModal;