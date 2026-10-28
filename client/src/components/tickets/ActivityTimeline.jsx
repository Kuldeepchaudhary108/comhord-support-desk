import { Clock, User } from "lucide-react";

const ActivityTimeline = ({ activities = [] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-slate-400">
        No activity history recorded yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {activities
        .slice()
        .reverse()
        .map((activity, index) => {
          const title =
            activity.message ||
            activity.description ||
            (activity.action ? `Ticket ${activity.action.replace(/_/g, " ")}` : "Activity recorded");

          const actor =
            activity.performedBy?.name ||
            activity.actorName ||
            "System";

          const timestamp = activity.createdAt
            ? new Date(activity.createdAt).toLocaleString([], {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Recently";

          return (
            <div className="relative group" key={activity._id || index}>
              {/* Dot */}
              <div className="absolute -left-6 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-blue-500 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>

              <div className="space-y-0.5">
                <strong className="block text-xs font-semibold text-slate-800 leading-snug">
                  {title}
                </strong>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="font-medium text-slate-600 flex items-center gap-1">
                    <User size={11} className="text-slate-400" />
                    {actor}
                  </span>
                  <span>·</span>
                  <span>{timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ActivityTimeline;