import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Clock,
  User,
  Shield,
  Calendar,
  Mail,
  AlertCircle,
  CheckCircle,
  LoaderCircle,
  Tag
} from "lucide-react";
import {
  fetchTicket,
  updateTicket,
  assignTicket,
  clearCurrentTicket,
} from "../features/tickets/ticketSlice.js";
import { fetchAgents } from "../features/agents/agentSlice.js";
import ReplyBox from "../components/tickets/ReplyBox.jsx";
import ActivityTimeline from "../components/tickets/ActivityTimeline.jsx";

const TicketDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentTicket, detailsLoading, error } = useSelector(
    (state) => state.tickets
  );

  const agents = useSelector((state) => state.agents.items || []);
  const user = useSelector((state) => state.auth.user);

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [agentId, setAgentId] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchTicket(id));
    dispatch(fetchAgents());
    return () => {
      dispatch(clearCurrentTicket());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentTicket) {
      setStatus(currentTicket.status || "open");
      setPriority(currentTicket.priority || "medium");
      const assignedId =
        (typeof currentTicket.assignedTo === "object"
          ? currentTicket.assignedTo?._id
          : currentTicket.assignedTo) ||
        currentTicket.assignedAgent ||
        "";
      setAgentId(assignedId);
    }
  }, [currentTicket]);

  if (detailsLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <LoaderCircle className="animate-spin text-blue-600" size={36} />
        <p className="text-sm font-medium text-slate-500">Loading ticket details...</p>
      </div>
    );
  }

  if (error || !currentTicket) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center px-4">
        <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
          <AlertCircle size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            {error || "Ticket not found"}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            The requested ticket #{id ? id.slice(-6) : ""} could not be loaded or may have been removed.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(fetchTicket(id))}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
          <Link
            to="/tickets"
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
          >
            Back to all tickets
          </Link>
        </div>
      </div>
    );
  }

  const changeStatus = async (value) => {
    setStatus(value);
    setUpdating(true);
    await dispatch(
      updateTicket({
        id,
        data: { status: value },
      })
    );
    setUpdating(false);
  };

  const changePriority = async (value) => {
    setPriority(value);
    setUpdating(true);
    await dispatch(
      updateTicket({
        id,
        data: { priority: value },
      })
    );
    setUpdating(false);
  };

  const changeAgent = async (value) => {
    setAgentId(value);
    if (!value) return;
    setUpdating(true);
    await dispatch(
      assignTicket({
        id,
        agentId: value,
      })
    );
    setUpdating(false);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/tickets"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft size={14} /> Back to all tickets
        </Link>
      </div>

      {/* Main 2-column layout */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column (8 cols): Ticket content, responses, timeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Ticket Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    #{currentTicket._id ? currentTicket._id.slice(-6) : id.slice(-6)}
                  </span>

                  {currentTicket.isOverdue && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      <Clock size={12} /> Overdue
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {currentTicket.subject}
                </h1>
              </div>

              {/* Status and Priority Badges */}
              <div className="flex items-center gap-2 self-start">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize border ${
                    currentTicket.status === "open"
                      ? "bg-sky-50 text-sky-700 border-sky-200"
                      : currentTicket.status === "in-progress"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : currentTicket.status === "resolved"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-purple-50 text-purple-700 border-purple-200"
                  }`}
                >
                  {currentTicket.status?.replace(/-/g, " ")}
                </span>

                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${
                    currentTicket.priority === "urgent"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : currentTicket.priority === "high"
                      ? "bg-orange-50 text-orange-700 border-orange-200"
                      : currentTicket.priority === "medium"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  {currentTicket.priority}
                </span>
              </div>
            </div>

            {/* Customer Details Strip */}
            <div className="grid sm:grid-cols-2 gap-4 py-4 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold">
                  {currentTicket.customerName ? currentTicket.customerName.charAt(0).toUpperCase() : <User size={16} />}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Customer</span>
                  <strong className="text-sm font-semibold text-slate-800">{currentTicket.customerName}</strong>
                  <span className="block text-slate-400">{currentTicket.customerEmail}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <Calendar size={16} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Created On</span>
                  <strong className="text-sm font-semibold text-slate-800">
                    {new Date(currentTicket.createdAt).toLocaleDateString([], {
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </strong>
                  <span className="block text-slate-400">
                    {new Date(currentTicket.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            </div>

            {/* Ticket Description */}
            <div className="pt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Issue Description
              </h3>
              <div className="prose prose-slate max-w-none text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                {currentTicket.description}
              </div>
            </div>
          </div>

          {/* Conversation History / Replies */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Conversation History ({currentTicket.replies?.length || 0})
              </h2>
            </div>

            <div className="space-y-4">
              {currentTicket.replies?.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No responses recorded yet. Be the first to reply below.
                </div>
              ) : (
                currentTicket.replies.map((reply) => {
                  const isInternal = reply.type === "internal";
                  return (
                    <div
                      key={reply._id}
                      className={`p-4 rounded-xl border transition-all ${
                        isInternal
                          ? "bg-amber-50/40 border-amber-200"
                          : "bg-slate-50/70 border-slate-200/70"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-2 pb-2 border-b border-slate-200/40">
                        <div className="flex items-center gap-2">
                          <strong className="font-semibold text-slate-800">
                            {reply.author?.name || "Support Staff"}
                          </strong>

                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isInternal
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-blue-100 text-blue-800 border border-blue-200"
                            }`}
                          >
                            {isInternal ? "Internal Note" : "Public Reply"}
                          </span>
                        </div>

                        <span className="text-[11px] text-slate-400">
                          {new Date(reply.createdAt).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>

                      <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Reply Composer */}
            <div className="pt-2">
              <ReplyBox ticketId={id} />
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 pb-4 border-b border-slate-100 mb-4">
              Audit & Activity Timeline
            </h2>
            <ActivityTimeline activities={currentTicket.activityHistory || []} />
          </div>
        </div>

        {/* Right Column (4 cols): Sticky Ticket Controls with Fixed-Alignment Dropdowns */}
        <aside className="lg:col-span-4 sticky top-20 space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Ticket Controls
              </h3>
              {updating && (
                <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-medium">
                  <LoaderCircle size={12} className="animate-spin" /> Saving...
                </span>
              )}
            </div>

            {/* Status Dropdown with Fixed Alignment */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Status
              </label>

              <div className="relative w-full">
                <select
                  value={status}
                  onChange={(e) => changeStatus(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition cursor-pointer appearance-none pr-8 shadow-xs"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.65rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.15em 1.15em"
                  }}
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="waiting-on-customer">Waiting on Customer</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* Priority Dropdown with Fixed Alignment */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Priority
              </label>

              <div className="relative w-full">
                <select
                  value={priority}
                  onChange={(e) => changePriority(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition cursor-pointer appearance-none pr-8 shadow-xs"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.65rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.15em 1.15em"
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Assign Agent Dropdown (for admins) */}
            {user?.role === "admin" && (
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Assign Agent
                </label>

                <div className="relative w-full">
                  <select
                    value={agentId}
                    onChange={(e) => changeAgent(e.target.value)}
                    className="w-full h-10 px-3 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition cursor-pointer appearance-none pr-8 shadow-xs"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 0.65rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.15em 1.15em"
                    }}
                  >
                    <option value="">Unassigned</option>
                    {agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name} ({agent.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Currently Assigned Display Card */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                {currentTicket.assignedTo?.name ? (
                  currentTicket.assignedTo.name.charAt(0).toUpperCase()
                ) : currentTicket.assignedAgentName ? (
                  currentTicket.assignedAgentName.charAt(0).toUpperCase()
                ) : (
                  <User size={16} />
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Current Assignee
                </span>
                <strong className="text-xs font-bold text-slate-800 block">
                  {currentTicket.assignedTo?.name || currentTicket.assignedAgentName || "Unassigned"}
                </strong>
                <span className="text-[11px] text-slate-400">
                  {currentTicket.assignedTo?.email || (currentTicket.assignedAgentName ? "Staff Agent" : "No agent assigned yet")}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TicketDetails;