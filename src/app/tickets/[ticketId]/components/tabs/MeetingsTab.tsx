import { useState } from "react";
import { FaPlus, FaCalendar } from "react-icons/fa";
import { TicketDetails } from "../types";

interface Props {
  ticket: TicketDetails;
  setTicket: React.Dispatch<React.SetStateAction<TicketDetails | null>>;
}

export default function MeetingsTab({ ticket, setTicket }: Props) {
  const [newMeeting, setNewMeeting] = useState({ date: "", notes: "" });

  // Function to add a new meeting
  const addMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeeting.date || !newMeeting.notes) return;

    try {
      // API call to add meeting
      const response = await fetch(`/api/tickets/${ticket?.id}/meetings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date(newMeeting.date),
          notes: newMeeting.notes,
        }),
      });

      const newMeetingData = await response.json();

      // Update local state
      setTicket((prev) =>
        prev
          ? {
              ...prev,
              meetings: [
                ...prev.meetings,
                {
                  id: newMeetingData.id || `m${prev.meetings.length + 1}`,
                  ...newMeeting,
                },
              ],
            }
          : null,
      );

      // Reset form
      setNewMeeting({ date: "", notes: "" });
    } catch (error) {
      console.error("Error adding meeting:", error);
      // For demo purposes, update state directly
      setTicket((prev) =>
        prev
          ? {
              ...prev,
              meetings: [
                ...prev.meetings,
                {
                  id: `m${prev.meetings.length + 1}`,
                  ...newMeeting,
                },
              ],
            }
          : null,
      );
      setNewMeeting({ date: "", notes: "" });
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        Meetings
      </h2>

      {/* Meeting list */}
      {ticket.meetings.length > 0 ? (
        <div className="mb-6 divide-y divide-gray-200 dark:divide-gray-700">
          {ticket.meetings.map((meeting) => (
            <div key={meeting.id} className="py-4">
              <div className="flex items-start">
                <div className="mt-1 mr-3 flex-shrink-0">
                  <FaCalendar className="text-gray-400" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(meeting.date).toLocaleDateString()}
                  </p>
                  <p className="mt-1 text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {meeting.notes}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-6 text-gray-500 dark:text-gray-400">
          No meetings recorded yet
        </p>
      )}

      {/* Add meeting form */}
      <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
          Add Meeting
        </h3>
        <form onSubmit={addMeeting} className="space-y-4">
          <div>
            <label
              htmlFor="meeting-date"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Date
            </label>
            <input
              id="meeting-date"
              name="date"
              type="date"
              required
              value={newMeeting.date}
              onChange={(e) =>
                setNewMeeting({ ...newMeeting, date: e.target.value })
              }
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="meeting-notes"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Notes
            </label>
            <textarea
              id="meeting-notes"
              name="notes"
              rows={3}
              required
              value={newMeeting.notes}
              onChange={(e) =>
                setNewMeeting({
                  ...newMeeting,
                  notes: e.target.value,
                })
              }
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Meeting discussion points..."
            />
          </div>
          <div>
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              <FaPlus className="mr-2" /> Add Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
