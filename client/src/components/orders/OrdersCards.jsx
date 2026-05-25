import { Trash2 } from "lucide-react";

import OrderStatusDropdown from "./OrderStatusDropdown";

function OrdersCards({
  orders,
  canUpdateOrders,
  canDeleteOrders,
  activeDropdown,
  setActiveDropdown,
  updateOrderStatus,
  deleteOrder,
  statusFlow,
  getStatusStyles,
  shouldOpenUpward,
}) {
  return (
    <div className="lg:hidden space-y-4">
      {orders.map((order, index) => (
        <div
          key={order._id}
          className="
            relative
            bg-white
            dark:bg-[#111827]
            border
            border-gray-100
            dark:border-gray-800
            rounded-3xl
            shadow-sm
            p-5
            transition-colors
          "
        >
          {/* DELETE BUTTON */}

          {canDeleteOrders && (
            <button
              onClick={() => deleteOrder(order._id)}
              className="
                absolute
                top-5
                right-5
                text-red-500
                hover:text-red-600
                hover:scale-110
                active:scale-95
                p-2
                transition
              "
            >
              <Trash2 size={22} />
            </button>
          )}

          <div className="space-y-5">
            {/* CUSTOMER */}

            <div>
              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Customer
              </p>

              <p
                className="
                  mt-1
                  font-semibold
                  text-[#0C2B4E]
                  dark:text-white
                  pr-12
                "
              >
                {order.customerName}
              </p>
            </div>

            {/* PRODUCT */}

            <div>
              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Product
              </p>

              <p
                className="
                  mt-1
                  dark:text-gray-200
                "
              >
                {order.product}
              </p>
            </div>

            {/* QUANTITY + AMOUNT */}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Quantity
                </p>

                <p
                  className="
                    mt-1
                    dark:text-gray-200
                  "
                >
                  {order.quantity}
                </p>
              </div>

              <div>
                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Amount
                </p>

                <p
                  className="
                    mt-1
                    font-semibold
                    text-[#1D546C]
                    dark:text-blue-400
                  "
                >
                  ₹{order.amount}
                </p>
              </div>
            </div>

            {/* CREATED + UPDATED */}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Created
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    dark:text-gray-300
                  "
                >
                  {new Date(order.createdAt)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")}
                </p>
              </div>

              <div>
                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Updated
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    dark:text-gray-300
                  "
                >
                  {new Date(order.updatedAt || order.createdAt)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")}
                </p>
              </div>
            </div>

            {/* STATUS */}

            <div>
              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                  mb-3
                "
              >
                Status
              </p>

              {canUpdateOrders ? (
                <OrderStatusDropdown
                  order={order}
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                  updateOrderStatus={updateOrderStatus}
                  statusFlow={statusFlow}
                  getStatusStyles={getStatusStyles}
                  shouldOpenUpward={shouldOpenUpward}
                  index={index}
                  totalOrders={orders.length}
                />
              ) : (
                <div
                  className={`
                    inline-flex
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-medium
                    capitalize

                    ${getStatusStyles(order.status)}
                  `}
                >
                  {order.status}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrdersCards;
