import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { ChevronDown, Search } from "lucide-react";
import PageSEO from "../seo/PageSEO";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage, setLogsPerPage] = useState(10);
  const [totalLogs, setTotalLogs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const fetchLogs = async (page = currentPage, limit = logsPerPage) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await api.get(
        `/activity-logs?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setLogs(response.data.logs);
      setTotalLogs(response.data.pagination.totalLogs);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.log(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage, logsPerPage);
  }, [currentPage, logsPerPage]);

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
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <PageSEO
        title="Activity Logs | FlowSync"
        description="Review user activity, system actions, and important changes across your FlowSync workspace."
        keywords="FlowSync activity logs, audit logs, user activity, system activity, audit trail"
      />
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
            <div className="mb-6 flex gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
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
                  placeholder="Search for user activities..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="
        w-full
        rounded
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

              <div className="flex items-center gap-2 text-md text-gray-500 dark:text-gray-400 shrink-0">
                <div className="relative">
                  <select
                    value={logsPerPage}
                    onChange={(e) => {
                      setLogsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="
                    appearance-none
                    rounded
                    border
                    border-gray-200
                    dark:border-gray-700
                    bg-white
                    dark:bg-[#111827]
                    px-3
                    pr-8
                    py-3
                    text-gray-700
                    dark:text-white
                    outline-none
                    focus:border-[#2563EB]
                    cursor-pointer
                  "
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>

                  <ChevronDown
                    size={15}
                    className="
                    pointer-events-none
                    absolute
                    right-2.5
                    top-1/2
                    -translate-y-1/2
                    text-gray-500
                    dark:text-gray-300
                  "
                  />
                </div>
              </div>
            </div>
            <div className="hidden lg:block overflow-x-auto">
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
            <div className="lg:hidden space-y-4">
              {filteredLogs.map((log) => (
                <div
                  key={log._id}
                  className="
                      border
                      border-gray-100
                      dark:border-gray-800
                      rounded
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
            <div className="mt-6 flex flex-col justify-center items-center gap-3">
              {/* Pagination */}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 1}
                  className="
        px-4
        py-2
        rounded
        border
        border-gray-200
        dark:border-gray-700
        text-sm
        font-medium
        dark:text-white
        disabled:opacity-40
        disabled:cursor-not-allowed
        hover:bg-gray-50
        dark:hover:bg-[#1A2438]
        transition
      "
                >
                  Previous
                </button>

                <span
                  className="
        px-4
        py-2
        rounded
        bg-[#0C2B4E]
        text-white
        text-sm
        font-medium
      "
                >
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === totalPages}
                  className="
        px-4
        py-2
        rounded
        border
        border-gray-200
        dark:border-gray-700
        text-sm
        font-medium
        dark:text-white
        disabled:opacity-40
        disabled:cursor-not-allowed
        hover:bg-gray-50
        dark:hover:bg-[#1A2438]
        transition
      "
                >
                  Next
                </button>
              </div>

              {/* Result Count */}

              <p className="sm:hidden text-sm text-gray-500 dark:text-gray-400">
                Result{" "}
                {totalLogs === 0
                  ? "0 logs"
                  : `${(currentPage - 1) * logsPerPage + 1}-${Math.min(
                      currentPage * logsPerPage,
                      totalLogs,
                    )} of ${totalLogs}`}
              </p>
            </div>
          </>
        )}
      </DashboardLayout>
    </>
  );
}

export default ActivityLogs;
