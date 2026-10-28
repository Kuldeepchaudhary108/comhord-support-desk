const priorityConfig = {
  low: {
    label: "Low",
    className:
      "bg-slate-50 text-slate-600 border-slate-200"
  },

  medium: {
    label: "Medium",
    className:
      "bg-blue-50 text-blue-600 border-blue-200"
  },

  high: {
    label: "High",
    className:
      "bg-orange-50 text-orange-600 border-orange-200"
  },

  urgent: {
    label: "Urgent",
    className:
      "bg-red-50 text-red-600 border-red-200"
  }
};

export default function PriorityBadge({
  priority
}) {
  const config =
    priorityConfig[priority] ||
    priorityConfig.medium;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}