"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import Link from "next/link";
import { FaPlus, FaFilter, FaSearch } from "react-icons/fa";
import Footer from "@/components/footer";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  dueDate?: string;
  feedback?: string;
}

export default function CustomerSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const params = useParams();
  const router = useRouter();
  const { userData } = useUser();
  const customerId = params.custId as string;

  // Ensure customer can only access their own tickets
  useEffect(() => {
    if (
      userData &&
      userData.role === "customer" &&
      userData.id !== customerId
    ) {
      router.push(`/support/${userData.id}`);
    }
  }, [userData, customerId, router]);

  // Fetch customer tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(`/api/customer/${customerId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch tickets");
        }

        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        // For demo purposes, use dummy data if API fails
        setTickets([
          {
            id: "CT-1001",
            title: "Login issue with mobile app",
            description: "Unable to log in to mobile app after recent update",
            status: "Open",
            priority: "High",
            createdAt: "2025-04-10",
          },
          {
            id: "CT-1002",
            title: "Billing question",
            description: "Question about my recent invoice",
            status: "Closed",
            priority: "Medium",
            createdAt: "2025-04-05",
            feedback: "Issue was resolved quickly, thank you.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [customerId]);

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

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto flex-grow px-4 py-8 dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            My Support Tickets
          </h1>
          <Link href={`/support/${customerId}/create`}>
            <button className="flex items-center gap-2 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
              <FaPlus /> Create Support Ticket
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
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
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
              {tickets.filter((t) => t.status === "InProgress").length}
            </p>
          </div>
          <div className="rounded-lg border border-green-100 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/30">
            <p className="text-sm font-medium text-green-500 dark:text-green-400">
              Closed
            </p>
            <p className="text-2xl font-bold dark:text-white">
              {tickets.filter((t) => t.status === "Done").length}
            </p>
          </div>
        </div>

        {/* Tickets List */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
              ></div>
            ))
          ) : filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <div key={ticket.id} className="block">
                <div className="h-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
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
                    {ticket.feedback && (
                      <div className="mt-2 text-xs text-gray-500 italic dark:text-gray-400">
                        Feedback: {ticket.feedback}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 py-8 text-center text-gray-500 dark:text-gray-400">
              No tickets match your search criteria
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
