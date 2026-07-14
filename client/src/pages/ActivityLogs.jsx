import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Search } from "lucide-react";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/activity-logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLogs(response.data);
    } catch (error) {
      console.log(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const searchTerm = search.toLowerCase();

    return (
      log.userName?.toLowerCase().includes(searchTerm) ||
      log.action?.toLowerCase().includes(searchTerm) ||
      log.module?.toLowerCase().includes(searchTerm) ||
      log.details?.toLowerCase().includes(searchTerm)
    );
  });

  const getActionStyles = (action) => {
    if (action.toLowerCase().includes("created")) {
      return "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300";
    }

    if (action.toLowerCase().includes("updated")) {
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300";
    }

    if (action.toLowerCase().includes("deleted")) {
      return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300";
    }

    if (action.toLowerCase().includes("export")) {
      return "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300";
    }

    return "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-300";
  };

  const getModuleStyles = (module) => {
    if (module === "Orders") {
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300";
    }

    if (module === "Analytics") {
      return "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300";
    }

    if (module === "Settings") {
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300";
    }

    return "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-300";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB").replace(/\//g, "-");
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-GB");
  };

  return (
    <DashboardLayout
      title="Activity Logs"
      subtitle="Track system activity and user actions"
    >
      {loading ? (
        <p className="text-gray-500 flex items-center justify-center py-12">
          Loading logs...
        </p>
      ) : logs.length === 0 ? (
        <div
          className="
              text-center
              py-12
              text-gray-500
              dark:text-gray-400
            "
        >
          No activity logs found.
        </div>
      ) : (
        <>
          <div className="mb-6 relative">
            <Search
              size={18}
              className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
            />

            <input
              type="text"
              placeholder="Search user, action, module or order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                  w-full
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-gray-700
                  bg-[#F8FAFC]
                  dark:bg-[#0F172A]
                  pl-11
                  pr-4
                  py-3
                  dark:text-white
                  placeholder:text-gray-400
                  outline-none
                  focus:border-[#2563EB]
                  transition
                "
            />
          </div>
          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full dark:bg-[#111827] bg-white">
              <thead
                className="
                  bg-[#0C2B4E]
                  text-white
                "
              >
                <tr>
                  <th className="p-5 text-left">User</th>

                  <th className="p-5 text-left">Action</th>

                  <th className="p-5 text-left">Module</th>

                  <th className="p-5 text-left">Details</th>

                  <th className="p-5 text-left">Date & Time</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((log) => (
                  <tr
                    key={log._id}
                    className="
                          border-b
                          border-gray-100
                          dark:border-gray-800
                          hover:bg-[#F8FAFC]
                          dark:hover:bg-[#1A2438]
                          transition
                        "
                  >
                    <td className="p-5 dark:text-white">{log.userName}</td>

                    <td className="p-5">
                      <span
                        className={`
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          font-medium
                          ${getActionStyles(log.action)}
                        `}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="p-5">
                      <span
                        className={`
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          font-medium
                          ${getModuleStyles(log.module)}
                        `}
                      >
                        {log.module}
                      </span>
                    </td>

                    <td
                      className="
                          p-5
                          font-medium
                          text-[#1D546C]
                          dark:text-blue-400
                        "
                    >
                      {log.details}
                    </td>

                    <td className="p-5 whitespace-nowrap">
                      <div>
                        <p className="dark:text-white">
                          {formatDate(log.createdAt)}
                        </p>

                        <p
                          className="
                              text-sm
                              text-gray-500
                              dark:text-gray-400
                            "
                        >
                          {formatTime(log.createdAt)}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards Layout */}
          <div className="xl:hidden space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log._id}
                className="
                      border
                      border-gray-100
                      dark:border-gray-800
                      rounded-2xl
                      p-4
                      dark:bg-[#0F172A]
                    "
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-medium
                          ${getActionStyles(log.action)}
                        `}
                    >
                      {log.action}
                    </span>

                    <span
                      className={`
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-medium
                          ${getModuleStyles(log.module)}
                        `}
                    >
                      {log.module}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      User
                    </p>

                    <p className="mt-1 font-semibold dark:text-white">
                      {log.userName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Details
                    </p>

                    <p className="mt-1 text-[#1D546C] dark:text-blue-400 font-medium">
                      {log.details}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Date & Time
                    </p>

                    <div className="mt-1">
                      <p className="dark:text-white">
                        {formatDate(log.createdAt)}
                      </p>

                      <p className="text-sm text-gray-400">
                        {formatTime(log.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default ActivityLogs;
