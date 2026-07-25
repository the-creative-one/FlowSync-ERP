import { ChevronDown } from "lucide-react";
import SmartDropdown from "../common/SmartDropdown";

function OrderStatusDropdown({
  order,
  activeDropdown,
  setActiveDropdown,
  updateOrderStatus,
  statusFlow,
  getStatusStyles,
}) {
  return (
    <SmartDropdown
      width={180}
      open={activeDropdown === order._id}
      onOpenChange={(isOpen) => setActiveDropdown(isOpen ? order._id : null)}
      trigger={
        <button
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
          ${activeDropdown === order._id ? "rotate-180" : ""}
        `}
          />
        </button>
      }
    >
      {({ close }) =>
        statusFlow.map((status) => (
          <button
            key={status}
            onClick={() => {
              updateOrderStatus(order._id, status);
              close();
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
          transition
          hover:bg-[#F1F5F9]
          dark:hover:bg-white/10
        "
          >
            {status}
          </button>
        ))
      }
    </SmartDropdown>
  );
}

export default OrderStatusDropdown;
