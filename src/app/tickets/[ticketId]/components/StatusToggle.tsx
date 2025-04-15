"use client";
import { useState } from "react";
import { TicketDetails } from "./types";

interface StatusToggleProps {
  ticket: TicketDetails;
  onStatusChange: (newStatus: string) => void;
}

const statusOptions = [
  { value: "Todo", label: "To Do" },
  { value: "InProgress", label: "In Progress" },
  { value: "Done", label: "Done" },
];

export default function StatusToggle({ ticket, onStatusChange }: StatusToggleProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === ticket.status) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      
      onStatusChange(newStatus);
    } catch (error) {
      console.error("Error updating ticket status:", error);
      // You might want to add error handling UI here
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mt-2">
      <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Status
      </label>
      <select
        id="status"
        value={ticket.status}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={isUpdating}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {isUpdating && <p className="mt-1 text-xs text-gray-500">Updating status...</p>}
    </div>
  );
}
