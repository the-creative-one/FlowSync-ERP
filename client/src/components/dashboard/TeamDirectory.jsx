import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";

import api from "../../api/axios";
import UserAvatar from "../common/UserAvatar";

function TeamDirectory() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const visibleEmployees = employees.slice(0, 3);

  const roleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700";

      case "manager":
        return "bg-violet-100 text-violet-700";

      case "operations":
        return "bg-blue-100 text-blue-700";

      case "analyst":
        return "bg-amber-100 text-amber-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className=" xl:col-span-2 rounded-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm p-6  ">
      {/* Header */}

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Employees
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            Team Directory
          </h2>
        </div>

        <div className="w-12 h-12 rounded-full bg-[#1D546C]/10 flex items-center justify-center">
          <Users size={24} className="text-[#1D546C]" />
        </div>
      </div>

      {/* Loading */}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="animate-pulse flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200" />

              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-40 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-28" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Team */}

          <div className="space-y-4">
            {visibleEmployees.map((employee) => (
              <div
                key={employee._id}
                className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-4
                    rounded-2xl
                    border
                    border-gray-100
                    dark:border-gray-700
                    hover:border-[#1D546C]/20
                    hover:bg-gray-50
                    dark:hover:bg-gray-800
                    transition-all
                    duration-300
                    p-4
                    "
              >
                <div className="flex items-center gap-4 min-w-0">
                  <UserAvatar user={employee} size="md" iconClassName="text-[#0C2B4E] dark:text-white"/>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {employee.name}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {employee.email}
                    </p>
                  </div>
                </div>

                <span
                  className={`
                  self-end
                  sm:self-auto
                  text-xs
                  font-semibold
                  capitalize
                  px-3
                  py-1
                  rounded-full
                  whitespace-nowrap
                  ${roleColor(employee.role)}
                `}
                >
                  {employee.role}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}

          <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Employees
            </p>

            <span className="font-bold text-[#1D546C]">{employees.length}</span>
          </div>

          <Link
            to="/employees"
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              text-[#1D546C]
              font-semibold
              hover:gap-3
              transition-all
            "
          >
            View All Employees
            <ArrowRight size={18} />
          </Link>
        </>
      )}
    </div>
  );
}

export default TeamDirectory;
