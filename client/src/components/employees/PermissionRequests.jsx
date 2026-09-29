import { X, Bell, Check, ShieldCheck } from "lucide-react";
import api from "../../api/axios";
import UserAvatar from "../common/UserAvatar";
import socket from "../../services/socket";
import { useEffect } from "react";

function PermissionRequests({ isOpen, onClose, requests, fetchRequests }) {
  useEffect(() => {
    const handleRequestCreated = () => {
      fetchRequests();
    };
    const handleRequestApproved = () => {
      fetchRequests();
    };
    const handleRequestRejected = () => {
      fetchRequests();
    };

    socket.on("permission-request-created", handleRequestCreated);
    socket.on("permission-request-approved", handleRequestApproved);
    socket.on("permission-request-rejected", handleRequestRejected);

    return () => {
      socket.off("permission-request-created", handleRequestCreated);
      socket.off("permission-request-approved", handleRequestApproved);
      socket.off("permission-request-rejected", handleRequestRejected);
    };
  }, [fetchRequests]);
  if (!isOpen) return null;

  const pendingRequests = requests.filter(
    (request) => request.status === "pending",
  );

  const permissionLabels = {
    canCreateOrders: "Create Orders Access",
    canUpdateOrders: "Update Orders Access",
    canDeleteOrders: "Delete Orders Access",
    canViewAdvancedAnalytics: "Analytics Access",
    canExportReports: "Export Reports Access",
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const createdAt = new Date(date);
    const diffMs = now - createdAt;
    const minutes = Math.floor(diffMs / (1000 * 60));
    if (minutes < 60) {
      return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
    const weeks = Math.floor(days / 7);
    if (weeks <= 2) {
      return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
    }
    return createdAt.toLocaleDateString();
  };

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

      await fetchRequests();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

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

      await fetchRequests();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return (
    <>
      <div
        className="
          fixed
          inset-0
          bg-black/40
          z-[9998]
        "
        onClick={onClose}
      />

      <div
        className="
          fixed
          top-0
          right-0
          h-full
          w-full
          max-w-[420px]
          bg-white
          dark:bg-[#111827]
          border-l
          border-gray-200
          dark:border-gray-700
          z-[9999]
          shadow-2xl
          flex
          flex-col
        "
      >
        <div
          className="
            p-6
            border-b
            border-gray-200
            dark:border-gray-700
            flex
            items-center
            justify-between
          "
        >
          <div className="flex items-center gap-3">
            <Bell size={20} />

            <div>
              <h2 className="font-bold text-lg">Permission Requests</h2>

              <p className="text-sm text-gray-500">
                {pendingRequests.length} awaiting review
              </p>
            </div>
          </div>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {pendingRequests.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <Bell size={42} className="mx-auto text-gray-400 mb-3" />
                <h3 className="font-semibold text-lg">No Pending Requests</h3>

                <p className="text-sm text-gray-500 mt-1">
                  All permission requests have been reviewed.
                </p>
              </div>
            </div>
          ) : (
            pendingRequests.map((request) => {
              return (
                <div
                  key={request._id}
                  className="
                  p-4
                  mb-3
                  rounded
                  border
                  border-gray-200
                  dark:border-gray-700
                  bg-white
                  dark:bg-[#1F2937]
                "
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={request.employeeId} size="sm" iconClassName="text-[#0C2B4E] dark:text-white"/>

                      <div>
                        <h3 className="font-semibold text-lg">
                          {request.employeeId?.name}
                        </h3>

                        <p className="text-sm text-gray-500 capitalize">
                          {request.employeeId?.role}
                          {" • "}
                          {getTimeAgo(request.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => approveRequest(request._id)}
                        className="
                          w-9
                          h-9
                          rounded-full
                          bg-green-500/10
                          text-green-500
                          hover:bg-green-500
                          hover:text-white
                          transition
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <Check size={18} />
                      </button>

                      <button
                        onClick={() => rejectRequest(request._id)}
                        className="
                          w-9
                          h-9
                          rounded-full
                          bg-red-500/10
                          text-red-500
                          hover:bg-red-500
                          hover:text-white
                          transition
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      gap-2
                      text-base
                      font-medium
                    "
                  >
                    <ShieldCheck size={18} className="text-[#1D546C]" />
                    <span>{permissionLabels[request.permissionKey]}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default PermissionRequests;
