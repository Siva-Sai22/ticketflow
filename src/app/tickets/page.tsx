"use client";

import { useState, useEffect } from "react";
import { FaFilter, FaSearch, FaPlus } from "react-icons/fa";
import Link from "next/link";
import { useUser } from "@/context/user-context";

// Dummy ticket data with different statuses, priorities and types
const dummyTickets = [
  {
    id: "TKT-1001",
    title: "Fix login authentication bug",
    description: "Users are getting logged out randomly during session",
    status: "InProgress",
    priority: "High",
    createdAt: "2023-10-15",
    dueDate: "2023-10-22",
  },
  {
    id: "TKT-1002",
    title: "Add dark mode support",
    description: "Implement system-wide dark mode toggle in settings",
    status: "Todo",
    priority: "Medium",
    createdAt: "2023-10-16",
    dueDate: "2023-10-30",
  },
  {
    id: "TKT-1003",
    title: "Optimize image loading on dashboard",
    description: "Dashboard images take too long to load on slower connections",
    status: "Done",
    priority: "Medium",
    createdAt: "2023-10-10",
    dueDate: "2023-10-20",
  },
  {
    id: "TKT-1004",
    title: "API rate limiting issue",
    description: "External API calls exceed rate limits during peak hours",
    status: "InProgress",
    priority: "High",
    createdAt: "2023-10-17",
    dueDate: "2023-10-19",
  },
  {
    id: "TKT-1005",
    title: "Add export to PDF functionality",
    description: "Allow users to export their reports as PDF documents",
    status: "Todo",
    priority: "Low",
    createdAt: "2023-10-18",
    dueDate: "2023-11-10",
  },
  {
    id: "TKT-1006",
    title: "Redesign notification panel",
    description: "Current notification UI is cluttered and hard to read",
    status: "Done",
    priority: "Medium",
    createdAt: "2023-09-30",
    dueDate: "2023-10-15",
  },
];

export default function TicketsPage() {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [tickets, setTickets] = useState(dummyTickets);
  const devId = useUser().userData?.id;

  useEffect(() => {
    const fetchTickets = async () => {
      const response = await fetch(`/api/dev/tickets/${devId}`);
      if (response.status !== 200) {
        console.error("Failed to fetch tickets");
        return;
      }
      const data = await response.json();
      setTickets([...data]);
    };

    fetchTickets();
  }, [devId]);

  // Filter tickets based on selection and search term
  const filteredTickets = tickets.filter((ticket) => {
    const matchesFilter = filter === "All" || ticket.status === filter;
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Get proper status color for badges
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

  // Get proper priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 dark:text-red-400";
      case "Medium":
        return "text-yellow-500 dark:text-yellow-400";
      case "Low":
        return "text-green-500 dark:text-green-400";
      default:
        return "text-gray-500 dark:text-gray-400";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          My Tickets
        </h1>
        <Link href="/tickets/create">
          <button className="flex items-center gap-2 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
            <FaPlus /> Create Ticket
          </button>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center">
          <div className="mr-4 flex items-center">
            <FaFilter className="mr-2 text-gray-500 dark:text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="All">All Statuses</option>
              <option value="Todo">Todo</option>
              <option value="InProgress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:w-64 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Ticket Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/30">
          <p className="text-sm font-medium text-blue-500 dark:text-blue-400">
            Total
          </p>
          <p className="text-2xl font-bold dark:text-white">
            {tickets.length}
          </p>
        </div>
        <div className="rounded-lg border border-yellow-100 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/30">
          <p className="text-sm font-medium text-yellow-500 dark:text-yellow-400">
            In Progress
          </p>
          <p className="text-2xl font-bold dark:text-white">
            {tickets.filter((t) => t.status === "In Progress").length}
          </p>
        </div>
        <div className="rounded-lg border border-green-100 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/30">
          <p className="text-sm font-medium text-green-500 dark:text-green-400">
            Completed
          </p>
          <p className="text-2xl font-bold dark:text-white">
            {tickets.filter((t) => t.status === "Done").length}
          </p>
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <Link
              href={`/tickets/${ticket.id}`}
              key={ticket.id}
              className="block"
            >
              <div className="h-full cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="px-4 py-5 sm:p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {ticket.id}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(ticket.status)}`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                    {ticket.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                    {ticket.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span
                        className={`font-medium ${getPriorityColor(ticket.priority)}`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    <div>
                      Created:{" "}
                      {new Date(ticket.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </div>
                    <div>
                      Due:{" "}
                      {new Date(ticket.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-3 py-8 text-center text-gray-500 dark:text-gray-400">
            No tickets match your search criteria
          </div>
        )}
      </div>
    </div>
  );
}
