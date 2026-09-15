import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FeaturesPage from "./pages/FeaturesPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Analytics from "./pages/Analytics";
import Employees from "./pages/Employees";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import ActivityLogs from "./pages/ActivityLogs";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import NotFound from "./pages/NotFound";
import socket from "./services/socket";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();
  useEffect(() => {
    if (!user) {
      if (socket.connected) {
        socket.disconnect();
      }
      return;
    }
    socket.connect();
    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
    };
    const handleDisconnect = (reason) => {
      console.log("Socket disconnected:", reason);
    };
    const handleConnectError = (error) => {
      console.error("Socket connection error:", error.message, error);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, [user]);
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Orders */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        {/* Analytics */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute permission="canViewAdvancedAnalytics">
              <Analytics />
            </ProtectedRoute>
          }
        />
        {/* Employees */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute permission="canManageEmployees">
              <Employees />
            </ProtectedRoute>
          }
        />
        {/* Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute permission="canAccessSettings">
              <Settings />
            </ProtectedRoute>
          }
        />
        {/* Activity Logs */}
        <Route
          path="/activity-logs"
          element={
            <ProtectedRoute>
              <ActivityLogs />
            </ProtectedRoute>
          }
        />
        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* Reset Password */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Forgot Password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Other Pages */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
