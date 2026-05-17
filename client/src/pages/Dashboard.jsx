import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

function Dashboard() {
  const [stats, setStats] = useState({});
  

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(response.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

 return (
  <DashboardLayout title="Dashboard Overview">
    <div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">Total Orders</h3>

          <p className="text-3xl font-bold text-[#0C2B4E]">
            {stats.totalOrders}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">Pending Orders</h3>

          <p className="text-3xl font-bold text-yellow-500">
            {stats.pendingOrders}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">Delivered Orders</h3>

          <p className="text-3xl font-bold text-green-600">
            {stats.deliveredOrders}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">Revenue</h3>

          <p className="text-3xl font-bold text-[#1D546C]">
            ₹{stats.totalRevenue}
          </p>
        </div>
      </div>
    </div>
  </DashboardLayout>
);
}

export default Dashboard;
