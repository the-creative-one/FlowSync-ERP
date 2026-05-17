import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { Trash2, Plus, X, ChevronDown } from "lucide-react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [formData, setFormData] = useState({
    customerName: "",
    product: "",
    quantity: "",
    amount: "",
  });
  const statusFlow = ["pending", "processing", "shipped", "delivered"];

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
      console.log(error.response.data);
    }
  };

  const createOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post("/orders", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchOrders();

      setShowModal(false);

      setFormData({
        customerName: "",
        product: "",
        quantity: "",
        amount: "",
      });
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
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
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const deleteOrder = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchOrders();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <DashboardLayout title="Orders Management">
      <div className="p-4 md:p-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#1D546C] text-white px-4 md:px-5 py-3 rounded-xl hover:bg-[#16485c] active:scale-95 transition duration-200 flex items-center justify-center gap-2"
          >
            <Plus size={20} />

            <span className="hidden min-[550px]:inline">Create Order</span>
          </button>
        </div>
        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow p-4">
              <div className="space-y-3">
                <p>
                  <span className="font-semibold">Customer:</span>{" "}
                  {order.customerName}
                </p>

                <p>
                  <span className="font-semibold">Product:</span>{" "}
                  {order.product}
                </p>

                <p>
                  <span className="font-semibold">Quantity:</span>{" "}
                  {order.quantity}
                </p>

                <p>
                  <span className="font-semibold">Amount:</span> ₹{order.amount}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === order._id ? null : order._id,
                        )
                      }
                      className={`px-4 py-2 rounded-full text-sm font-medium capitalize flex items-center gap-2 transition ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "processing"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "shipped"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                      }`}
                    >
                      {order.status}

                      <ChevronDown size={16} />
                    </button>

                    {activeDropdown === order._id && (
                      <div className="absolute mt-2 w-40 bg-white shadow-lg rounded-xl overflow-hidden z-50 border">
                        {statusFlow.map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order._id, status)}
                            className="block w-full text-left px-4 py-3 hover:bg-gray-100 capitalize transition"
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="hover:text-red-600 hover:scale-110 hover-shake active:scale-95 text-red-500 p-2 transition duration-200"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:block bg-white rounded-2xl shadow overflow-visible">
          <table className="w-full">
            <thead className="bg-[#0C2B4E] text-white">
              <tr>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Quantity</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-200">
                  <td className="p-3 md:p-4 text-sm md:text-base">
                    {order.customerName}
                  </td>
                  <td className="p-3 md:p-4 text-sm md:text-base">
                    {order.product}
                  </td>
                  <td className="p-3 md:p-4 text-sm md:text-base">
                    {order.quantity}
                  </td>
                  <td className="p-3 md:p-4 text-sm md:text-base">
                    ₹{order.amount}
                  </td>
                  <td className="p-3 md:p-4 text-sm md:text-base">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === order._id ? null : order._id,
                          )
                        }
                        className={`px-4 py-2 rounded-full text-sm font-medium capitalize flex items-center gap-2 transition ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "processing"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "shipped"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-green-100 text-green-700"
                        }`}
                      >
                        {order.status}

                        <ChevronDown size={16} />
                      </button>

                      {activeDropdown === order._id && (
                        <div className="absolute left-0 top-12 w-40 bg-white shadow-lg rounded-xl overflow-hidden z-50 border">
                          {statusFlow.map((status) => (
                            <button
                              key={status}
                              onClick={() =>
                                updateOrderStatus(order._id, status)
                              }
                              className="block w-full text-left px-4 py-3 hover:bg-gray-100 capitalize transition"
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3 md:p-4 text-sm md:text-base">
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="hover:text-red-600 hover:scale-110 hover-shake active:scale-95 text-red-500 p-2 transition duration-200"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 md:p-8 rounded-2xl w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-[#0C2B4E] duration-200"
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
                className="w-full border p-3 rounded-xl"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerName: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Product"
                className="w-full border p-3 rounded-xl"
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
                className="w-full border p-3 rounded-xl"
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
                className="w-full border p-3 rounded-xl"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: e.target.value,
                  })
                }
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={createOrder}
                  className="bg-[#1D546C] text-white px-5 py-2 rounded-xl"
                >
                  Create
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
