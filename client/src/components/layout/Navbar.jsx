import { LogOut, Shield, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { logout } from "../../features/auth/authSlice.js";

const routeNames = {
  "/dashboard": { title: "Dashboard", subtitle: "Overview and operations metrics" },
  "/tickets": { title: "Tickets", subtitle: "Customer requests and inquiries" },
  "/tickets/new": { title: "Create Ticket", subtitle: "File a new customer support issue" },
  "/agents": { title: "Support Agents", subtitle: "Team members and access management" },
};

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const currentRoute = routeNames[location.pathname] || {
    title: location.pathname.startsWith("/tickets/") ? "Ticket Details" : "Support Operations",
    subtitle: "Manage and resolve customer requests",
  };

  const handleLogout = async () => {
    await dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-8 flex items-center justify-between shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-slate-800 tracking-tight">
            {currentRoute.title}
          </h2>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
            Support Desk
          </span>
        </div>

        <p className="text-xs text-slate-400 hidden md:block">
          {currentRoute.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-sm ring-2 ring-white">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={15} />}
          </div>

          <div className="hidden sm:block text-left">
            <strong className="block text-xs font-semibold text-slate-800 leading-tight">
              {user?.name || "Support User"}
            </strong>

            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 capitalize">
              <Shield size={10} className="text-blue-500" />
              {user?.role || "Agent"}
            </span>
          </div>

          <button
            className="flex items-center justify-center h-8 w-8 ml-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            onClick={handleLogout}
            title="Log out of account"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;