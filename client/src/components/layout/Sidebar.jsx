import { NavLink } from "react-router-dom";
import { LayoutDashboard, Ticket, Users, Plus, Headphones } from "lucide-react";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const user = useSelector((state) => state.auth.user);

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
      isActive
        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
    }`;

  return (
    <aside className="sidebar fixed left-0 top-0 bottom-0 w-64 bg-slate-950 text-white p-5 flex flex-col justify-between z-40 border-r border-slate-800/80">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 py-1 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20 font-black text-sm tracking-wider">
            SD
          </div>

          <div>
            <strong className="block text-sm font-bold tracking-tight text-white leading-tight">
              Support Desk
            </strong>
            <span className="block text-[11px] text-slate-400 font-medium">
              Customer Operations
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-6">
          <div>
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Workspace
            </span>

            <div className="mt-2 space-y-1">
              <NavLink to="/dashboard" className={navClass}>
                <LayoutDashboard size={17} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink to="/tickets" end className={navClass}>
                <Ticket size={17} />
                <span>Tickets</span>
              </NavLink>

              <NavLink to="/tickets/new" className={navClass}>
                <Plus size={17} />
                <span>New Ticket</span>
              </NavLink>
            </div>
          </div>

          {user?.role === "admin" && (
            <div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Administration
              </span>

              <div className="mt-2 space-y-1">
                <NavLink to="/agents" className={navClass}>
                  <Users size={17} />
                  <span>Support Agents</span>
                </NavLink>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Footer Profile */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 font-bold text-xs border border-blue-500/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : <Headphones size={14} />}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate leading-tight">
              {user?.name || "Support Admin"}
            </p>
            <p className="text-[10px] text-slate-400 capitalize flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              {user?.role || "Admin"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
