import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Clock, User, ChevronLeft, ChevronRight, Inbox, ArrowRight } from "lucide-react";
import { fetchTickets } from "../features/tickets/ticketSlice.js";
import TicketFilters from "../components/tickets/TicketFilters.jsx";

const Tickets = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { items = [], pagination = { totalPages: 1, total: 0 }, loading } = useSelector(
    (state) => state.tickets
  );

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "",
    priority: searchParams.get("priority") || "",
    sort: searchParams.get("sort") || "updatedAt",
    page: 1,
    limit: 10,
  });

  // Sync if URL query parameters change (e.g. from Dashboard quick link)
  useEffect(() => {
    const statusParam = searchParams.get("status");
    const priorityParam = searchParams.get("priority");
    if (statusParam !== null || priorityParam !== null) {
      setFilters((prev) => ({
        ...prev,
        status: statusParam || "",
        priority: priorityParam || "",
        page: 1,
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchTickets(filters));
    }, 250);

    return () => clearTimeout(timer);
  }, [dispatch, filters]);

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Support Tickets
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Search, filter and manage customer support requests across all channels.
          </p>
        </div>

        <Link
          to="/tickets/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Ticket</span>
        </Link>
      </div>

      {/* Filter Toolbar with perfectly aligned dropdowns */}
      <TicketFilters filters={filters} setFilters={setFilters} />

      {/* Modern Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Ticket</th>
                <th className="py-3.5 px-6 font-semibold">Customer</th>
                <th className="py-3.5 px-6 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold">Priority</th>
                <th className="py-3.5 px-6 font-semibold">Assigned Agent</th>
                <th className="py-3.5 px-6 font-semibold">Last Updated</th>
                <th className="py-3.5 px-6 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-normal">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                      <span className="text-xs font-medium text-slate-500 mt-2">Loading tickets...</span>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <Inbox size={32} className="mb-2 text-slate-300" />
                      <p className="text-sm font-semibold text-slate-700">No tickets matching your filters</p>
                      <p className="text-xs text-slate-400 mt-1">Try clearing your search terms or filters above.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((ticket) => (
                  <tr
                    key={ticket._id}
                    onClick={() => navigate(`/tickets/${ticket._id}`)}
                    className="hover:bg-slate-50/80 transition cursor-pointer group"
                  >
                    {/* Ticket Subject */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/tickets/${ticket._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition"
                        >
                          {ticket.subject}
                        </Link>

                        {ticket.isOverdue && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <Clock size={11} /> Overdue
                          </span>
                        )}
                      </div>

                      <span className="mt-0.5 block text-xs font-mono text-slate-400">
                        {ticket.ticketNumber || (ticket._id ? `#${ticket._id.slice(-6)}` : "------")}
                      </span>
                    </td>

                    {/* Customer Info */}
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-slate-800">
                        {ticket.customerName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {ticket.customerEmail}
                      </p>
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${
                          ticket.status === "open"
                            ? "bg-sky-50 text-sky-700 border-sky-200"
                            : ticket.status === "in-progress"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : ticket.status === "resolved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            ticket.status === "open"
                              ? "bg-sky-500"
                              : ticket.status === "in-progress"
                              ? "bg-amber-500"
                              : ticket.status === "resolved"
                              ? "bg-emerald-500"
                              : "bg-purple-500"
                          }`}
                        />
                        {ticket.status ? ticket.status.replace(/-/g, " ") : "Open"}
                      </span>
                    </td>

                    {/* Priority Pill */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${
                          ticket.priority === "urgent"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : ticket.priority === "high"
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : ticket.priority === "medium"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {ticket.priority || "Medium"}
                      </span>
                    </td>

                    {/* Assigned Agent */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 border border-slate-200">
                          {ticket.assignedTo?.name ? (
                            ticket.assignedTo.name.charAt(0).toUpperCase()
                          ) : ticket.assignedAgentName ? (
                            ticket.assignedAgentName.charAt(0).toUpperCase()
                          ) : (
                            <User size={12} className="text-slate-400" />
                          )}
                        </div>

                        <span className="text-xs font-medium text-slate-700">
                          {ticket.assignedTo?.name || ticket.assignedAgentName || "Unassigned"}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-xs text-slate-400">
                      {new Date(ticket.updatedAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* View Action Link */}
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/tickets/${ticket._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 group-hover:translate-x-0.5 transition"
                      >
                        <span>Details</span>
                        <ArrowRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {(pagination?.totalPages > 1 || pagination?.total > 10) && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/50">
            <span className="text-xs text-slate-500">
              Showing page <strong className="text-slate-800">{filters.page}</strong> of{" "}
              <strong className="text-slate-800">{pagination.totalPages || 1}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={filters.page <= 1}
                onClick={(e) => {
                  e.stopPropagation();
                  setFilters({
                    ...filters,
                    page: Math.max(1, filters.page - 1),
                  });
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
              >
                <ChevronLeft size={14} /> Previous
              </button>

              <button
                type="button"
                disabled={filters.page >= (pagination.totalPages || 1)}
                onClick={(e) => {
                  e.stopPropagation();
                  setFilters({
                    ...filters,
                    page: filters.page + 1,
                  });
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;
