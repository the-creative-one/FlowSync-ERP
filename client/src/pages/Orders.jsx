import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { Trash2, Plus, X, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { user } = useAuth();

  const canCreateOrders =
    user?.permissions?.canCreateOrders ||
    user?.role === "admin" ||
    user?.role === "manager";

  const canUpdateOrders =
    user?.permissions?.canUpdateOrders ||
    user?.role === "admin" ||
    user?.role === "manager";

  const canDeleteOrders =
    user?.permissions?.canDeleteOrders ||
    user?.role === "admin" ||
    user?.role === "manager";

  const [formData, setFormData] = useState({
    customerName: "",
    product: "",
    quantity: "",
    amount: "",
  });

  const statusFlow = [
    "pending",
    "processing",
    "shipped",
    "delivered",
  ];

  //
  // OPEN UPWARD FOR LAST ROWS
  //

  const shouldOpenUpward = (index, total) => {
    return index >= total - 2;
  };

  //
  // FETCH ORDERS
  //

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  //
  // CREATE ORDER
  //

  const createOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/orders",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOrders((prev) => [
        response.data,
        ...prev,
      ]);

      setShowModal(false);

      setFormData({
        customerName: "",
        product: "",
        quantity: "",
        amount: "",
      });

      toast.success("Order created successfully");
    } catch (error) {
      console.log(error.response?.data);

      toast.error("Failed to create order");
    }
  };

  //
  // UPDATE STATUS
  //

  const updateOrderStatus = async (
    orderId,
    newStatus,
  ) => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/orders/${orderId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order,
        ),
      );

      setActiveDropdown(null);

      toast.success("Order status updated");
    } catch (error) {
      console.log(error.response?.data);

      toast.error("Failed to update status");
    }
  };

  //
  // DELETE ORDER
  //

  const deleteOrder = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders((prev) =>
        prev.filter((order) => order._id !== id),
      );

      toast.success("Order deleted");
    } catch (error) {
      console.log(error.response?.data);

      toast.error("Failed to delete order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  //
  // STATUS COLORS
  //

  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "processing":
        return "bg-blue-100 text-blue-700";

      case "shipped":
        return "bg-purple-100 text-purple-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <DashboardLayout
      title="Orders Management"
      subtitle="Manage and track all customer orders"
    >
      <div
        className="p-1 md:pt-6"
        onClick={() => setActiveDropdown(null)}
      >
        {/* CREATE BUTTON */}
        <div className="flex justify-end mb-5">
          {canCreateOrders && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#1D546C] text-white px-4 md:px-5 py-3 rounded-xl hover:bg-[#16485c] active:scale-95 transition duration-200 flex items-center justify-center gap-2"
            >
              <Plus size={20} />

              <span className="hidden min-[550px]:inline">
                Create Order
              </span>
            </button>
          )}
        </div>
        {/* MOBILE + TABLET */}
        <div className="lg:hidden space-y-4">
          {orders.map((order, index) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl shadow p-5"
            >
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Customer
                  </p>

                  <p className="mt-1 font-medium">
                    {order.customerName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Product
                  </p>

                  <p className="mt-1">
                    {order.product}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Quantity
                    </p>

                    <p className="mt-1">
                      {order.quantity}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Amount
                    </p>

                    <p className="mt-1">
                      ₹{order.amount}
                    </p>
                  </div>
                </div>
                {/* STATUS */}
                <div>
                  <p className="text-sm text-gray-500 mb-3">
                    Status
                  </p>
                  {canUpdateOrders ? (
                    <div className="relative inline-block">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          setActiveDropdown(
                            activeDropdown === order._id
                              ? null
                              : order._id,
                          );
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium capitalize flex items-center gap-3 min-w-[150px] justify-between transition ${getStatusStyles(
                          order.status,
                        )}`}
                      >
                        {order.status}

                        <ChevronDown size={18} />
                      </button>

                      {activeDropdown === order._id && (
                        <div
                          className={`absolute left-0 z-50 min-w-[180px] bg-white border border-gray-200 rounded-3xl shadow-2xl py-2 ${
                            shouldOpenUpward(
                              index,
                              orders.length,
                            )
                              ? "bottom-16"
                              : "top-16"
                          }`}
                        >
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
                              className="w-full text-left px-5 py-3 hover:bg-[#F4F7FA] capitalize transition"
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`inline-flex px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusStyles(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </div>
                  )}
                </div>
                {/* DELETE */}
                {canDeleteOrders && (
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        deleteOrder(order._id)
                      }
                      className="hover:text-red-600 hover:scale-110 active:scale-95 text-red-500 p-2 transition duration-200"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* DESKTOP */}
        <div className="hidden lg:block bg-white rounded-3xl shadow overflow-visible">
          <table className="w-full">
            <thead className="bg-[#0C2B4E] text-white">
              <tr>
                <th className="p-5 text-left">
                  Customer
                </th>

                <th className="p-5 text-left">
                  Product
                </th>

                <th className="p-5 text-left">
                  Quantity
                </th>

                <th className="p-5 text-left">
                  Amount
                </th>

                <th className="p-5 text-left">
                  Status
                </th>

                <th className="p-5 text-left">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-200"
                >
                  <td className="p-5 whitespace-nowrap">
                    {order.customerName}
                  </td>

                  <td className="p-5">
                    {order.product}
                  </td>

                  <td className="p-5">
                    {order.quantity}
                  </td>

                  <td className="p-5">
                    ₹{order.amount}
                  </td>
                  {/* STATUS */}
                  <td className="p-5">
                    {canUpdateOrders ? (
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            setActiveDropdown(
                              activeDropdown === order._id
                                ? null
                                : order._id,
                            );
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium capitalize flex items-center gap-3 min-w-[150px] justify-between transition ${getStatusStyles(
                            order.status,
                          )}`}
                        >
                          {order.status}

                          <ChevronDown size={18} />
                        </button>

                        {activeDropdown === order._id && (
                          <div
                            className={`absolute left-0 z-50 min-w-[180px] bg-white border border-gray-200 rounded-3xl shadow-2xl py-2 ${
                              shouldOpenUpward(
                                index,
                                orders.length,
                              )
                                ? "bottom-14"
                                : "top-14"
                            }`}
                          >
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
                                className="w-full text-left px-5 py-3 hover:bg-[#F4F7FA] capitalize transition"
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`inline-flex px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusStyles(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </div>
                    )}
                  </td>
                  {/* DELETE */}
                  <td className="p-5">
                    {canDeleteOrders && (
                      <button
                        onClick={() =>
                          deleteOrder(order._id)
                        }
                        className="hover:text-red-600 hover:scale-110 active:scale-95 text-red-500 p-2 transition duration-200"
                      >
                        <Trash2 size={22} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* CREATE MODAL */}
      {showModal && canCreateOrders && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 md:p-8 rounded-3xl w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-[#0C2B4E] transition"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-[#0C2B4E]">
              Create Order
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Customer Name"
                className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-[#1D546C]"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerName:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Product"
                className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-[#1D546C]"
                value={formData.product}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    product: e.target.value,
                  })
                }
              />

              <input
                type="number"
                placeholder="Quantity"
                className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-[#1D546C]"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: e.target.value,
                  })
                }
              />

              <input
                type="number"
                placeholder="Amount"
                className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-[#1D546C]"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: e.target.value,
                  })
                }
              />

              <div className="flex justify-end pt-4">
                <button
                  onClick={createOrder}
                  className="bg-[#1D546C] hover:bg-[#16485c] text-white px-5 py-3 rounded-xl transition"
                >
                  Create Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Orders;