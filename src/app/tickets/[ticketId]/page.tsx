"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/footer";
import { useParams } from "next/navigation";
import TicketHeader from "./components/TicketHeader";
import ProgressBar from "./components/ProgressBar";
import TabNavigation from "./components/TabNavigation";
import DetailsTab from "./components/tabs/DetailsTab";
import SubtasksTab from "./components/tabs/SubtasksTab";
import AssignmentsTab from "./components/tabs/AssignmentsTab";
import FilesTab from "./components/tabs/FilesTab";
import MeetingsTab from "./components/tabs/MeetingsTab";
import { TicketDetails, Department, Developer } from "./components/types";

export default function TicketDetailsPage() {
  const params = useParams<{ ticketId: string }>();
  
  // State for ticket data
  const [ticket, setTicket] = useState<TicketDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  
  // Progress bar state
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [newProgress, setNewProgress] = useState(0);
  
  // Resource states
  const [availableDepts, setAvailableDepts] = useState<Department[]>([]);
  const [availableDevs, setAvailableDevs] = useState<Developer[]>([]);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        // Fetch the ticket details using the ID from the URL params
        const response = await fetch(`/api/tickets/${params.ticketId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch ticket details");
        }

        const data = await response.json();
        setTicket(data);
        setNewProgress(data.progress);
      } catch (error) {
        console.error("Error fetching ticket details:", error);
        // For demo purposes, let's create dummy data
        setTicket({
          id: params.ticketId as string,
          title: "Fix Authentication Bug",
          description:
            "Users are experiencing random logouts during active sessions. Need to investigate token expiration and refresh mechanisms.",
          status: "InProgress",
          priority: "High",
          progress: 35,
          createdAt: "2023-10-15",
          dueDate: "2023-10-30",
          assignedTo: [{ id: "1", name: "Alex Johnson" }],
          assignedDepartments: [{ id: "1", name: "Backend Team" }],
          subTickets: [
            {
              id: "st1",
              title: "Investigate token expiration",
              status: "Done",
            },
            {
              id: "st2",
              title: "Implement token refresh",
              status: "InProgress",
            },
          ],
          files: [
            {
              id: "f1",
              name: "auth-logs.txt",
              size: 12400,
              createdAt: "2023-10-16",
              mimeType: "text/plain",
            },
          ],
          meetings: [
            {
              id: "m1",
              date: "2023-10-17",
              notes: "Discussed token refresh strategy with team",
            },
          ],
          rating: 0,
        });
        setNewProgress(35);
      } finally {
        setLoading(false);
      }
    };

    const fetchDepartmentsAndDevs = async () => {
      try {
        const [deptResponse, devResponse] = await Promise.all([
          fetch("/api/dept"),
          fetch("/api/dev"),
        ]);

        const depts = await deptResponse.json();
        const devs = await devResponse.json();

        setAvailableDepts(depts);
        setAvailableDevs(devs);
      } catch (error) {
        console.error("Error fetching departments and developers:", error);
        setAvailableDepts([
          { id: "1", name: "Backend Team" },
          { id: "2", name: "Frontend Team" },
          { id: "3", name: "QA Team" },
        ]);
        setAvailableDevs([
          { id: "1", name: "Alex Johnson" },
          { id: "2", name: "Maria Garcia" },
          { id: "3", name: "Sam Lee" },
        ]);
      }
    };

    fetchTicket();
    fetchDepartmentsAndDevs();
  }, [params.ticketId]);

  // Function to update ticket progress
  const updateProgress = async () => {
    try {
      // API call to update progress
      await fetch(`/api/tickets/${ticket?.id}/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: newProgress }),
      });

      // Update local state
      setTicket((prev) => (prev ? { ...prev, progress: newProgress } : null));
      setIsEditingProgress(false);
    } catch (error) {
      console.error("Error updating progress:", error);
      // For demo, just update the state
      setTicket((prev) => (prev ? { ...prev, progress: newProgress } : null));
      setIsEditingProgress(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex-grow bg-gray-50 p-4 dark:bg-gray-900">
          <div className="flex h-full items-center justify-center">
            <div className="animate-pulse">Loading ticket details...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex-grow bg-gray-50 p-4 dark:bg-gray-900">
          <div className="flex h-full items-center justify-center">
            <div className="text-red-500">Ticket not found</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-grow bg-gray-50 p-4 dark:bg-gray-900">
        <div className="container mx-auto max-w-5xl">
          {/* Back button */}
          <div className="mb-6">
            <Link
              href="/tickets"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <span>← Back to tickets</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <TicketHeader ticket={ticket} />
            
            <ProgressBar 
              progress={ticket.progress}
              isEditing={isEditingProgress}
              newProgress={newProgress}
              setNewProgress={setNewProgress}
              setIsEditing={setIsEditingProgress}
              updateProgress={updateProgress}
            />
            
            {/* Description */}
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </h3>
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {ticket.description}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Tab Content */}
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            {activeTab === "details" && <DetailsTab ticket={ticket} />}
            
            {activeTab === "subtasks" && (
              <SubtasksTab 
                ticket={ticket} 
                setTicket={setTicket} 
              />
            )}
            
            {activeTab === "assignments" && (
              <AssignmentsTab 
                ticket={ticket}
                setTicket={setTicket}
                availableDepts={availableDepts}
                availableDevs={availableDevs}
              />
            )}
            
            {activeTab === "files" && (
              <FilesTab 
                ticket={ticket}
                setTicket={setTicket}
              />
            )}
            
            {activeTab === "meetings" && (
              <MeetingsTab 
                ticket={ticket}
                setTicket={setTicket}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
