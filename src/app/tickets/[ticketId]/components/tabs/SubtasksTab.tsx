import { useState } from "react";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import { TicketDetails, getStatusColor } from "../types";

interface Props {
  ticket: TicketDetails;
  setTicket: React.Dispatch<React.SetStateAction<TicketDetails | null>>;
}

export default function SubtasksTab({ ticket, setTicket }: Props) {
  const [newSubTicket, setNewSubTicket] = useState({
    title: "",
    description: "",
    priority: "Medium" as "Low" | "Medium" | "High",
  });

  const addSubTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubTicket.title) return;

    try {
      // API call to add sub-ticket
      const response = await fetch(`/api/tickets/${ticket?.id}/subtasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSubTicket),
      });

      const newSubTicketData = await response.json();

      // Update local state
      setTicket((prev) =>
        prev
          ? {
              ...prev,
              subTickets: [
                ...prev.subTickets,
                {
                  id: newSubTicketData.id || `st${prev.subTickets.length + 1}`,
                  title: newSubTicket.title,
                  status: "Todo" as const,
                },
              ],
            }
          : null
      );

      // Reset form
      setNewSubTicket({ title: "", description: "", priority: "Medium" });
    } catch (error) {
      console.error("Error adding sub-ticket:", error);
      // For demo purposes, update state directly
      setTicket((prev) =>
        prev
          ? {
              ...prev,
              subTickets: [
                ...prev.subTickets,
                {
                  id: `st${prev.subTickets.length + 1}`,
                  title: newSubTicket.title,
                  status: "Todo" as const,
                },
              ],
            }
          : null
      );
      setNewSubTicket({ title: "", description: "", priority: "Medium" });
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Subtasks
        </h2>
      </div>

      {/* Subtask list */}
      {ticket.subTickets.length > 0 ? (
        <ul className="mb-6 divide-y divide-gray-200 dark:divide-gray-700">
          {ticket.subTickets.map((subtask) => (
            <li key={subtask.id} className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span
                    className={`mr-2 inline-flex h-2 w-2 rounded-full ${
                      subtask.status === "Done"
                        ? "bg-green-500"
                        : subtask.status === "InProgress"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  ></span>
                  <Link
                    href={`/tickets/${subtask.id}`}
                    className="text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                  >
                    {subtask.title}
                  </Link>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(subtask.status)}`}
                >
                  {subtask.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-6 text-gray-500 dark:text-gray-400">
          No subtasks created yet
        </p>
      )}

      {/* Create subtask form */}
      <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
          Create Subtask
        </h3>
        <form onSubmit={addSubTicket} className="space-y-4">
          <div>
            <label
              htmlFor="subtask-title"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Title
            </label>
            <input
              id="subtask-title"
              name="title"
              type="text"
              required
              value={newSubTicket.title}
              onChange={(e) =>
                setNewSubTicket({
                  ...newSubTicket,
                  title: e.target.value,
                })
              }
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          <div>
            <label
              htmlFor="subtask-description"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description
            </label>
            <textarea
              id="subtask-description"
              name="description"
              rows={3}
              value={newSubTicket.description}
              onChange={(e) =>
                setNewSubTicket({
                  ...newSubTicket,
                  description: e.target.value,
                })
              }
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          <div>
            <label
              htmlFor="subtask-priority"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Priority
            </label>
            <select
              id="subtask-priority"
              name="priority"
              value={newSubTicket.priority}
              onChange={(e) =>
                setNewSubTicket({
                  ...newSubTicket,
                  priority: e.target.value as "Low" | "Medium" | "High",
                })
              }
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              <FaPlus className="mr-2" /> Create Subtask
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
