import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";

const TicketFilters = ({ filters, setFilters }) => {
  const update = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
      page: 1,
    });
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.status ||
    filters.priority ||
    filters.sort !== "updatedAt"
  );

  const resetFilters = () => {
    setFilters({
      ...filters,
      search: "",
      status: "",
      priority: "",
      sort: "updatedAt",
      page: 1,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search input with leading icon and clear button */}
        <div className="relative flex-1 min-w-[220px]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search size={16} />
          </div>

          <input
            type="text"
            className="w-full h-10 pl-9 pr-8 text-sm text-slate-900 bg-slate-50/50 border border-slate-200 rounded-lg placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
            placeholder="Search by subject, customer name or email..."
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
          />

          {filters.search && (
            <button
              type="button"
              onClick={() => update("search", "")}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 transition"
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Dropdowns group with fixed widths and aligned height */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Dropdown */}
          <div className="relative w-full sm:w-44 flex-shrink-0">
            <select
              value={filters.status}
              onChange={(e) => update("status", e.target.value)}
              className="w-full h-10 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition cursor-pointer appearance-none pr-8 shadow-sm"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.65rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.15em 1.15em"
              }}
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="waiting-on-customer">Waiting on Customer</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Priority Dropdown */}
          <div className="relative w-full sm:w-40 flex-shrink-0">
            <select
              value={filters.priority}
              onChange={(e) => update("priority", e.target.value)}
              className="w-full h-10 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition cursor-pointer appearance-none pr-8 shadow-sm"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.65rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.15em 1.15em"
              }}
            >
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative w-full sm:w-44 flex-shrink-0">
            <select
              value={filters.sort}
              onChange={(e) => update("sort", e.target.value)}
              className="w-full h-10 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition cursor-pointer appearance-none pr-8 shadow-sm"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.65rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.15em 1.15em"
              }}
            >
              <option value="updatedAt">Recently Updated</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 h-10 px-3 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition shadow-sm"
              title="Reset all filters"
            >
              <X size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketFilters;
