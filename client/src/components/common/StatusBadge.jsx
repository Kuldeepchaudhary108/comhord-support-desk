const statusConfig = {
  open: {
    label: "Open",
    className:
      "bg-blue-50 text-blue-700 border-blue-200"
  },

  "in-progress": {
    label: "In Progress",
    className:
      "bg-amber-50 text-amber-700 border-amber-200"
  },

  waiting: {
    label: "Waiting",
    className:
      "bg-purple-50 text-purple-700 border-purple-200"
  },

  resolved: {
    label: "Resolved",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200"
  }
};

export default function StatusBadge({ status }) {
  const config =
    statusConfig[status] ||
    statusConfig.open;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}