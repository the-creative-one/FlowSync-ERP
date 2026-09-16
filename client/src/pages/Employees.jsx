import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { ChevronDown, Bell, Plus } from "lucide-react";
import CreateUserModal from "../components/employees/CreateUserModal";
import PermissionRequests from "../components/employees/PermissionRequests";
import UserAvatar from "../components/common/UserAvatar";
import SmartDropdown from "../components/common/SmartDropdown";
import { useSocket } from "../context/SocketContext";

function Employees() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeRoleDropdown, setActiveRoleDropdown] = useState(null);
  const [requests, setRequests] = useState([]);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showRequestsDrawer, setShowRequestsDrawer] = useState(false);
  const pendingRequests = requests.filter(
    (request) => request.status === "pending",
  );

  useEffect(() => {
    const handleEmployeeCreated = (employee) => {
      setEmployees((prev) => {
        const exists = prev.some((item) => item._id === employee._id);

        if (exists) return prev;

        return [employee, ...prev];
      });
    };

    const handleEmployeeRoleChanged = (employee) => {
      setEmployees((prev) =>
        prev.map((item) => (item._id === employee._id ? employee : item)),
      );
    };

    const handleEmployeePermissionsChanged = (employee) => {
      setEmployees((prev) =>
        prev.map((item) => (item._id === employee._id ? employee : item)),
      );
    };

    socket.on("employee-created", handleEmployeeCreated);
    socket.on("employee-role-changed", handleEmployeeRoleChanged);
    socket.on("employee-permissions-changed", handleEmployeePermissionsChanged);

    return () => {
      socket.off("employee-created", handleEmployeeCreated);
      socket.off("employee-role-changed", handleEmployeeRoleChanged);
      socket.off(
        "employee-permissions-changed",
        handleEmployeePermissionsChanged,
      );
    };
  }, [socket]);

  // AVAILABLE ROLES
  const getAvailableRoles = () => {
    if (user?.role === "admin") {
      return ["admin", "manager", "operations", "analyst", "employee"];
    }

    if (user?.role === "manager") {
      return ["operations", "analyst", "employee"];
    }

    return [];
  };

  // PERMISSIONS
  const permissionList = [
    {
      key: "canCreateOrders",
      label: "Create Orders",
    },
    {
      key: "canUpdateOrders",
      label: "Update Orders",
    },
    {
      key: "canDeleteOrders",
      label: "Delete Orders",
    },
    {
      key: "canViewAdvancedAnalytics",
      label: "Analytics Access",
    },
    {
      key: "canExportReports",
      label: "Export Reports",
    },

    ...(user?.role === "admin"
      ? [
          {
            key: "canAccessSettings",
            label: "Settings Access",
          },
        ]
      : []),
  ];

  // OPEN UPWARD FOR LAST ROWS
  const shouldOpenUpward = (index, total) => {
    return index >= total - 2;
  };

  // ROLE CONTROL
  const canManageUser = (employee) => {
    if (employee.email === user?.email) {
      return false;
    }

    if (user?.role === "admin") {
      return true;
    }

    if (user?.role === "manager") {
      return employee.role !== "admin" && employee.role !== "manager";
    }

    return false;
  };

  // UPDATE ROLE
  const updateRole = async (userId, role) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/employees/${userId}/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setActiveRoleDropdown(null);
      toast.success("Role updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  // UPDATE PERMISSION
  const updatePermission = async (userId, permissionKey, value) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/employees/${userId}/permissions`,
        {
          [permissionKey]: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Permission updated");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update permission",
      );
    }
  };

  // FETCH EMPLOYEES
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
    } finally {
      setLoading(false);
    }
  };

  // FETCH REQUESTS
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/employees/requests?scope=team", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRequests(response.data);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  // APPROVE REQUEST
  const approveRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/employees/requests/${requestId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Request approved");
      fetchRequests();
      fetchEmployees();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve request");
    }
  };

  // REJECT REQUEST
  const rejectRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/employees/requests/${requestId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Request rejected");

      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request");
    }
  };

  useEffect(() => {
    fetchEmployees();

    if (user?.role === "admin" || user?.role === "manager") {
      fetchRequests();
    }
  }, []);

  return (
    <DashboardLayout
      title="User & Access Management"
      subtitle="Manage employee roles and permissions"
    >
      <div className="p-1 md:pt-6" onClick={() => setActiveRoleDropdown(null)}>
        <div className="flex justify-end items-center gap-4 mb-6">
          <button
            onClick={() => setShowRequestsDrawer(true)}
            className="
              relative
              bg-white
              dark:bg-[#111827]
              border
              border-gray-200
              dark:border-gray-700
              px-4
              py-3
              rounded-xl
              flex
              items-center
              justify-center
              gap-2
              hover:scale-[1.02]
              transition
              max-[418px]:w-12
              max-[418px]:h-12
              max-[418px]:p-0
            "
          >
            <div className="relative">
              <Bell size={18} />

              {pendingRequests.length > 0 && (
                <span
                  className="
                    hidden
                    max-[418px]:flex
                    absolute
                    -top-2
                    -right-2
                    w-5
                    h-5
                    items-center
                    justify-center
                    rounded-full
                    bg-red-500
                    text-white
                    text-[10px]
                    font-medium
                  "
                >
                  {pendingRequests.length}
                </span>
              )}
            </div>

            <span className="font-medium max-[418px]:hidden">
              Pending Requests
            </span>

            {pendingRequests.length > 0 && (
              <span
                className="
                  max-[418px]:hidden
                  bg-red-500
                  text-white
                  text-xs
                  px-2
                  py-1
                  rounded-full
                  min-w-[24px]
                "
              >
                {pendingRequests.length}
              </span>
            )}
          </button>

          {(user?.role === "admin" || user?.role === "manager") && (
            <button
              onClick={() => setShowCreateUserModal(true)}
              className="
                bg-[#1D546C]
                hover:bg-[#16485c]
                text-white
                px-5
                py-3
                rounded-xl
                font-medium
                transition
                flex
                items-center
                justify-center
                gap-2
                max-[418px]:w-12
                max-[418px]:h-12
                max-[418px]:p-0
              "
            >
              <Plus size={20} className="hidden max-[418px]:block" />

              <span className="max-[418px]:hidden">+ Create User</span>
            </button>
          )}
        </div>
        {loading ? (
          <div className="bg-white  dark:bg-[#111827]  rounded-2xl  shadow  p-8  text-center  border  border-gray-100  dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400">
              Loading employees...
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP */}
            <div className=" hidden xl:block bg-white dark:bg-[#111827] shadow overflow-visible border border-gray-100 dark:border-gray-800">
              <table className="w-full">
                <thead className="bg-[#0C2B4E] text-white">
                  <tr>
                    <th className="p-5 text-left w-[15%]">Name</th>

                    <th className="p-5 text-left w-[20%]">Email</th>

                    <th className="p-5 text-left w-[15%]">Role</th>

                    <th className="p-5 text-left w-[50%]">Permissions</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map((employee, index) => (
                    <tr
                      key={employee._id}
                      className=" border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1A2438] transition"
                    >
                      <td className="p-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <UserAvatar user={employee} size="sm" />

                          <span className="text-[#0C2B4E] dark:text-white">
                            {employee.name}
                          </span>
                        </div>
                      </td>

                      <td className="p-5 text-gray-700 dark:text-gray-300">
                        {employee.email}
                      </td>

                      <td className="p-5">
                        {canManageUser(employee) ? (
                          <SmartDropdown
                            trigger={
                              <button
                                className="
                                  bg-[#EAF2FF]
                                  hover:bg-[#DCE8FF]
                                  text-[#1D4ED8]
                                  dark:bg-[#1E3A5F]
                                  dark:hover:bg-[#27496D]
                                  dark:text-white
                                  rounded-full
                                  px-4
                                  py-1.5
                                  flex
                                  items-center
                                  gap-3
                                  min-w-[130px]
                                  justify-between
                                  transition
                                "
                              >
                                <span className="capitalize text-[#0C2B4E] dark:text-white">
                                  {employee.role}
                                </span>

                                <ChevronDown size={18} />
                              </button>
                            }
                          >
                            {({ close }) =>
                              getAvailableRoles().map((role) => (
                                <button
                                  key={role}
                                  onClick={() => {
                                    updateRole(employee._id, role);
                                    close();
                                  }}
                                  className="
                                    w-full
                                    text-left
                                    px-5
                                    py-3
                                    hover:bg-[#F4F7FA]
                                    dark:hover:bg-[#222e44]
                                    capitalize
                                    text-gray-700
                                    dark:text-gray-300
                                  "
                                >
                                  {role}
                                </button>
                              ))
                            }
                          </SmartDropdown>
                        ) : (
                          <span className="capitalize text-[#0C2B4E] dark:text-white">
                            {employee.role}
                          </span>
                        )}
                      </td>

                      <td className="p-5">
                        <div className="flex flex-wrap gap-x-6 gap-y-4">
                          {permissionList.map((permission) => (
                            <label
                              key={permission.key}
                              className="
                                flex
                                items-center
                                gap-2
                                text-sm
                                whitespace-nowrap
                                text-gray-700
                                dark:text-gray-300
                              "
                            >
                              <input
                                type="checkbox"
                                className="w-4 h-4 accent-[#1D546C]"
                                checked={
                                  employee.permissions?.[permission.key] ||
                                  false
                                }
                                disabled={!canManageUser(employee)}
                                onChange={(e) =>
                                  updatePermission(
                                    employee._id,
                                    permission.key,
                                    e.target.checked,
                                  )
                                }
                              />

                              {permission.label}
                            </label>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE + TABLET */}

            <div className="xl:hidden space-y-5">
              {employees.map((employee, index) => (
                <div
                  key={employee._id}
                  className="  bg-white  dark:bg-[#111827]  rounded-3xl  shadow  p-5  border  border-gray-100  dark:border-gray-800"
                >
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Name
                      </p>

                      <div className="flex items-center gap-3 mt-2">
                        <UserAvatar user={employee} size="sm" />

                        <p className="text-[#0C2B4E] dark:text-white">
                          {employee.name}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Email
                      </p>

                      <p className="mt-1 text-[#0C2B4E] dark:text-white">
                        {employee.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Role
                      </p>

                      {canManageUser(employee) ? (
                        <SmartDropdown
                          trigger={
                            <button
                              className="
                                bg-[#EAF2FF]
                                hover:bg-[#DCE8FF]
                                text-[#1D4ED8]
                                dark:bg-[#1E3A5F]
                                dark:hover:bg-[#27496D]
                                dark:text-white
                                rounded-full
                                px-4
                                py-1.5
                                flex
                                items-center
                                gap-3
                                min-w-[130px]
                                justify-between
                                transition
                              "
                            >
                              <span className="capitalize text-[#0C2B4E] dark:text-white">
                                {employee.role}
                              </span>

                              <ChevronDown size={18} />
                            </button>
                          }
                        >
                          {({ close }) =>
                            getAvailableRoles().map((role) => (
                              <button
                                key={role}
                                onClick={() => {
                                  updateRole(employee._id, role);
                                  close();
                                }}
                                className="
                                  w-full
                                  text-left
                                  px-5
                                  py-3
                                  hover:bg-[#F4F7FA]
                                  dark:hover:bg-[#222e44]
                                  capitalize
                                  text-gray-700
                                  dark:text-gray-300
                                "
                              >
                                {role}
                              </button>
                            ))
                          }
                        </SmartDropdown>
                      ) : (
                        <p className="capitalize text-[#0C2B4E] dark:text-white">
                          {employee.role}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Permissions
                      </p>

                      <div className="space-y-4">
                        {permissionList.map((permission) => (
                          <label
                            key={permission.key}
                            className="flex items-center justify-between gap-4"
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {permission.label}
                            </span>

                            <input
                              type="checkbox"
                              className="w-4 h-4 accent-[#1D546C]"
                              checked={
                                employee.permissions?.[permission.key] || false
                              }
                              disabled={!canManageUser(employee)}
                              onChange={(e) =>
                                updatePermission(
                                  employee._id,
                                  permission.key,
                                  e.target.checked,
                                )
                              }
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <CreateUserModal
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        currentUserRole={user?.role}
        onUserCreated={() => {
          fetchEmployees();
        }}
      />
      <PermissionRequests
        isOpen={showRequestsDrawer}
        onClose={() => setShowRequestsDrawer(false)}
        requests={requests}
        fetchRequests={fetchRequests}
      />
    </DashboardLayout>
  );
}

export default Employees;
