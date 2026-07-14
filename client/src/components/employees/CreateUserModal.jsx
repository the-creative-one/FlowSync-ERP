import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

function CreateUserModal({ isOpen, onClose, onUserCreated, currentUserRole }) {
  const [loading, setLoading] = useState(false);

  const [createdUser, setCreatedUser] = useState(null);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "employee",
  });

  const availableRoles =
    currentUserRole === "admin"
      ? ["manager", "operations", "analyst", "employee"]
      : ["operations", "analyst", "employee"];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.post("/employees/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCreatedUser(response.data.user);

      toast.success("User created successfully");

      onUserCreated();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="
          w-full
          max-w-lg
          bg-white
          dark:bg-[#111827]
          border
          border-gray-100
          dark:border-gray-800
          rounded-3xl
          shadow-2xl
          relative
          overflow-visible
        "
      >
        <button
          onClick={() => {
            setCreatedUser(null);
            onClose();
          }}
          className="
              absolute
              top-4
              right-4
              text-gray-500
              hover:text-[#0C2B4E]
              dark:hover:text-white
              transition
              z-10
            "
        >
          <X size={22} />
        </button>
        {!createdUser ? (
          <>
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-[#0C2B4E] dark:text-white">
                Create User
              </h2>

              <p className="text-gray-500 mt-1">Create a new account</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block mb-2 font-medium">Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="
                      w-full
                      border
                      border-gray-300
                      dark:border-gray-700
                      bg-white
                      dark:bg-[#1F2937]
                      dark:text-white
                      dark:placeholder:text-gray-400
                      p-3
                      rounded-xl
                      outline-none
                      transition
                      focus:border-[#1D546C]
                    "
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="
                      w-full
                      border
                      border-gray-300
                      dark:border-gray-700
                      bg-white
                      dark:bg-[#1F2937]
                      dark:text-white
                      dark:placeholder:text-gray-400
                      p-3
                      rounded-xl
                      outline-none
                      transition
                      focus:border-[#1D546C]
                    "
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Role</label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="
                      w-full
                      border
                      border-gray-300
                      dark:border-gray-700
                      dark:border-gray-700
                      dark:text-white
                      dark:placeholder:text-gray-400
                      rounded-xl
                      px-4
                      py-3
                      flex
                      items-center
                      justify-between
                      transition
                    "
                  >
                    <span className="capitalize">{formData.role}</span>

                    <ChevronDown size={18} />
                  </button>

                  {showRoleDropdown && (
                    <div
                      className="
                          absolute
                          left-0
                          right-0
                          top-14
                          z-50
                          bg-white
                          dark:bg-[#111827]
                          border
                          border-gray-200
                          dark:border-gray-700
                          rounded-2xl
                          shadow-xl
                          overflow-hidden
                        "
                    >
                      {availableRoles.map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              role,
                            });

                            setShowRoleDropdown(false);
                          }}
                          className="
                              w-full
                              text-left
                              px-4
                              py-3
                              hover:bg-gray-100
                              dark:hover:bg-[#1F2937]
                              capitalize
                              transition
                            "
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="
                      px-5
                      py-3
                      rounded-xl
                      border
                      border-gray-300
                      dark:border-gray-700
                      text-gray-700
                      dark:text-gray-300
                      hover:bg-gray-100
                      dark:hover:bg-[#1F2937]
                      transition
                    "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-3 rounded-xl bg-[#1D546C] text-white"
                >
                  {loading ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-6">User Created</h2>

            <div className="bg-green-50 dark:bg-green-950 rounded-2xl p-5">
              <p className="font-semibold">Temporary Password</p>

              <p className="text-3xl font-bold mt-3">
                {createdUser.temporaryPassword}
              </p>
            </div>

            <p className="text-sm text-gray-500 mt-5">
              Share this password securely with the employee.
            </p>

            <button
              onClick={() => {
                setCreatedUser(null);

                onClose();
              }}
              className="mt-6 px-6 py-3 rounded-xl bg-[#1D546C] text-white"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateUserModal;
