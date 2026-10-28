import {
  ArrowUpRight,
  Clock
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import StatusBadge from "../common/StatusBadge";
import PriorityBadge from "../common/PriorityBadge";
import EmptyState from "../common/EmptyState";

const formatDate = (date) => {
  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );
};

export default function TicketTable({
  tickets
}) {
  const navigate = useNavigate();

  if (!tickets.length) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ticket
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Customer
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Priority
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Assigned
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Updated
              </th>

              <th />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <tr
                key={ticket._id}
                onClick={() =>
                  navigate(
                    `/tickets/${ticket._id}`
                  )
                }
                className="cursor-pointer transition hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400">
                        {ticket.ticketNumber}
                      </span>

                      {ticket.isOverdue && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-red-600">
                          <Clock size={12} />
                          Overdue
                        </span>
                      )}
                    </div>

                    <p className="mt-1 max-w-xs truncate text-sm font-semibold text-slate-800">
                      {ticket.subject}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-700">
                    {ticket.customerName}
                  </p>

                  <p className="text-xs text-slate-400">
                    {ticket.customerEmail}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <StatusBadge
                    status={ticket.status}
                  />
                </td>

                <td className="px-6 py-4">
                  <PriorityBadge
                    priority={ticket.priority}
                  />
                </td>

                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">
                    {ticket.assignedAgentName ||
                      "Unassigned"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="text-sm text-slate-500">
                    {formatDate(
                      ticket.updatedAt
                    )}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <ArrowUpRight
                    size={17}
                    className="text-slate-400"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}