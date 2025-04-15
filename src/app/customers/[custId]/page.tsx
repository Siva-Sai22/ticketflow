"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { TicketStatus } from "@prisma/client";
import { FaPlus } from "react-icons/fa";

// Types based on your Prisma schema
type CustomerTicket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  customerId: string;
};

type NewTicketData = {
  title: string;
  description: string;
};

export default function CustomerTicketsPage() {
  const [tickets, setTickets] = useState<CustomerTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newTicket, setNewTicket] = useState<NewTicketData>({
    title: "",
    description: "",
  });
  const router = useRouter();
  const params = useParams();
  const custId = params.custId as string;

  // Fetch customer tickets
  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await fetch(`/api/customers/${custId}/tickets`);
        if (!response.ok) {
          throw new Error("Failed to fetch tickets");
        }
        const data = await response.json();
        setTickets(data);
      } catch (err) {
        setError("Failed to load tickets. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, [custId]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTicket.title || !newTicket.description) {
      setError("Please fill all required fields");
      return;
    }
    
    try {
      const response = await fetch(`/api/customers/${custId}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTicket),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create ticket");
      }
      
      const createdTicket = await response.json();
      setTickets([...tickets, createdTicket]);
      setNewTicket({ title: "", description: "" });
      setShowForm(false);
      router.refresh();
    } catch (err) {
      setError("Failed to create ticket. Please try again.");
      console.error(err);
    }
  };

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTicket({ ...newTicket, [name]: value });
  };

  // Get appropriate badge color based on ticket status - updated to match tickets page
  const getStatusBadgeColor = (status: TicketStatus) => {
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

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Tickets</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          {showForm ? "Cancel" : <><FaPlus /> Create New Ticket</>}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-100 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* New Ticket Form */}
      {showForm && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">Submit New Ticket</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label 
                htmlFor="title" 
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newTicket.title}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label 
                htmlFor="description" 
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={newTicket.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : tickets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              onClick={() => router.push(`/customers/tickets/${ticket.id}`)}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {ticket.id}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(
                    ticket.status
                  )}`}
                >
                  {ticket.status.replace(/([A-Z])/g, " $1").trim()}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                {ticket.title}
              </h3>
              <p className="mb-4 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                {ticket.description}
              </p>
              <button
                className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View Details →
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">You haven&apos;t submitted any tickets yet.</p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Create Your First Ticket
            </button>
          )}
        </div>
      )}
    </div>
  );
}
