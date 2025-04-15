import Link from "next/link";
import { TicketDetails } from "../types";

interface SubticketsTabProps {
  ticket: TicketDetails;
}

export default function SubticketsTab({ ticket }: SubticketsTabProps) {
  const hasSubtickets = ticket.subTickets && ticket.subTickets.length > 0;

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Subtickets</h3>
        <Link
          href={`/tickets/create?parentId=${ticket.id}`}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Subticket
        </Link>
      </div>

      {hasSubtickets ? (
        <div className="mt-4">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {ticket.subTickets.map((subticket, index) => (
              <li key={subticket.id} className="py-3 list-none">
                <Link 
                  href={`/tickets/${subticket.id}`}
                  className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded"
                >
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs font-medium mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">{subticket.title}</span>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${subticket.status === 'Todo' && 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}
                    ${subticket.status === 'InProgress' && 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}
                    ${subticket.status === 'Done' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}
                  `}>
                    {subticket.status}
                  </span>
                </Link>
              </li>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No subtickets found for this ticket.</p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Create a subticket to break down this task.</p>
        </div>
      )}
    </div>
  );
}
