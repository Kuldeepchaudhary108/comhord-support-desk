import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex">
      {/* Fixed Left Navigation */}
      <Sidebar />

      {/* Main Content Area offset by sidebar width */}
      <div className="ml-64 flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;