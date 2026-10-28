import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ArrowLeft, PlusCircle, AlertCircle, Send } from "lucide-react";
import { createTicket } from "../features/tickets/ticketSlice.js";

const CreateTicket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subject: "",
    customerName: "",
    customerEmail: "",
    description: "",
    priority: "medium",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await dispatch(createTicket(form));
    setLoading(false);

    if (createTicket.fulfilled.match(result)) {
      navigate(`/tickets/${result.payload._id}`);
    } else {
      setError(result.payload || "Unable to create ticket");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/tickets"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft size={14} /> Back to all tickets
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        {/* Header */}
        <div className="pb-6 border-b border-slate-100">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Create New Support Ticket
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Enter the customer's details and description of the request or problem.
          </p>
        </div>

        {error && (
          <div className="mt-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
            <AlertCircle size={16} className="text-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-5">
          {/* Subject (Full Width) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Ticket Subject <span className="text-rose-500">*</span>
            </label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="e.g. Cannot access dashboard billing page"
              className="w-full h-10 px-3.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder:text-slate-400"
              required
            />
          </div>

          {/* Customer Name & Email (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Customer Name <span className="text-rose-500">*</span>
              </label>
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="e.g. Sarah Jenkins"
                className="w-full h-10 px-3.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder:text-slate-400"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Customer Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="customerEmail"
                value={form.customerEmail}
                onChange={handleChange}
                placeholder="e.g. sarah@company.com"
                className="w-full h-10 px-3.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          {/* Priority Select with Clean Alignment */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Priority Level
            </label>
            <div className="relative w-full sm:w-64">
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full h-10 px-3.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition cursor-pointer appearance-none pr-8 shadow-xs"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.75rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.15em 1.15em"
                }}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent (Immediate attention)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Issue Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              rows="6"
              value={form.description}
              onChange={handleChange}
              placeholder="Provide comprehensive details about the customer inquiry, symptoms, or steps to reproduce..."
              className="w-full p-3.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder:text-slate-400 leading-relaxed"
              required
            />
          </div>

          {/* Action Button */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/tickets"
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
            >
              <Send size={15} />
              <span>{loading ? "Creating Ticket..." : "Create Support Ticket"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;