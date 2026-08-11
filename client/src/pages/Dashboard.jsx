import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardStats from "../components/dashboard/DashboardStats";
import WelcomeHero from "../components/dashboard/WelcomeHero/WelcomeHero";
import { useAuth } from "../context/AuthContext";
import TeamDirectory from "../components/dashboard/TeamDirectory";
import LifetimeRevenue from "../components/dashboard/LifetimeRevenue";
import RecentOrders from "../components/dashboard/RecentOrders/RecentOrders";

function Dashboard() {
  const [stats, setStats] = useState({});

  const { user } = useAuth();

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
      console.log(error.response?.data);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <DashboardLayout
      title="Dashboard Overview"
      subtitle="Monitor business performance and order insights"
    >
      <div className="space-y-6">
        {/* STATS GRID */}
        <DashboardStats stats={stats} />

        <WelcomeHero user={user} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {user?.permissions?.canManageEmployees ? (
            <TeamDirectory />
          ) : (
            <RecentOrders />
          )}

          <LifetimeRevenue stats={stats} />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
