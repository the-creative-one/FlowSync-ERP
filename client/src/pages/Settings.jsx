import { useEffect, useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Pencil,
  X,
  Receipt,
  Wallet,
  ClipboardList,
  ChevronDown,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Settings() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    currency: "INR",
    orderPrefix: "ORD",
  });
  const [editSettings, setEditSettings] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    currency: "INR",
    orderPrefix: "ORD",
  });

  const isAdmin = user?.role === "admin";
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const currencies = ["INR (₹)", "USD ($)", "EUR (€)", "GBP (£)"];

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSettings(response.data);
    } catch (error) {
      console.log(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (
      !editSettings.companyName.trim() ||
      !editSettings.companyEmail.trim() ||
      !editSettings.companyPhone.trim() ||
      !editSettings.companyAddress.trim()
    ) {
      return toast.error("All fields are required");
    }
    try {
      const token = localStorage.getItem("token");

      await api.put("/settings", editSettings, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSettings(editSettings);

      toast.success("Settings updated successfully");
    } catch (error) {
      console.log(error.response?.data);

      toast.error(error.response?.data?.message || "Failed to update settings");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage company information and system settings"
    >
      <div className="space-y-6">
        <div
          className="
          bg-white
          dark:bg-[#111827]
          border
          border-gray-100
          dark:border-gray-800
          rounded-xl
          overflow-hidden
        "
        >
          <div
            className="h-20
            md:h-32
            bg-gradient-to-r
            from-[#1D546C]
            to-[#2B6F8A]
          "
          />

          <div className="px-4 md:px-8 pb-8">
            <div
              className="
              -mt-12
              w-24
              h-24
              rounded-xl
              bg-white
              dark:bg-[#1F2937]
              border-4
              border-white
              dark:border-[#111827]
              flex
              items-center
              justify-center
              shadow-lg
            "
            >
              <Building2 size={38} className="text-[#1D546C]" />
            </div>

            <div className="mt-3 md:mt-6 relative">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold dark:text-white">
                    {settings.companyName || "Company Name"}
                  </h2>

                  <p className="text-gray-500 mt-2">Organization Settings</p>
                </div>

                {isAdmin && (
                  <>
                    {/* Desktop */}
                    <button
                      onClick={() => {
                        setEditSettings({ ...settings });
                        setShowEditModal(true);
                      }}
                      className="
                        hidden
                        md:flex
                        bg-[#1D546C]
                        hover:bg-[#16485c]
                        text-white
                        px-5
                        py-3
                        rounded
                        items-center
                        gap-2
                        transition
                      "
                    >
                      <Pencil size={18} />
                      Edit Company Information
                    </button>

                    {/* Mobile */}
                    <button
                      onClick={() => {
                        setEditSettings({ ...settings });
                        setShowEditModal(true);
                      }}
                      className="
                        md:hidden
                        absolute
                        top-0
                        right-3
                        w-11
                        h-11
                        rounded-full
                        bg-[#1D546C]
                        hover:bg-[#16485c]
                        text-white
                        flex
                        items-center
                        justify-center
                        transition
                      "
                    >
                      <Pencil size={18} />
                    </button>
                  </>
                )}
              </div>

              <div
                className="
                mt-8
                grid
                grid-cols-1
                md:grid-cols-2
                gap-6
              "
              >
                <div
                  className="
                  bg-[#F8FAFC]
                  dark:bg-[#1F2937]
                  rounded
                  p-5
                "
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Mail size={18} className="text-[#1D546C]" />

                    <span className="text-sm text-gray-500">Company Email</span>
                  </div>

                  <p className="font-medium dark:text-white">
                    {settings.companyEmail || "-"}
                  </p>
                </div>

                <div
                  className="
                  bg-[#F8FAFC]
                  dark:bg-[#1F2937]
                  rounded
                  p-5
                "
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Phone size={18} className="text-[#1D546C]" />

                    <span className="text-sm text-gray-500">Company Phone</span>
                  </div>

                  <p className="font-medium dark:text-white">
                    {settings.companyPhone || "-"}
                  </p>
                </div>

                <div
                  className="
                  bg-[#F8FAFC]
                  dark:bg-[#1F2937]
                  rounded
                  p-5
                  md:col-span-2
                "
                >
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin size={18} className="text-[#1D546C]" />

                    <span className="text-sm text-gray-500">
                      Company Address
                    </span>
                  </div>

                  <p className="font-medium dark:text-white">
                    {settings.companyAddress || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Business Information */}
        <div
          className="
            bg-white
            dark:bg-[#111827]
            border
            border-gray-100
            dark:border-gray-800
            rounded-xl
            md:p-6
            p-4
          "
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Receipt size={24} className="text-[#1D546C] mb-8 md:mb-3" />

              <div>
                <h2 className="text-2xl font-bold dark:text-white">
                  Business Settings
                </h2>

                <p className="text-gray-500 text-sm">
                  Organization-wide business configuration
                </p>
              </div>
            </div>

            {isAdmin && (
              <>
                <button
                  onClick={() => {
                    setEditSettings({ ...settings });
                    setShowBusinessModal(true);
                  }}
                  className="
                    hidden
                    md:flex
                    bg-[#1D546C]
                    hover:bg-[#16485c]
                    text-white
                    px-5
                    py-3
                    rounded
                    items-center
                    gap-2
                    transition
                  "
                >
                  <Pencil size={18} />
                  Edit Business Settings
                </button>

                <button
                  onClick={() => {
                    setEditSettings({ ...settings });
                    setShowBusinessModal(true);
                  }}
                  className="
                    md:hidden
                    w-11
                    h-11
                    rounded-full
                    bg-[#1D546C]
                    text-white
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Pencil size={18} />
                </button>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="
                bg-[#F8FAFC]
                dark:bg-[#1F2937]
                rounded
                p-5
              "
            >
              <div className="flex items-center gap-3 mb-2">
                <Wallet size={18} className="text-[#1D546C]" />

                <span className="text-sm text-gray-500">Default Currency</span>
              </div>

              <p className="font-medium dark:text-white">
                {settings.currency === "INR" && "INR (₹)"}

                {settings.currency === "USD" && "USD ($)"}

                {settings.currency === "EUR" && "EUR (€)"}

                {settings.currency === "GBP" && "GBP (£)"}
              </p>
            </div>

            <div
              className="
                bg-[#F8FAFC]
                dark:bg-[#1F2937]
                rounded
                p-5
              "
            >
              <div className="flex items-center gap-3 mb-2">
                <ClipboardList size={18} className="text-[#1D546C]" />
                <span className="text-sm text-gray-500">Order Prefix</span>
              </div>

              <p className="font-medium dark:text-white">
                {settings.orderPrefix}
              </p>
            </div>
          </div>
        </div>

        {showEditModal && (
          <div
            className="
            fixed
            inset-0
            bg-black/50
            z-[9998]
            flex
            items-center
            justify-center
            p-4
          "
          >
            <div
              className="
              bg-white
              dark:bg-[#111827]
              rounded-xl
              w-full
              max-w-2xl
              p-6
              border
              border-gray-200
              dark:border-gray-700
              z-[9999]
            "
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold dark:text-white">
                  Edit Company Information
                </h2>

                <button onClick={() => setShowEditModal(false)}>
                  <X size={22} />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={editSettings.companyName}
                  onChange={(e) =>
                    setEditSettings({
                      ...editSettings,
                      companyName: e.target.value,
                    })
                  }
                  className="
                  w-full
                  rounded
                  border
                  border-gray-200
                  dark:border-gray-700
                  bg-gray-50
                  dark:bg-[#1F2937]
                  px-4
                  py-3
                  dark:text-white
                "
                />

                <input
                  type="email"
                  placeholder="Company Email"
                  value={editSettings.companyEmail}
                  onChange={(e) =>
                    setEditSettings({
                      ...editSettings,
                      companyEmail: e.target.value,
                    })
                  }
                  className="
                  w-full
                  rounded
                  border
                  border-gray-200
                  dark:border-gray-700
                  bg-gray-50
                  dark:bg-[#1F2937]
                  px-4
                  py-3
                  dark:text-white
                "
                />

                <input
                  type="text"
                  placeholder="Company Phone"
                  value={editSettings.companyPhone}
                  onChange={(e) =>
                    setEditSettings({
                      ...editSettings,
                      companyPhone: e.target.value,
                    })
                  }
                  className="
                  w-full
                  rounded
                  border
                  border-gray-200
                  dark:border-gray-700
                  bg-gray-50
                  dark:bg-[#1F2937]
                  px-4
                  py-3
                  dark:text-white
                "
                />

                <textarea
                  rows="4"
                  placeholder="Company Address"
                  value={editSettings.companyAddress}
                  onChange={(e) =>
                    setEditSettings({
                      ...editSettings,
                      companyAddress: e.target.value,
                    })
                  }
                  className="
                  w-full
                  rounded
                  border
                  border-gray-200
                  dark:border-gray-700
                  bg-gray-50
                  dark:bg-[#1F2937]
                  px-4
                  py-3
                  dark:text-white
                "
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                  <button
                  onClick={async () => {
                    await saveSettings();
                    setShowEditModal(false);
                  }}
                  className="
                  bg-[#1D546C]
                  hover:bg-[#16485c]
                  text-white
                  px-6
                  py-3
                  rounded
                "
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
        {showBusinessModal && (
          <div
            className="
              fixed
              inset-0
              bg-black/50
              z-[9998]
              flex
              items-center
              justify-center
              p-4
            "
          >
            <div
              className="
                bg-white
                dark:bg-[#111827]
                rounded-xl
                w-full
                max-w-xl
                p-6
                border
                border-gray-200
                dark:border-gray-700
                z-[9999]
              "
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold dark:text-white">
                  Edit Business Settings
                </h2>

                <button
                  onClick={() => {
                    setEditSettings({ ...settings });
                    setShowBusinessModal(false);
                  }}
                >
                  <X size={22} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-500">
                    Default Currency
                  </label>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrencyDropdown(!showCurrencyDropdown)
                      }
                      className="
                        w-full
                        border
                        border-gray-300
                        dark:border-gray-700
                        rounded
                        px-4
                        py-3
                        flex
                        items-center
                        justify-between
                        dark:text-white
                        transition
                      "
                    >
                      <span>
                        {editSettings.currency === "INR" && "INR (₹)"}
                        {editSettings.currency === "USD" && "USD ($)"}
                        {editSettings.currency === "EUR" && "EUR (€)"}
                        {editSettings.currency === "GBP" && "GBP (£)"}
                      </span>

                      <ChevronDown size={18} />
                    </button>

                    {showCurrencyDropdown && (
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
                          rounded
                          shadow-xl
                          overflow-hidden
                        "
                      >
                        {currencies.map((currency) => (
                          <button
                            key={currency}
                            type="button"
                            onClick={() => {
                              const value = currency.split(" ")[0];

                              setEditSettings({
                                ...editSettings,
                                currency: value,
                              });

                              setShowCurrencyDropdown(false);
                            }}
                            className="
                              w-full
                              text-left
                              px-4
                              py-3
                              hover:bg-gray-100
                              dark:hover:bg-[#1F2937]
                              transition
                            "
                          >
                            {currency}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-500">
                    Order Prefix
                  </label>

                  <input
                    type="text"
                    maxLength={8}
                    value={editSettings.orderPrefix}
                    onChange={(e) =>
                      setEditSettings({
                        ...editSettings,
                        orderPrefix: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="ORD"
                    className="
                      w-full
                      rounded
                      border
                      border-gray-200
                      dark:border-gray-700
                      bg-gray-50
                      dark:bg-[#1F2937]
                      px-4
                      py-3
                      dark:text-white
                    "
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                            <button
                  onClick={async () => {
                    if (!editSettings.orderPrefix.trim()) {
                      return toast.error("Order Prefix is required");
                    }

                    await saveSettings();

                    setShowBusinessModal(false);
                  }}
                  className="
                    bg-[#1D546C]
                    hover:bg-[#16485c]
                    text-white
                    px-6
                    py-3
                    rounded
                  "
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Settings;
