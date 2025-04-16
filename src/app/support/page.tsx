"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";

type CustomerTicket = {
  id: string;
  title: string;
  description: string;
  status: "Todo" | "InProgress" | "Done";
  customer: {
    email: string;
  };
  feedback?: string;
};

export default function SupportTickets() {
  const [tickets, setTickets] = useState<CustomerTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userData, isLoading } = useUser();
  const router = useRouter();

  // Check user access and fetch tickets
  useEffect(() => {
    // Wait for user data to load
    if (isLoading) return;

    // Check if user is logged in and from support department
    if (!userData) {
      router.push("/unauthorized");
      return;
    }

    // Check if user is in support department
    if (userData.role !== "support") {
      router.push("/unauthorized");
      return;
    }

    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/customer/tickets");
        if (!response.ok) {
          throw new Error("Failed to fetch tickets");
        }
        const data = await response.json();
        setTickets(data);
      } catch (err) {
        console.log("Error fetching tickets:", err);
        setError("Error loading tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [userData, isLoading, router]);

  const handleUpdateTicket = async (ticketId: string, status: string, feedback: string) => {
    try {
      const response = await fetch(`/api/customer/tickets/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          feedback,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update ticket");
      }

      // Update the local state to reflect the changes
      setTickets(
        tickets.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, status: status as "Todo" | "InProgress" | "Done", feedback }
            : ticket,
        ),
      );
    } catch (err) {
      console.error("Error updating ticket:", err);
      setError("Error updating ticket");
    }
  };

  const handleTicketUpdate = (ticketId: string) => (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const feedback = (
      form.elements.namedItem("feedback") as HTMLTextAreaElement
    ).value;
    const status = (
      form.elements.namedItem("status") as HTMLSelectElement
    ).value;

    handleUpdateTicket(ticketId, status, feedback);
    form.reset();
  };

  // Get proper status color for badges - using the same function as in tickets page
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Todo":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "InProgress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Done":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  if (isLoading || loading) return <div className="p-8 text-center dark:text-white">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-8 dark:bg-gray-900">
      <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Customer Support Tickets</h1>

      {tickets.length === 0 ? (
        <p className="dark:text-white">No customer tickets found.</p>
      ) : (
        <div className="grid gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-lg border border-gray-200 p-6 shadow-md bg-white dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{ticket.title}</h2>
                  <p className="mb-2 text-gray-600 dark:text-gray-400">
                    Customer: {ticket.customer.email}
                  </p>
                  <p className="mb-4 text-gray-700 dark:text-gray-300">{ticket.description}</p>

                  <div className="mb-2">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${getStatusColor(ticket.status)}`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  {ticket.feedback && (
                    <div className="mt-4 rounded-md bg-gray-50 p-3 dark:bg-gray-700">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Feedback:
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">{ticket.feedback}</p>
                    </div>
                  )}
                </div>

                <div className="w-1/3">
                  <form
                    onSubmit={handleTicketUpdate(ticket.id)}
                    className="space-y-3"
                  >
                    <div>
                      <label
                        htmlFor={`status-${ticket.id}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Update Status
                      </label>
                      <select
                        id={`status-${ticket.id}`}
                        name="status"
                        defaultValue={ticket.status}
                        className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="Todo">Todo</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor={`feedback-${ticket.id}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Feedback for Customer
                      </label>
                      <textarea
                        id={`feedback-${ticket.id}`}
                        name="feedback"
                        rows={3}
                        className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        placeholder="Add feedback..."
                        defaultValue={ticket.feedback || ""}
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    >
                      Update Ticket
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
