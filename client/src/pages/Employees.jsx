import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { ChevronDown } from "lucide-react";

function Employees() {
  const { user } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeRoleDropdown, setActiveRoleDropdown] = useState(null);

  //
  // AVAILABLE ROLES
  //

  const getAvailableRoles = () => {
    if (user?.role === "admin") {
      return ["admin", "manager", "operations", "analyst", "employee"];
    }

    if (user?.role === "manager") {
      return ["operations", "analyst", "employee"];
    }

    return [];
  };

  //
  // PERMISSIONS
  //

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

  //
  // OPEN UPWARD FOR LAST ROWS
  //

  const shouldOpenUpward = (index, total) => {
    return index >= total - 2;
  };

  //
  // ROLE CONTROL
  //

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

  //
  // UPDATE ROLE
  //

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

      setEmployees((prev) =>
        prev.map((employee) =>
          employee._id === userId
            ? {
                ...employee,
                role,
              }
            : employee,
        ),
      );

      setActiveRoleDropdown(null);

      toast.success("Role updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  //
  // UPDATE PERMISSION
  //

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

      setEmployees((prev) =>
        prev.map((employee) =>
          employee._id === userId
            ? {
                ...employee,
                permissions: {
                  ...employee.permissions,
                  [permissionKey]: value,
                },
              }
            : employee,
        ),
      );

      toast.success("Permission updated");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update permission",
      );
    }
  };

  //
  // FETCH EMPLOYEES
  //

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

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <DashboardLayout
      title="Employee Management"
      subtitle="Manage employee roles and permissions."
    >
      <div className="p-1 md:pt-6" onClick={() => setActiveRoleDropdown(null)}>
        {loading ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-gray-500">Loading employees...</p>
          </div>
        ) : (
          <>
            {/* DESKTOP */}

            <div className="hidden xl:block bg-white rounded-3xl shadow overflow-visible">
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
                    <tr key={employee._id} className="border-b border-gray-200">
                      <td className="p-5 whitespace-nowrap">{employee.name}</td>

                      <td className="p-5">{employee.email}</td>

                      <td className="p-5">
                        {canManageUser(employee) ? (
                          <div className="relative inline-block">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();

                                setActiveRoleDropdown(
                                  activeRoleDropdown === employee._id
                                    ? null
                                    : employee._id,
                                );
                              }}
                              className="bg-[#EAF2FF] hover:bg-[#DCE8FF] text-[#1D4ED8] rounded-full px-4 py-1.5 flex items-center gap-3 min-w-[130px] justify-between transition"
                            >
                              <span className="capitalize">
                                {employee.role}
                              </span>

                              <ChevronDown size={18} />
                            </button>

                            {activeRoleDropdown === employee._id && (
                              <div
                                className={`absolute left-0 z-50 min-w-[180px] bg-white border border-gray-200 rounded-3xl shadow-2xl py-2
                                ${
                                  shouldOpenUpward(index, employees.length)
                                    ? "bottom-12"
                                    : "top-12"
                                }`}
                              >
                                {getAvailableRoles().map((role) => (
                                  <button
                                    key={role}
                                    onClick={(e) => {
                                      e.stopPropagation();

                                      updateRole(employee._id, role);
                                    }}
                                    className="w-full text-left px-5 py-3 hover:bg-[#F4F7FA] transition capitalize"
                                  >
                                    {role}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="capitalize">{employee.role}</span>
                        )}
                      </td>

                      <td className="p-5">
                        <div className="flex flex-wrap gap-x-6 gap-y-4">
                          {permissionList.map((permission) => (
                            <label
                              key={permission.key}
                              className="flex items-center gap-2 text-sm whitespace-nowrap"
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
                  className="bg-white rounded-3xl shadow p-5"
                >
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>

                      <p className="mt-1">{employee.name}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Email</p>

                      <p className="mt-1">{employee.email}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-3">Role</p>

                      {canManageUser(employee) ? (
                        <div className="relative inline-block">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              setActiveRoleDropdown(
                                activeRoleDropdown === employee._id
                                  ? null
                                  : employee._id,
                              );
                            }}
                            className="bg-[#EAF2FF] hover:bg-[#DCE8FF] text-[#1D4ED8] rounded-full px-4 py-2 flex items-center gap-3 min-w-[140px] justify-between transition"
                          >
                            <span className="capitalize">{employee.role}</span>

                            <ChevronDown size={18} />
                          </button>

                          {activeRoleDropdown === employee._id && (
                            <div
                              className={`absolute left-0 z-50 min-w-[180px] bg-white border border-gray-200 rounded-3xl shadow-2xl py-2
                              ${
                                shouldOpenUpward(index, employees.length)
                                  ? "bottom-16"
                                  : "top-16"
                              }`}
                            >
                              {getAvailableRoles().map((role) => (
                                <button
                                  key={role}
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    updateRole(employee._id, role);
                                  }}
                                  className="w-full text-left px-5 py-3 hover:bg-[#F4F7FA] transition capitalize"
                                >
                                  {role}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="capitalize">
                          {employee.role}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-4">Permissions</p>

                      <div className="space-y-4">
                        {permissionList.map((permission) => (
                          <label
                            key={permission.key}
                            className="flex items-center justify-between gap-4"
                          >
                            <span className="text-sm">{permission.label}</span>

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
    </DashboardLayout>
  );
}

export default Employees;
