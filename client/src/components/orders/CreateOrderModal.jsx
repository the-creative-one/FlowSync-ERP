import { X } from "lucide-react";

function CreateOrderModal({
  showModal,
  setShowModal,
  formData,
  setFormData,
  createOrder,
}) {
  if (!showModal) return null;

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
          p-6
          md:p-8
          relative
          transition-colors
        "
      >
        {/* CLOSE BUTTON */}

        <button
          onClick={() => setShowModal(false)}
          className="
            absolute
            top-4
            right-4
            text-gray-500
            hover:text-[#0C2B4E]
            dark:hover:text-white
            transition
          "
        >
          <X size={22} />
        </button>

        {/* HEADING */}

        <h2
          className="
            text-2xl
            font-bold
            mb-6
            text-[#0C2B4E]
            dark:text-white
          "
        >
          Create Order
        </h2>

        {/* FORM */}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={formData.customerName}
            onChange={(e) =>
              setFormData({
                ...formData,
                customerName: e.target.value,
              })
            }
            className="
              w-full
              border
              border-gray-300
              dark:border-gray-700
              bg-white
              dark:bg-[#1F2937]
              dark:text-white
              dark:placeholder:text-gray-400
              p-3
              rounded-xl
              outline-none
              transition
              focus:border-[#1D546C]
            "
          />

          <input
            type="text"
            placeholder="Product"
            value={formData.product}
            onChange={(e) =>
              setFormData({
                ...formData,
                product: e.target.value,
              })
            }
            className="
              w-full
              border
              border-gray-300
              dark:border-gray-700
              bg-white
              dark:bg-[#1F2937]
              dark:text-white
              dark:placeholder:text-gray-400
              p-3
              rounded-xl
              outline-none
              transition
              focus:border-[#1D546C]
            "
          />

          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                quantity: e.target.value,
              })
            }
            className="
              w-full
              border
              border-gray-300
              dark:border-gray-700
              bg-white
              dark:bg-[#1F2937]
              dark:text-white
              dark:placeholder:text-gray-400
              p-3
              rounded-xl
              outline-none
              transition
              focus:border-[#1D546C]
            "
          />

          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({
                ...formData,
                amount: e.target.value,
              })
            }
            className="
              w-full
              border
              border-gray-300
              dark:border-gray-700
              bg-white
              dark:bg-[#1F2937]
              dark:text-white
              dark:placeholder:text-gray-400
              p-3
              rounded-xl
              outline-none
              transition
              focus:border-[#1D546C]
            "
          />

          {/* ACTION BUTTONS */}

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="
                px-5
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
              onClick={createOrder}
              className="
                bg-[#1D546C]
                hover:bg-[#16485c]
                text-white
                px-5
                py-3
                rounded-xl
                transition
              "
            >
              Create Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateOrderModal;