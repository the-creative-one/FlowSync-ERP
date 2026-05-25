import { ChevronDown } from "lucide-react";

function OrderStatusDropdown({
  order,
  index,
  totalOrders,
  activeDropdown,
  setActiveDropdown,
  updateOrderStatus,
  statusFlow,
  getStatusStyles,
}) {
  //
  // SMART POSITIONING
  //

  const openUpward =
    index >= totalOrders - 3;

  return (
    <div className="relative inline-block">
      {/* BUTTON */}

      <button
        onClick={(e) => {
          e.stopPropagation();

          setActiveDropdown(
            activeDropdown === order._id
              ? null
              : order._id,
          );
        }}
        className={`
          px-5
          py-3
          rounded-full
          text-sm
          font-semibold
          capitalize
          flex
          items-center
          gap-4
          min-w-[145px]
          justify-between
          transition-all
          duration-200
          hover:scale-[1.02]
          ${getStatusStyles(order.status)}
        `}
      >
        {order.status}

        <ChevronDown
          size={18}
          className={`
            transition-transform
            duration-300
            ${
              activeDropdown === order._id
                ? "rotate-180"
                : ""
            }
          `}
        />
      </button>

      {/* DROPDOWN */}

      {activeDropdown === order._id && (
        <div
          className={`
            absolute
            left-0
            z-50
            min-w-[180px]
            overflow-hidden
            rounded-[30px]
            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-[#0B1120]

            shadow-[0_20px_60px_rgba(0,0,0,0.18)]
            dark:shadow-[0_20px_60px_rgba(0,0,0,0.55)]

            backdrop-blur-xl
            animate-fadeIn

            ${
              openUpward
                ? "bottom-12"
                : "top-12"
            }
          `}
        >
          <div>
            {statusFlow.map((status) => (
              <button
                key={status}
                onClick={(e) => {
                  e.stopPropagation();

                  updateOrderStatus(
                    order._id,
                    status,
                  );
                }}
                className="
                  w-full
                  text-left
                  px-5
                  py-4
                  capitalize
                  text-[#0F172A]
                  dark:text-white
                  text-[15px]
                  font-medium
                  transition-all
                  duration-200

                  hover:bg-[#F1F5F9]
                  dark:hover:bg-white/10
                "
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderStatusDropdown;