import { useState } from "react";
import { Send } from "lucide-react";

import { addReply } from "../../services/ticket.service";

export default function ReplyComposer({
  ticketId,
  onSuccess
}) {
  const [content, setContent] =
    useState("");

  const [isInternal, setIsInternal] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!content.trim()) {
      setError("Please write a message.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await addReply(ticketId, {
        content,
        isInternal
      });

      setContent("");

      onSuccess();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add reply."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Add Response
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Send a public reply or add an internal note.
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600">
          <input
            type="checkbox"
            checked={isInternal}
            onChange={(event) =>
              setIsInternal(
                event.target.checked
              )
            }
            className="h-4 w-4 rounded border-slate-300 text-blue-600"
          />

          Internal note
        </label>
      </div>

      <textarea
        value={content}
        onChange={(event) =>
          setContent(event.target.value)
        }
        rows={5}
        placeholder={
          isInternal
            ? "Write an internal note..."
            : "Write a response to the customer..."
        }
        className={`w-full resize-none rounded-lg border p-3 text-sm outline-none focus:ring-2 ${
          isInternal
            ? "border-amber-200 bg-amber-50/30 focus:border-amber-400 focus:ring-amber-100"
            : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
        }`}
      />

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={16} />

          {loading
            ? "Sending..."
            : isInternal
            ? "Add Note"
            : "Send Reply"}
        </button>
      </div>
    </form>
  );
}