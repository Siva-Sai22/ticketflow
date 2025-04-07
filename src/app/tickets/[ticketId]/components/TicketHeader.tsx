import { FaEdit } from "react-icons/fa";
import { TicketDetails, getStatusColor, getPriorityColor } from "./types";

interface Props {
  ticket: TicketDetails;
}

export default function TicketHeader({ ticket }: Props) {
  return (
    <div className="mb-4 flex items-start justify-between">
      <div>
        <div className="mb-2 flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {ticket.title}
          </h1>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(ticket.status)}`}
          >
            {ticket.status}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(ticket.priority)}`}
          >
            {ticket.priority}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ID: {ticket.id} • Created:{" "}
          {new Date(ticket.createdAt).toLocaleDateString()} • Due:{" "}
          {new Date(ticket.dueDate).toLocaleDateString()}
        </p>
      </div>
      <div>
        <button className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <FaEdit className="mr-2" /> Edit Ticket
        </button>
      </div>
    </div>
  );
}
