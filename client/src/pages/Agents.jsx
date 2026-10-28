import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserPlus, Users, Shield, Mail, Lock, User, CheckCircle2, AlertCircle } from "lucide-react";
import { createAgent, fetchAgents } from "../features/agents/agentSlice.js";

const Agents = () => {
  const dispatch = useDispatch();
  const { items = [], loading, error } = useSelector((state) => state.agents);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "agent",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    dispatch(fetchAgents());
  }, [dispatch]);

  const submit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setCreating(true);

    const result = await dispatch(createAgent(form));
    setCreating(false);

    if (createAgent.fulfilled.match(result)) {
      setSuccessMsg(`Agent ${form.name} created successfully!`);
      setForm({
        name: "",
        email: "",
        password: "",
        role: "agent",
      });
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Support Staff & Agents
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Add and manage team members who have access to handle and resolve tickets.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Form: Create Agent (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <UserPlus size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Add New Agent</h2>
              <p className="text-xs text-slate-400">Provision support team credentials</p>
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
              <CheckCircle2 size={15} className="flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={submit} className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full h-10 px-3.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="e.g. alex@company.com"
                className="w-full h-10 px-3.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder:text-slate-400"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 6 characters"
                minLength={6}
                className="w-full h-10 px-3.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder:text-slate-400"
                required
              />
              <p className="text-[11px] text-slate-400">Must be at least 6 characters long.</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Role
              </label>
              <div className="relative w-full">
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full h-10 px-3.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition cursor-pointer appearance-none pr-8 shadow-xs"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.75rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.15em 1.15em"
                  }}
                >
                  <option value="agent">Support Agent</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 h-10 px-4 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
            >
              <UserPlus size={15} />
              <span>{creating ? "Creating Agent..." : "Create Agent Account"}</span>
            </button>
          </form>
        </div>

        {/* Right List: Active Agents (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Users size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Active Staff Members</h2>
                <p className="text-xs text-slate-400">Total {items.length} registered staff</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Loading agent list...
              </div>
            ) : items.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No agents registered yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {items.map((agent) => (
                  <div
                    key={agent._id}
                    className="flex items-center justify-between py-3.5 hover:bg-slate-50/60 px-2 rounded-xl transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-xs shadow-xs">
                        {agent.name ? agent.name.charAt(0).toUpperCase() : <User size={14} />}
                      </div>

                      <div>
                        <strong className="block text-xs font-semibold text-slate-800">
                          {agent.name}
                        </strong>
                        <span className="block text-[11px] text-slate-400">
                          {agent.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize border ${
                          agent.role === "admin"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        <Shield size={11} />
                        {agent.role || "Agent"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agents;