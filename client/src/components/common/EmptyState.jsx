import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "No tickets found",
  description = "There are no tickets matching your current filters."
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-slate-100 p-4">
        <Inbox
          size={28}
          className="text-slate-400"
        />
      </div>

      <h3 className="text-lg font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-1 max-w-md text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}