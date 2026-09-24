import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import AvatarGeneratorModal from "../components/profile/AvatarGeneratorModal";
import UserAvatar from "../components/common/UserAvatar";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  PlusCircle,
  Pencil,
  Trash2,
  BarChart3,
  Download,
  Clock3,
  CheckCircle2,
  XCircle,
  X,
  UserPlus,
  RefreshCw,
  ShieldCheck,
  Camera,
  Palette,
  Upload,
  Eye,
  EyeOff,
  SquarePen,
} from "lucide-react";
import { useSocket } from "../context/SocketContext";
import PageSEO from "../seo/PageSEO";

function Profile() {
  const { user, fetchUser, setUser } = useAuth();
  const { socket } = useSocket();
  const [requests, setRequests] = useState([]);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);
  const [employees, setEmployees] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showAvatarGenerator, setShowAvatarGenerator] = useState(false);
  const avatarMenuRef = useRef(null);

  const permissionLabels = {
    canCreateOrders: "Create Orders",
    canUpdateOrders: "Update Orders",
    canDeleteOrders: "Delete Orders",
    canExportReports: "Export Orders",
    canViewAdvancedAnalytics: "Analytics Access",
  };

  const formatAuditDetails = (details) => {
    return details
      .replace("canCreateOrders", "Create Orders Access")
      .replace("canUpdateOrders", "Update Orders Access")
      .replace("canDeleteOrders", "Delete Orders Access")
      .replace("canExportReports", "Export Orders Access")
      .replace("canViewAdvancedAnalytics", "Analytics Access");
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const created = new Date(date);

    const diffInSeconds = Math.floor((now - created) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    }

    if (hours < 24) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    if (days < 7) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    if (weeks < 2) {
      return `${weeks} week ago`;
    }

    return created.toLocaleDateString();
  };

  const actionConfig = {
    USER_CREATED: {
      label: "User Created",
      badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },

    PERMISSION_APPROVED: {
      label: "Permission Approved",
      badge:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },

    PERMISSION_REJECTED: {
      label: "Permission Rejected",
      badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },

    ROLE_UPDATED: {
      label: "Role Updated",
      badge:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },

    PERMISSIONS_UPDATED: {
      label: "Permissions Updated",
      badge:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
  };

  const activityConfig = {
    USER_CREATED: {
      icon: UserPlus,
      iconClass: "text-blue-500 bg-blue-500/10",
    },

    PERMISSION_APPROVED: {
      icon: CheckCircle2,
      iconClass: "text-green-500 bg-green-500/10",
    },

    PERMISSION_REJECTED: {
      icon: XCircle,
      iconClass: "text-red-500 bg-red-500/10",
    },

    ROLE_UPDATED: {
      icon: RefreshCw,
      iconClass: "text-yellow-500 bg-yellow-500/10",
    },

    PERMISSIONS_UPDATED: {
      icon: ShieldCheck,
      iconClass: "text-purple-500 bg-purple-500/10",
    },
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/employees/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRequests(response.data);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const updateName = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setSavingName(true);

      const token = localStorage.getItem("token");

      const response = await api.put(
        "/profile/name",
        {
          name: name.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUser(response.data.user);
      setEditingName(false);

      toast.success("Name updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update name");
    } finally {
      setSavingName(false);
    }
  };

  const updatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setSavingPassword(true);

      const token = localStorage.getItem("token");

      await api.put(
        "/profile/password",
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      closePasswordDialog();

      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  const closePasswordDialog = () => {
    setShowPasswordDialog(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setShowPasswordRequirements(false);
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEmployees(response.data);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/employees/audit-logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAuditLogs(response.data);
    } catch (error) {
      console.log(error.response?.data);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        avatarMenuRef.current &&
        !avatarMenuRef.current.contains(event.target)
      ) {
        setShowAvatarMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const requestPermission = async (permissionKey) => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/employees/requests",
        {
          permissionKey,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Request submitted");

      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    }
  };

  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await api.post("/profile/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": false,
        },
      });
      await fetchUser();
      toast.success("Avatar updated");
      console.log(response.data.message);
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to upload avatar");
    }
  };

  const removeAvatar = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.delete("/profile/avatar", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchUser();

      setShowAvatarMenu(false);

      toast.success("Avatar removed");
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to remove avatar");
    }
  };

  const generateAvatar = async (avatarType) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        "/profile/avatar/generate",
        {
          avatarType,
          avatarSeed: `${user.name}-${Date.now()}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchUser();

      setShowAvatarGenerator(false);

      toast.success("Avatar generated");
    } catch (error) {
      toast.error("Failed to generate avatar");
      console.log(error.message);
    }
  };

  const hasPendingRequest = (permissionKey) => {
    return requests.some(
      (request) =>
        request.permissionKey === permissionKey && request.status === "pending",
    );
  };

  const permissionIcons = {
    canCreateOrders: PlusCircle,
    canUpdateOrders: Pencil,
    canDeleteOrders: Trash2,
    canViewAdvancedAnalytics: BarChart3,
    canExportReports: Download,
  };

  const hasPermissionToRequestAccess = Object.keys(permissionLabels).some(
    (permission) => !user?.permissions?.[permission],
  );
  const isManagerOrAdmin = user?.role === "manager" || user?.role === "admin";
  useEffect(() => {
    if (!user) return;
    if (hasPermissionToRequestAccess) {
      fetchRequests();
    }
    if (isManagerOrAdmin) {
      fetchEmployees();
      fetchAuditLogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  useEffect(() => {
    if (!user) return;
    const handleUserUpdated = async (updatedUser) => {
      if (updatedUser._id !== user._id) return;
      await fetchUser();
      await fetchRequests();
    };
    socket.on("user-updated", handleUserUpdated);
    return () => {
      socket.off("user-updated", handleUserUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, user?._id]);
  return (
    <>
      <PageSEO
        title="Profile | FlowSync"
        description="Manage your personal information, profile details, and account preferences in FlowSync."
        keywords="FlowSync profile, user profile, account settings, personal information"
      />
      <DashboardLayout
        title="My Profile"
        subtitle="Manage your account and permissions"
      >
        <div className="space-y-6">
          {/* HERO SECTION */}

          <div className="flex justify-center">
            <div
              className="
              w-full
              max-w-2xl
              bg-white
              dark:bg-[#111827]
              border
              border-gray-100
              dark:border-gray-800
              rounded-xl
              p-8
              text-center
              shadow-sm
            "
            >
              <div ref={avatarMenuRef} className="relative w-24 h-24 mx-auto">
                <div
                  className="
                  w-24
                  h-24
                  border
                border-gray-200
                dark:border-gray-800
                  rounded-full
                  overflow-hidden
                  flex
                  items-center
                  justify-center
                  text-4xl
                  font-bold
                  text-[#1D546C]
                  dark:text-white
                "
                >
                  <UserAvatar
                    user={user}
                    size="lg"
                    iconClassName="text-[#0C2B4E] dark:text-white"
                  />
                </div>

                <button
                  onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                  className="
                  absolute
                  bottom-0
                  right-0
                  w-8
                  h-8
                  rounded-full
                  bg-[#1D546C]
                  text-white
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  shadow-lg
                  hover:scale-105
                  transition
                "
                >
                  <Camera size={16} />
                </button>
                {showAvatarMenu && (
                  <div
                    className="
                    absolute
                    top-full
                    left-1/2
                    -translate-x-1/2
                    mt-3
                    w-64
                    max-w-[85vw]
                    bg-white
                    dark:bg-[#111827]
                    border
                    border-gray-200
                    dark:border-gray-700
                    rounded-xl
                    shadow-xl
                    overflow-hidden
                    z-50
                  "
                  >
                    <label
                      className="
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      cursor-pointer
                      hover:bg-gray-50
                      dark:hover:bg-[#1F2937]
                    "
                    >
                      <Upload size={18} />

                      <span>Upload Image</span>

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarSelect}
                      />
                    </label>

                    <button
                      onClick={() => {
                        setShowAvatarGenerator(true);
                        setShowAvatarMenu(false);
                      }}
                      className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      hover:bg-gray-50
                      dark:hover:bg-[#1F2937]
                    "
                    >
                      <Palette size={18} />

                      <span>Generate Avatar</span>
                    </button>

                    <button
                      onClick={removeAvatar}
                      className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-red-500
                      hover:bg-red-50
                      dark:hover:bg-red-900/20
                    "
                    >
                      <Trash2 size={18} />

                      <span>Remove Avatar</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="relative flex items-center justify-center">
                <h2 className="text-2xl font-bold text-[#0C2B4E] dark:text-white">
                  {user?.name}
                </h2>

                <button
                  type="button"
                  onClick={() => {
                    setName(user?.name || "");
                    setEditingName(true);
                  }}
                  className="
                    p-1.5
                    text-gray-400
                    hover:text-[#1D546C]
                    dark:hover:text-blue-400
                    transition
                  "
                  aria-label="Edit name"
                >
                  <SquarePen size={15} />
                </button>
              </div>

              <p className="text-gray-500 mt-2">{user?.email}</p>

              <div className="mt-4">
                <span
                  className="
                    px-4
                    py-2
                    rounded-full
                    bg-[#1D546C]/10
                    text-[#1D546C]
                    dark:text-[#6EB6D6]
                    font-medium
                    capitalize
                  "
                >
                  {user?.role}
                </span>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordDialog(true)}
                  className="
                    text-sm
                    font-medium
                    text-[#1D546C]
                    hover:font-bold
                    dark:text-blue-400
                  "
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
          {/* CURRENT PERMISSIONS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            {Object.entries(permissionLabels).map(([key, label]) => {
              const Icon = permissionIcons[key];

              return (
                <div
                  key={key}
                  className="
                  rounded
                  border
                  border-gray-200
                  dark:border-gray-800
                  bg-white
                  dark:bg-[#0F172A]
                  p-5
                  text-center
                  hover:shadow-md
                  dark:hover:shadow-lg
                  transition
                "
                >
                  <div
                    className={`
                      w-14
                      h-14
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      mx-auto
                      mb-4
                      ${
                        user?.permissions?.[key]
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-red-100 dark:bg-red-900/30"
                      }
                    `}
                  >
                    <Icon
                      size={26}
                      className={
                        user?.permissions?.[key]
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    />
                  </div>

                  <p
                    className="
                    font-semibold
                    text-[#0C2B4E]
                    dark:text-white
                  "
                  >
                    {label}
                  </p>

                  <p
                    className={`
                    mt-2
                    text-sm
                    font-medium
                    ${user?.permissions?.[key] ? "text-green-600" : "text-red-500"}
                  `}
                  >
                    {user?.permissions?.[key] ? "Granted" : "Not Granted"}
                  </p>
                </div>
              );
            })}
          </div>

          {/* REQUEST ACCESS */}

          {hasPermissionToRequestAccess && (
            <div
              className="
        bg-white
        dark:bg-[#111827]
        border
        border-gray-100
        dark:border-gray-800
        rounded-xl
        p-6
      "
            >
              <h2
                className="
          text-2xl
          font-bold
          text-[#0C2B4E]
          dark:text-white
          mb-6
        "
              >
                Request Additional Access
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Object.entries(permissionLabels)
                  .filter(([key]) => !user?.permissions?.[key])
                  .map(([key, label]) => (
                    <button
                      key={key}
                      disabled={hasPendingRequest(key)}
                      onClick={() => requestPermission(key)}
                      className="
                text-left
                rounded-2xl
                border
                border-gray-200
                dark:border-gray-700
                p-5
                transition
                hover:scale-[1.02]
                hover:border-[#1D546C]
                disabled:opacity-50
              "
                    >
                      <h3
                        className="
                  font-semibold
                  text-[#0C2B4E]
                  dark:text-white
                "
                      >
                        {label}
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        {hasPendingRequest(key)
                          ? "Pending Approval"
                          : "Request Access →"}
                      </p>
                    </button>
                  ))}
              </div>
            </div>
          )}
          {/* REQUEST HISTORY */}

          {!isManagerOrAdmin && (
            <div
              className="
        bg-white
        dark:bg-[#111827]
        border
        border-gray-100
        dark:border-gray-800
        rounded-xl
        p-6
      "
            >
              <h2
                className="
          text-2xl
          font-bold
          text-[#0C2B4E]
          dark:text-white
          mb-6
        "
              >
                Request History
              </h2>

              {requests.length ? (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div
                      key={request._id}
                      className="
                border
                border-gray-100
                dark:border-gray-800
                rounded-xl
                p-5
                flex
                items-center
                justify-between
              "
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          {request.status === "approved" ? (
                            <CheckCircle2
                              size={22}
                              className="text-green-600"
                            />
                          ) : request.status === "rejected" ? (
                            <XCircle size={22} className="text-red-500" />
                          ) : (
                            <Clock3 size={22} className="text-yellow-500" />
                          )}

                          <p
                            className="
                          font-semibold
                          text-[#0C2B4E]
                          dark:text-white
                        "
                          >
                            {permissionLabels[request.permissionKey]}
                          </p>
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                          {request.status === "approved"
                            ? "Permission granted by manager/admin"
                            : request.status === "rejected"
                              ? "Request was rejected"
                              : "Awaiting review"}
                        </p>
                      </div>

                      <span
                        className={`
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  font-medium
                  capitalize
                  ${
                    request.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : request.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }
                `}
                      >
                        {request.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No requests found</p>
                </div>
              )}
            </div>
          )}

          {/* RECENT TEAM ACTIVITY */}

          {isManagerOrAdmin && (
            <div
              className="
              bg-white
              dark:bg-[#111827]
              border
              border-gray-100
              dark:border-gray-800
              rounded-xl
              p-6
            "
            >
              <h2
                className="
                text-2xl
                font-bold
                text-[#0C2B4E]
                dark:text-white
                mb-6
              "
              >
                Recent Team Activity
              </h2>

              {auditLogs.length ? (
                <div
                  className="
                  grid
                  grid-cols-1
                  lg:grid-cols-2
                  gap-4
                "
                >
                  {auditLogs.map((log) => (
                    <div
                      key={log._id}
                      className="
                      flex
                      items-start
                      justify-between
                      border
                      border-gray-200
                      dark:border-gray-800
                      rounded
                      p-4
                    "
                    >
                      <div className="flex items-start gap-4">
                        {(() => {
                          const Icon =
                            activityConfig[log.action]?.icon || ShieldCheck;

                          return (
                            <div
                              className={`
                              p-3
                              rounded-full
                              ${activityConfig[log.action]?.iconClass}
                            `}
                            >
                              <Icon size={18} />
                            </div>
                          );
                        })()}

                        <div>
                          <p className="font-semibold dark:text-white">
                            {log.userId?.name}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {formatAuditDetails(log.details)}
                          </p>

                          <p className="text-xs text-gray-400 mt-2">
                            {getRelativeTime(log.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          )}
        </div>
        <AvatarGeneratorModal
          isOpen={showAvatarGenerator}
          onClose={() => setShowAvatarGenerator(false)}
          onSelect={generateAvatar}
          userName={user?.name || "User"}
        />
      </DashboardLayout>

      {editingName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-[#0C2B4E] dark:text-white">
                Edit Name
              </h3>

              <button
                type="button"
                onClick={() => setEditingName(false)}
                disabled={savingName}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white transition"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="
                w-full
                border
                border-gray-200
                dark:border-gray-700
                rounded
                px-4
                py-3
                outline-none
                bg-white
                dark:bg-[#1F2937]
                text-[#0C2B4E]
                dark:text-white
                focus:border-[#1D546C]
              "
            />

            <button
              type="button"
              onClick={updateName}
              disabled={savingName}
              className="
                  w-full
                  mt-5
                  px-4
                  py-3
                  rounded
                  bg-[#0C2B4E]
                  text-white
                  font-medium
                  disabled:opacity-50
                  transition
                "
            >
              {savingName ? "Saving..." : "Confirm"}
            </button>
          </div>
        </div>
      )}

      {showPasswordDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#0C2B4E] dark:text-white">
                Change Password
              </h3>

              <button
                type="button"
                onClick={closePasswordDialog}
                disabled={savingPassword}
                className="
            p-1
            text-gray-400
            hover:text-[#0C2B4E]
            dark:hover:text-white
            transition
          "
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* CURRENT PASSWORD */}

              <div>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="
                w-full
                border
                border-gray-300
                dark:border-gray-700
                rounded
                py-3
                px-4
                pr-12
                outline-none
                transition
                duration-300
                bg-white
                dark:bg-[#1F2937]
                dark:text-white
                dark:placeholder:text-gray-400
                focus:border-[#1D546C]
                dark:focus:border-blue-500
              "
                  />

                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                hover:text-[#0C2B4E]
                dark:hover:text-white
                transition
              "
                    aria-label={
                      showCurrentPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* NEW PASSWORD */}
              <div>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New password"
                    value={newPassword}
                    onFocus={() => setShowPasswordRequirements(true)}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setShowPasswordRequirements(true);
                    }}
                    className="
        w-full
        border
        border-gray-300
        dark:border-gray-700
        rounded
        py-3
        px-4
        pr-12
        outline-none
        transition
        duration-300
        bg-white
        dark:bg-[#1F2937]
        dark:text-white
        dark:placeholder:text-gray-400
        focus:border-[#1D546C]
        dark:focus:border-blue-500
      "
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="
        absolute
        right-4
        top-1/2
        -translate-y-1/2
        text-gray-400
        hover:text-[#0C2B4E]
        dark:hover:text-white
        transition
      "
                    aria-label={
                      showNewPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {showPasswordRequirements && (
                  <div
                    className="
      mt-2
      rounded
      bg-gray-50
      dark:bg-[#0F172A]
      border
      border-gray-100
      dark:border-gray-800
      p-4
    "
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        {
                          valid: newPassword.length >= 8,
                          label: "At least 8 characters",
                        },
                        {
                          valid: /[A-Z]/.test(newPassword),
                          label: "One uppercase letter",
                        },
                        {
                          valid: /[a-z]/.test(newPassword),
                          label: "One lowercase letter",
                        },
                        {
                          valid: /\d/.test(newPassword),
                          label: "One number",
                        },
                        {
                          valid: /[^A-Za-z0-9]/.test(newPassword),
                          label: "One special character",
                        },
                      ].map((requirement) => (
                        <div
                          key={requirement.label}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span
                            className={
                              requirement.valid
                                ? "text-green-500"
                                : "text-gray-400"
                            }
                          >
                            {requirement.valid ? "✓" : "×"}
                          </span>

                          <span
                            className={
                              requirement.valid
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-500 dark:text-gray-400"
                            }
                          >
                            {requirement.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* CONFIRM PASSWORD */}

              <div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="
                w-full
                border
                border-gray-300
                dark:border-gray-700
                rounded
                py-3
                px-4
                pr-12
                outline-none
                transition
                duration-300
                bg-white
                dark:bg-[#1F2937]
                dark:text-white
                dark:placeholder:text-gray-400
                focus:border-[#1D546C]
                dark:focus:border-blue-500
              "
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                hover:text-[#0C2B4E]
                dark:hover:text-white
                transition
              "
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={updatePassword}
              disabled={savingPassword}
              className="
          w-full
          mt-6
          bg-[#1D546C]
          hover:bg-[#16485c]
          dark:bg-blue-600
          dark:hover:bg-blue-500
          text-white
          py-3
          rounded
          font-semibold
          transition
          duration-300
          disabled:opacity-50
        "
            >
              {savingPassword ? "Updating..." : "Confirm"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
