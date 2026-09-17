import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import toast from "react-hot-toast";
import { exportToExcel, exportToCSV } from "../utils/exportData";
import socket from "../services/socket";
import OrdersToolbar from "../components/orders/OrdersToolbar";
import OrdersTable from "../components/orders/OrdersTable";
import OrdersCards from "../components/orders/OrdersCards";
import CreateOrderModal from "../components/orders/CreateOrderModal";
import EditOrderModal from "../components/orders/EditOrderModal";
import DeleteConfirmModal from "../components/orders/DeleteConfirmModal";
import EmptyOrdersState from "../components/orders/EmptyOrdersState";
import OrdersPagination from "../components/orders/OrdersPagination";

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    customerName: "",
    product: "",
    quantity: "",
    amount: "",
  });
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currency, setCurrency] = useState("INR");

  // SORTING
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });
  const ORDERS_PER_PAGE = 10;
  const [formData, setFormData] = useState({
    customerName: "",
    product: "",
    quantity: "",
    amount: "",
  });

  // PERMISSIONS
  const canCreateOrders = !!user?.permissions?.canCreateOrders;
  const canUpdateOrders = !!user?.permissions?.canUpdateOrders;
  const canDeleteOrders = !!user?.permissions?.canDeleteOrders;
  const canExportReports = !!user?.permissions?.canExportReports;

  // STATUS FLOW
  const statusFlow = ["pending", "processing", "shipped", "delivered"];

  // OPEN UPWARD
  const shouldOpenUpward = (index, total) => {
    return index >= total - 2;
  };

  // STATUS COLORS
  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return `
          bg-yellow-100
          text-yellow-700
          dark:bg-yellow-500/15
          dark:text-yellow-300
        `;

      case "processing":
        return `
          bg-blue-100
          text-blue-700
          dark:bg-blue-500/15
          dark:text-blue-300
        `;

      case "shipped":
        return `
          bg-purple-100
          text-purple-700
          dark:bg-purple-500/15
          dark:text-purple-300
        `;

      case "delivered":
        return `
          bg-green-100
          text-green-700
          dark:bg-green-500/15
          dark:text-green-300
        `;

      default:
        return `
          bg-gray-100
          text-gray-700
          dark:bg-gray-700
          dark:text-gray-300
        `;
    }
  };

  // FETCH ORDERS
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data);
      const settingsResponse = await api.get("/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCurrency(settingsResponse.data.currency || "INR");
    } catch (error) {
      console.log(error.response?.data);

      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // ADDING SOCKET FOR ORDERS
  useEffect(() => {
    fetchOrders();

    const handleOrderCreated = (order) => {
      setOrders((prevOrders) => {
        const exists = prevOrders.some(
          (existingOrder) => existingOrder._id === order._id,
        );
        if (exists) {
          return prevOrders;
        }
        return [order, ...prevOrders];
      });
    };

    const handleOrderUpdated = (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order,
        ),
      );
    };
    const handleOrderDeleted = (orderId) => {
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId),
      );
    };

    socket.on("order-created", handleOrderCreated);
    socket.on("order-updated", handleOrderUpdated);
    socket.on("order-deleted", handleOrderDeleted);
    return () => {
      socket.off("order-created", handleOrderCreated);
      socket.off("order-updated", handleOrderUpdated);
      socket.off("order-deleted", handleOrderDeleted);
    };
  }, []);

  // CREATE ORDER
  const createOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post("/orders", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  // UPDATE STATUS
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

      toast.success("Order status updated");
    } catch (error) {
      console.log(error.response?.data);

      toast.error("Failed to update status");
    }
  };

  // OPEN EDIT MODAL
  const openEditModal = (order) => {
    setEditingOrderId(order._id);

    setEditFormData({
      customerName: order.customerName,
      product: order.product,
      quantity: order.quantity,
      amount: order.amount,
    });

    setShowEditModal(true);
  };

  // UPDATE ORDER
  const updateOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.patch(
        `/orders/${editingOrderId}`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === editingOrderId ? response.data.order : order,
        ),
      );

      setShowEditModal(false);

      setEditingOrderId(null);

      toast.success("Order updated successfully");
    } catch (error) {
      console.log(error.response?.data);

      toast.error("Failed to update order");
    }
  };

  // DELETE ORDER
  const deleteOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/orders/${selectedOrderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders((prev) =>
        prev.filter((order) => order._id !== selectedOrderId),
      );

      setDeleteModal(false);

      setSelectedOrderId(null);

      toast.success("Order deleted");
    } catch (error) {
      console.log(error.response?.data);

      toast.error("Failed to delete order");
    }
  };

  // SORT FUNCTION
  const handleSort = (key) => {
    setSortConfig((prev) => {
      //
      // NEW SORT
      //

      if (prev.key !== key) {
        return {
          key,
          direction: "asc",
        };
      }

      //
      // ASC -> DESC
      //

      if (prev.direction === "asc") {
        return {
          key,
          direction: "desc",
        };
      }

      //
      // DESC -> RESET
      //

      return {
        key: null,
        direction: null,
      };
    });
  };

  // FILTERED ORDERS
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    //
    // SEARCH
    //

    if (search.trim()) {
      filtered = filtered.filter((order) =>
        [order.customerName, order.product, order.status]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    }

    //
    // STATUS FILTER
    //

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    //
    // DEFAULT SORT
    //

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    //
    // CUSTOM SORT
    //

    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a, b) => {
        let aValue;
        let bValue;

        switch (sortConfig.key) {
          case "quantity":
            aValue = a.quantity;
            bValue = b.quantity;
            break;

          case "amount":
            aValue = a.amount;
            bValue = b.amount;
            break;

          case "createdAt":
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
            break;

          case "updatedAt":
            aValue = new Date(a.updatedAt || a.createdAt);

            bValue = new Date(b.updatedAt || b.createdAt);

            break;

          default:
            return 0;
        }

        if (sortConfig.direction === "asc") {
          return aValue > bValue ? 1 : -1;
        }

        return aValue < bValue ? 1 : -1;
      });
    }

    return filtered;
  }, [orders, search, statusFilter, sortConfig]);

  // PAGINATION
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ORDERS_PER_PAGE,
  );

  const getCurrencySymbol = () => {
    switch (currency) {
      case "USD":
        return "$";

      case "EUR":
        return "€";

      case "GBP":
        return "£";

      default:
        return "₹";
    }
  };

  // EXPORT ORDERS
  const getExportRows = () =>
    filteredOrders.map((order) => ({
      "Order Number": order.orderNumber,
      Customer: order.customerName,
      Product: order.product,
      Quantity: order.quantity,
      Amount: order.amount,
      Status: order.status,
      Date: new Date(order.createdAt).toLocaleDateString("en-IN"),
    }));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  return (
    <DashboardLayout
      title="Orders Management"
      subtitle="Manage and track all customer orders"
    >
      <div className="space-y-6" onClick={() => setActiveDropdown(null)}>
        <OrdersToolbar
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onExportExcel={() => exportToExcel(getExportRows(), "orders")}
          onExportCSV={() => exportToCSV(getExportRows(), "orders")}
          canCreateOrders={canCreateOrders}
          canExportReports={canExportReports}
          setShowModal={setShowModal}
          totalOrders={filteredOrders.length}
        />

        {loading ? (
          <div
            className="
              bg-white
              dark:bg-[#111827]
              rounded-3xl
              p-10
              text-center
              border
              border-gray-100
              dark:border-gray-800
            "
          >
            <p className="text-gray-500 dark:text-gray-400">
              Loading orders...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <EmptyOrdersState />
        ) : (
          <>
            <OrdersTable
              orders={paginatedOrders}
              canUpdateOrders={canUpdateOrders}
              currencySymbol={getCurrencySymbol()}
              canDeleteOrders={canDeleteOrders}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              updateOrderStatus={updateOrderStatus}
              openEditModal={openEditModal}
              deleteOrder={(id) => {
                setSelectedOrderId(id);
                setDeleteModal(true);
              }}
              statusFlow={statusFlow}
              shouldOpenUpward={shouldOpenUpward}
              getStatusStyles={getStatusStyles}
              sortConfig={sortConfig}
              handleSort={handleSort}
            />

            <OrdersCards
              orders={paginatedOrders}
              currencySymbol={getCurrencySymbol()}
              canUpdateOrders={canUpdateOrders}
              canDeleteOrders={canDeleteOrders}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              updateOrderStatus={updateOrderStatus}
              openEditModal={openEditModal}
              deleteOrder={(id) => {
                setSelectedOrderId(id);
                setDeleteModal(true);
              }}
              statusFlow={statusFlow}
              shouldOpenUpward={shouldOpenUpward}
              getStatusStyles={getStatusStyles}
            />

            {totalPages > 1 && (
              <OrdersPagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            )}
          </>
        )}

        <CreateOrderModal
          showModal={showModal}
          setShowModal={setShowModal}
          formData={formData}
          setFormData={setFormData}
          createOrder={createOrder}
        />

        <EditOrderModal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          updateOrder={updateOrder}
        />

        <DeleteConfirmModal
          deleteModal={deleteModal}
          setDeleteModal={setDeleteModal}
          onDelete={deleteOrder}
        />
      </div>
    </DashboardLayout>
  );
}

export default Orders;
