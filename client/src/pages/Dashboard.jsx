import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Ticket,
  CircleDot,
  LoaderCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Plus,
  ArrowRight,
  User,
  Inbox
} from "lucide-react";
import { getDashboardStats } from "../services/dashboard.service";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const loadData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const res = await getDashboardStats();
      const resolvedStats = res?.stats || res;
      setStats(resolvedStats);
      if (res?.recentTickets) {
        setRecentTickets(res.recentTickets);
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching dashboard statistics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Auto-refresh stats every 20 seconds so dashboard stays accurate in real-time
    const interval = setInterval(() => {
      loadData(true);
    }, 20000);

    const onFocus = () => loadData(true);
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [loadData]);

  const cards = [
    {
      label: "Total Tickets",
      key: "totalTickets",
      fallbackKey: "total",
      icon: Ticket,
      filter: "",
      accent: {
        bg: "bg-blue-50/70",
        iconBg: "bg-blue-600 text-white",
        text: "text-blue-700",
        border: "hover:border-blue-300"
      }
    },
    {
      label: "Open Tickets",
      key: "openTickets",
      fallbackKey: "open",
      icon: CircleDot,
      filter: "open",
      accent: {
        bg: "bg-sky-50/70",
        iconBg: "bg-sky-500 text-white",
        text: "text-sky-700",
        border: "hover:border-sky-300"
      }
    },
    {
      label: "In Progress",
      key: "inProgressTickets",
      fallbackKey: "inProgress",
      icon: LoaderCircle,
      filter: "in-progress",
      accent: {
        bg: "bg-amber-50/70",
        iconBg: "bg-amber-500 text-white",
        text: "text-amber-700",
        border: "hover:border-amber-300"
      }
    },
    {
      label: "Resolved",
      key: "resolvedTickets",
      fallbackKey: "resolved",
      icon: CheckCircle2,
      filter: "resolved",
      accent: {
        bg: "bg-emerald-50/70",
        iconBg: "bg-emerald-600 text-white",
        text: "text-emerald-700",
        border: "hover:border-emerald-300"
      }
    },
    {
      label: "Urgent",
      key: "urgentTickets",
      fallbackKey: "urgent",
      icon: AlertTriangle,
      filterPriority: "urgent",
      accent: {
        bg: "bg-rose-50/70",
        iconBg: "bg-rose-600 text-white",
        text: "text-rose-700",
        border: "hover:border-rose-300"
      }
    },
    {
      label: "Overdue",
      key: "overdueTickets",
      fallbackKey: "overdue",
      icon: Clock,
      isOverdue: true,
      accent: {
        bg: "bg-purple-50/70",
        iconBg: "bg-purple-600 text-white",
        text: "text-purple-700",
        border: "hover:border-purple-300"
      }
    }
  ];

  const totalCount = stats?.totalTickets ?? stats?.total ?? 0;
  const openCount = stats?.openTickets ?? stats?.open ?? 0;
  const inProgressCount = stats?.inProgressTickets ?? stats?.inProgress ?? 0;
  const waitingCount =
    stats?.waitingTickets ?? stats?.waitingOnCustomer ?? stats?.waiting ?? 0;
  const resolvedCount = stats?.resolvedTickets ?? stats?.resolved ?? 0;
  const urgentCount = stats?.urgentTickets ?? stats?.urgent ?? 0;
  const overdueCount = stats?.overdueTickets ?? stats?.overdue ?? 0;

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Workspace
            </span>
            <span className="text-xs text-slate-400">
              Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Support Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Real-time tracking of active customer tickets, team capacity, and service health.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition shadow-sm disabled:opacity-50"
            title="Refresh dashboard data"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin text-blue-600" : "text-slate-400"} />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>

          <Link
            to="/tickets/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={16} />
            <span>New Ticket</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-8">
          <LoaderCircle className="animate-spin text-blue-600" size={36} />
          <p className="text-sm font-medium text-slate-500">Loading metrics and statistics...</p>
        </div>
      ) : (
        <>
          {/* Top 6 KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;
              const val = stats?.[card.key] ?? stats?.[card.fallbackKey] ?? 0;

              return (
                <div
                  key={card.key}
                  onClick={() => {
                    if (card.filterPriority) {
                      navigate(`/tickets?priority=${card.filterPriority}`);
                    } else if (card.filter) {
                      navigate(`/tickets?status=${card.filter}`);
                    } else {
                      navigate("/tickets");
                    }
                  }}
                  className={`group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${card.accent.border}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {card.label}
                      </p>

                      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        {val}
                      </p>
                    </div>

                    <div className={`rounded-xl p-3 shadow-inner ${card.accent.iconBg}`}>
                      <Icon size={20} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <span className="text-slate-400 group-hover:text-slate-600 transition">
                      View tickets
                    </span>
                    <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-0.5 group-hover:text-blue-600 transition" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Middle Two Grid Sections: Status & Attention Required */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Status Breakdown (7 cols) */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Ticket Status Breakdown
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Distribution of all {totalCount} tickets currently in the system
                  </p>
                </div>

                <Link
                  to="/tickets"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  All tickets <ArrowRight size={13} />
                </Link>
              </div>

              <div className="mt-6 space-y-5">
                <StatusRow
                  label="Open"
                  badgeClass="bg-sky-50 text-sky-700 border-sky-200"
                  colorClass="bg-sky-500"
                  value={openCount}
                  total={totalCount}
                />

                <StatusRow
                  label="In Progress"
                  badgeClass="bg-amber-50 text-amber-700 border-amber-200"
                  colorClass="bg-amber-500"
                  value={inProgressCount}
                  total={totalCount}
                />

                <StatusRow
                  label="Waiting on Customer"
                  badgeClass="bg-purple-50 text-purple-700 border-purple-200"
                  colorClass="bg-purple-500"
                  value={waitingCount}
                  total={totalCount}
                />

                <StatusRow
                  label="Resolved"
                  badgeClass="bg-emerald-50 text-emerald-700 border-emerald-200"
                  colorClass="bg-emerald-500"
                  value={resolvedCount}
                  total={totalCount}
                />
              </div>
            </div>

            {/* Action Center / Attention Required (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">
                  Attention Required
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Items demanding immediate resolution or escalation
                </p>
              </div>

              <div className="my-5 grid gap-4">
                {/* Urgent Banner */}
                <div
                  onClick={() => navigate("/tickets?priority=urgent")}
                  className="group flex items-center justify-between p-4 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-200 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-rose-800 uppercase tracking-wide">
                        Urgent Priority
                      </p>
                      <p className="text-xs text-rose-600">
                        Critical customer issues
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-rose-700">
                      {urgentCount}
                    </span>
                    <ArrowRight size={14} className="ml-auto text-rose-400 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>

                {/* Overdue Banner */}
                <div
                  onClick={() => navigate("/tickets")}
                  className="group flex items-center justify-between p-4 rounded-xl border border-amber-100 bg-amber-50/50 hover:bg-amber-50 hover:border-amber-200 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
                        Overdue Tickets
                      </p>
                      <p className="text-xs text-amber-600">
                        Past 24-hour target SLA
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-amber-700">
                      {overdueCount}
                    </span>
                    <ArrowRight size={14} className="ml-auto text-amber-400 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Total Active Issues:</span>
                <strong className="text-slate-800 font-bold">{openCount + inProgressCount + waitingCount} tickets</strong>
              </div>
            </div>
          </div>

          {/* Recent Tickets Activity Section */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Recent Tickets
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Latest customer issues and recent status updates
                </p>
              </div>

              <Link
                to="/tickets"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View all tickets <ArrowRight size={14} />
              </Link>
            </div>

            {recentTickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                <Inbox size={32} className="mb-2 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">No tickets found</p>
                <p className="text-xs text-slate-400 mt-1">Get started by creating your first support ticket.</p>
                <Link
                  to="/tickets/new"
                  className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition"
                >
                  <Plus size={14} />
                  Create Ticket
                </Link>
              </div>
            ) : (
              <div className="mt-4 divide-y divide-slate-100 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-3 font-semibold">Ticket Subject</th>
                      <th className="py-3 px-3 font-semibold">Customer</th>
                      <th className="py-3 px-3 font-semibold">Status</th>
                      <th className="py-3 px-3 font-semibold">Priority</th>
                      <th className="py-3 px-3 font-semibold">Assigned</th>
                      <th className="py-3 px-3 font-semibold text-right">Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-normal">
                    {recentTickets.map((ticket) => (
                      <tr
                        key={ticket._id}
                        onClick={() => navigate(`/tickets/${ticket._id}`)}
                        className="group hover:bg-slate-50/80 cursor-pointer transition"
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/tickets/${ticket._id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="font-semibold text-slate-900 group-hover:text-blue-600 transition"
                            >
                              {ticket.subject}
                            </Link>
                            <span className="text-[11px] font-mono text-slate-400">
                              {ticket.ticketNumber || (ticket._id ? `#${ticket._id.slice(-5)}` : "")}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-slate-600 text-xs">
                          {ticket.customerName}
                        </td>

                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            ticket.status === "open"
                              ? "bg-sky-50 text-sky-700 border border-sky-200"
                              : ticket.status === "in-progress"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : ticket.status === "resolved"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-purple-50 text-purple-700 border border-purple-200"
                          }`}>
                            {ticket.status ? ticket.status.replace(/-/g, " ") : "Open"}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            ticket.priority === "urgent"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : ticket.priority === "high"
                              ? "bg-orange-50 text-orange-700 border border-orange-200"
                              : ticket.priority === "medium"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}>
                            {ticket.priority || "Medium"}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-xs text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
                              {ticket.assignedTo?.name ? (
                                ticket.assignedTo.name.charAt(0).toUpperCase()
                              ) : ticket.assignedAgentName ? (
                                ticket.assignedAgentName.charAt(0).toUpperCase()
                              ) : (
                                <User size={10} />
                              )}
                            </div>
                            <span>{ticket.assignedTo?.name || ticket.assignedAgentName || "Unassigned"}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-right text-xs text-slate-400">
                          {new Date(ticket.updatedAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric"
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatusRow({ label, badgeClass, colorClass, value, total }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">{label}</span>
          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badgeClass}`}>
            {value}
          </span>
        </div>

        <span className="font-medium text-slate-400">
          {percentage}%
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}