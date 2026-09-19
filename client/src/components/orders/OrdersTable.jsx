import { Trash2, Pencil, ArrowDown, ArrowUp } from "lucide-react";

import OrderStatusDropdown from "./OrderStatusDropdown";

function OrdersTable({
  orders,
  canUpdateOrders,
  canDeleteOrders,
  activeDropdown,
  setActiveDropdown,
  updateOrderStatus,
  openEditModal,
  deleteOrder,
  statusFlow,
  getStatusStyles,
  sortConfig,
  handleSort,
  currencySymbol,
}) {
  //
  // SORT ICON
  //

  const renderSortIcon = (key) => {
    const active = sortConfig?.key === key;

    //
    // NO SORT
    //

    if (!active) {
      return (
        <ArrowDown
          size={16}
          className="
            opacity-60
            transition
          "
        />
      );
    }

    //
    // ASC
    //

    if (sortConfig.direction === "asc") {
      return (
        <ArrowUp
          size={16}
          className="
            text-blue-400
          "
        />
      );
    }

    //
    // DESC
    //

    return (
      <ArrowDown
        size={16}
        className="
          text-blue-400
        "
      />
    );
  };

  //
  // SORT HEADER
  //

  const SortableHeader = ({ label, sortKey }) => (
    <button
      onClick={() => handleSort(sortKey)}
      className="
        flex
        items-center
        gap-2
        transition
        hover:text-blue-400
      "
    >
      <span>{label}</span>

      {renderSortIcon(sortKey)}
    </button>
  );

  return (
    <div
      className="
        hidden
        lg:block
        bg-white
        dark:bg-[#111827]
        border
        border-gray-100
        dark:border-gray-800
        rounded
        shadow-sm
        overflow-hidden
        transition-colors
      "
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* HEADER */}
          <thead
            className="
              bg-[#0C2B4E]
              dark:bg-[#020617]
              text-white
              sticky
              top-0
              z-20
            "
          >
            <tr>
              <th className="p-5 text-left">Order ID</th>
              <th className="p-5 text-left">Customer</th>

              <th className="p-5 text-left">Product</th>

              {/* QUANTITY */}

              <th className="p-5 text-left">
                <SortableHeader label="Quantity" sortKey="quantity" />
              </th>

              {/* AMOUNT */}

              <th className="p-5 text-left">
                <SortableHeader label="Amount" sortKey="amount" />
              </th>

              {/* CREATED */}

              <th className="p-5 text-left">
                <SortableHeader label="Created" sortKey="createdAt" />
              </th>

              {/* UPDATED */}

              <th className="p-5 text-left">
                <SortableHeader label="Updated" sortKey="updatedAt" />
              </th>

              <th className="p-5 text-left">Status</th>

              {(canUpdateOrders || canDeleteOrders) && (
                <th className="p-5 text-left">Actions</th>
              )}
            </tr>
          </thead>

          {/* BODY */}

          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="
                  border-b
                  border-gray-100
                  dark:border-gray-800
                  hover:bg-[#F8FAFC]
                  dark:hover:bg-[#1A2438]
                  transition
                "
              >
                <td
                  className="
                    p-5
                    whitespace-nowrap
                    font-semibold
                    text-[#1D546C]
                    dark:text-blue-400
                  "
                >
                  {order.orderNumber}
                </td>
                {/* CUSTOMER */}

                <td
                  className="
                    p-5
                    whitespace-nowrap
                    font-medium
                    text-[#0C2B4E]
                    dark:text-white
                  "
                >
                  {order.customerName}
                </td>

                {/* PRODUCT */}

                <td
                  className="
                    p-5
                    dark:text-gray-300
                  "
                >
                  {order.product}
                </td>

                {/* QUANTITY */}

                <td
                  className="
                    p-5
                    dark:text-gray-300
                  "
                >
                  {order.quantity}
                </td>

                {/* AMOUNT */}

                <td
                  className="
                    p-5
                    font-semibold
                    text-[#1D546C]
                    dark:text-blue-400
                  "
                >
                  {currencySymbol}
                  {order.amount}
                </td>

                {/* CREATED */}

                <td className="p-5 whitespace-nowrap">
                  {new Date(order.createdAt)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")}
                </td>

                {/* UPDATED */}

                <td className="p-5 whitespace-nowrap">
                  {new Date(order.updatedAt || order.createdAt)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")}
                </td>

                {/* STATUS */}

                <td className="p-5">
                  {canUpdateOrders ? (
                    <OrderStatusDropdown
                      order={order}
                      activeDropdown={activeDropdown}
                      setActiveDropdown={setActiveDropdown}
                      updateOrderStatus={updateOrderStatus}
                      statusFlow={statusFlow}
                      getStatusStyles={getStatusStyles}
                    />
                  ) : (
                    <div
                      className={`
                        inline-flex
                        px-3
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
                </td>

                {/* ACTIONS */}

                {(canUpdateOrders || canDeleteOrders) && (
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      {canUpdateOrders && (
                        <button
                          onClick={() => openEditModal(order)}
                          className="
                              text-blue-500
                              hover:text-blue-600
                              hover:scale-110
                              active:scale-95
                              p-2
                              transition
                            "
                        >
                          <Pencil size={20} />
                        </button>
                      )}

                      {canDeleteOrders && (
                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="
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
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersTable;
