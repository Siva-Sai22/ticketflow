import { TicketDetails } from "../types";

interface Props {
  ticket: TicketDetails;
}

export default function DetailsTab({ ticket }: Props) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        Ticket Details
      </h2>

      {/* Basic information grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Status
          </h3>
          <p className="mt-1 text-gray-900 dark:text-white">
            {ticket.status}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Priority
          </h3>
          <p className="mt-1 text-gray-900 dark:text-white">
            {ticket.priority}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Created
          </h3>
          <p className="mt-1 text-gray-900 dark:text-white">
            {new Date(ticket.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Due Date
          </h3>
          <p className="mt-1 text-gray-900 dark:text-white">
            {new Date(ticket.dueDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Assigned departments */}
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Assigned Departments
        </h3>
        {ticket.assignedDepartments.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {ticket.assignedDepartments.map((dept) => (
              <span
                key={dept.id}
                className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-800"
              >
                {dept.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No departments assigned
          </p>
        )}
      </div>

      {/* Assigned developers */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Assigned Developers
        </h3>
        {ticket.assignedTo.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {ticket.assignedTo.map((dev) => (
              <span
                key={dev.id}
                className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-700/10 ring-inset dark:bg-green-900/30 dark:text-green-400 dark:ring-green-800"
              >
                {dev.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No developers assigned
          </p>
        )}
      </div>
    </div>
  );
}
