import { useState } from "react";
import { FaFolder, FaUsers } from "react-icons/fa";
import { TicketDetails, Department, Developer } from "../types";

interface Props {
  ticket: TicketDetails;
  setTicket: React.Dispatch<React.SetStateAction<TicketDetails | null>>;
  availableDepts: Department[];
  availableDevs: Developer[];
}

export default function AssignmentsTab({ 
  ticket, 
  setTicket, 
  availableDepts, 
  availableDevs 
}: Props) {
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedDevs, setSelectedDevs] = useState<string[]>([]);

  // Function to assign department
  const assignDepartment = async () => {
    if (!selectedDept) return;

    const deptToAdd = availableDepts.find((d) => d.id === selectedDept);
    if (!deptToAdd) return;

    try {
      // API call to assign department
      await fetch(`/api/tickets/${ticket?.id}/dept`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ departmentId: selectedDept }),
      });

      // Update local state
      setTicket((prev) => {
        if (!prev) return null;

        // Check if department is already assigned
        if (prev.assignedDepartments.some((d) => d.id === deptToAdd.id)) {
          return prev;
        }

        return {
          ...prev,
          assignedDepartments: [...prev.assignedDepartments, deptToAdd],
        };
      });

      // Reset selection
      setSelectedDept("");
    } catch (error) {
      console.error("Error assigning department:", error);
      // For demo purposes, update state directly
      setTicket((prev) => {
        if (!prev) return null;
        if (prev.assignedDepartments.some((d) => d.id === deptToAdd.id)) {
          return prev;
        }
        return {
          ...prev,
          assignedDepartments: [...prev.assignedDepartments, deptToAdd],
        };
      });
      setSelectedDept("");
    }
  };

  // Function to assign developers
  const assignDevelopers = async () => {
    if (selectedDevs.length === 0) return;

    const devsToAdd = availableDevs.filter((d) => selectedDevs.includes(d.id));
    if (devsToAdd.length === 0) return;

    try {
      // API call to assign developers
      await fetch(`/api/tickets/${ticket?.id}/dev`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ developerIds: selectedDevs }),
      });

      // Update local state
      setTicket((prev) => {
        if (!prev) return null;

        const currentDevIds = new Set(prev.assignedTo.map((d) => d.id));
        const newDevs = devsToAdd.filter((d) => !currentDevIds.has(d.id));

        return {
          ...prev,
          assignedTo: [...prev.assignedTo, ...newDevs],
        };
      });

      // Reset selection
      setSelectedDevs([]);
    } catch (error) {
      console.error("Error assigning developers:", error);
      // For demo purposes, update state directly
      setTicket((prev) => {
        if (!prev) return null;
        const currentDevIds = new Set(prev.assignedTo.map((d) => d.id));
        const newDevs = devsToAdd.filter((d) => !currentDevIds.has(d.id));
        return {
          ...prev,
          assignedTo: [...prev.assignedTo, ...newDevs],
        };
      });
      setSelectedDevs([]);
    }
  };

  // Function to handle developer selection
  const handleDevSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setSelectedDevs(selected);
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        Manage Assignments
      </h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Department assignment section */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
            <FaFolder className="mr-2 inline" /> Assigned Departments
          </h3>

          {/* Current departments */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Current
            </h4>
            <div className="flex flex-wrap gap-2">
              {ticket.assignedDepartments.length > 0 ? (
                ticket.assignedDepartments.map((dept) => (
                  <div
                    key={dept.id}
                    className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-800"
                  >
                    {dept.name}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No departments assigned
                </p>
              )}
            </div>
          </div>

          {/* Assign new department */}
          <div className="mt-4">
            <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Assign New Department
            </h4>
            <div className="flex items-center gap-2">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Department</option>
                {availableDepts.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <button
                onClick={assignDepartment}
                disabled={!selectedDept}
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                Assign
              </button>
            </div>
          </div>
        </div>

        {/* Developer assignment section */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
            <FaUsers className="mr-2 inline" /> Assigned Developers
          </h3>

          {/* Current developers */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Current
            </h4>
            <div className="flex flex-wrap gap-2">
              {ticket.assignedTo.length > 0 ? (
                ticket.assignedTo.map((dev) => (
                  <div
                    key={dev.id}
                    className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-700/10 ring-inset dark:bg-green-900/30 dark:text-green-400 dark:ring-green-800"
                  >
                    {dev.name}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No developers assigned
                </p>
              )}
            </div>
          </div>

          {/* Assign new developers */}
          <div className="mt-4">
            <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Assign Developers
            </h4>
            <div className="flex flex-col gap-2">
              <select
                multiple
                value={selectedDevs}
                onChange={handleDevSelection}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              >
                {availableDevs.map((dev) => (
                  <option key={dev.id} value={dev.id}>
                    {dev.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Hold Ctrl (or Cmd) to select multiple developers
              </p>
              <button
                onClick={assignDevelopers}
                disabled={selectedDevs.length === 0}
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
