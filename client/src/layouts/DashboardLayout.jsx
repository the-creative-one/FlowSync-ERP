function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F4F4F4]">
      {/* Sidebar */}
      <div className="w-64 bg-[#0C2B4E] text-white p-5">
        <h1 className="text-2xl font-bold mb-10">
          FlowSync ERP
        </h1>

        <ul className="space-y-4">
          <li className="cursor-pointer hover:text-gray-300">
            Dashboard
          </li>

          <li className="cursor-pointer hover:text-gray-300">
            Orders
          </li>

          <li className="cursor-pointer hover:text-gray-300">
            Inventory
          </li>

          <li className="cursor-pointer hover:text-gray-300">
            Vendors
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Navbar */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#0C2B4E]">
            Dashboard
          </h2>

          <button className="bg-[#1D546C] text-white px-4 py-2 rounded-lg">
            Logout
          </button>
        </div>

        {/* Page Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;