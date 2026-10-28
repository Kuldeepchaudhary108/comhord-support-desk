import { useState } from "react";
import { useDispatch } from "react-redux";
import { Send, Lock, MessageSquare } from "lucide-react";
import { addReply } from "../../features/tickets/ticketSlice.js";

const ReplyBox = ({ ticketId }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [type, setType] = useState("public");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    const result = await dispatch(
      addReply({
        id: ticketId,
        content,
        type,
      })
    );

    setLoading(false);

    if (addReply.fulfilled.match(result)) {
      setContent("");
    } else {
      setError(result.payload || "Failed to submit response.");
    }
  };

  return (
    <form
      className={`rounded-2xl border p-5 transition-all shadow-xs ${
        type === "internal"
          ? "border-amber-200 bg-amber-50/30"
          : "border-slate-200/80 bg-white"
      }`}
      onSubmit={submit}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            {type === "internal" ? "Internal Team Note" : "Respond to Customer"}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {type === "internal"
              ? "Only visible to staff agents; not shown to customer."
              : "Will be visible to customer and recorded in ticket history."}
          </p>
        </div>

        {/* Professional Segmented Toggle instead of ugly misaligned select */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setType("public")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              type === "public"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <MessageSquare size={13} />
            <span>Public Reply</span>
          </button>

          <button
            type="button"
            onClick={() => setType("internal")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              type === "internal"
                ? "bg-amber-100 text-amber-900 shadow-xs border border-amber-200"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Lock size={13} />
            <span>Internal Note</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            type === "internal"
              ? "Add an internal note or context for other support agents..."
              : "Type your public customer response here..."
          }
          className={`w-full rounded-xl border p-3.5 text-sm outline-none transition focus:ring-2 resize-y min-h-[110px] ${
            type === "internal"
              ? "border-amber-200 bg-amber-50/20 focus:border-amber-400 focus:ring-amber-100 placeholder:text-amber-400/80"
              : "border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-100 placeholder:text-slate-400"
          }`}
          required
        />

        {error && (
          <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-400">
            {content.trim().length} characters
          </span>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-lg transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed ${
              type === "internal"
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <Send size={14} className={loading ? "animate-spin" : ""} />
            <span>
              {loading
                ? "Sending..."
                : type === "internal"
                ? "Post Internal Note"
                : "Send Customer Reply"}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReplyBox;