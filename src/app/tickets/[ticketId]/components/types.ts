export interface Developer {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface SubTicket {
  id: string;
  title: string;
  status: "Todo" | "InProgress" | "Done";
}

export interface Meeting {
  id: string;
  date: string;
  notes: string;
}

export interface File {
  id: string;
  name: string;
  size: number;
  createdAt: string;
  mimeType: string;
}

export interface TicketDetails {
  id: string;
  title: string;
  description: string;
  status: "Todo" | "InProgress" | "Done";
  priority: "Low" | "Medium" | "High";
  progress: number;
  createdAt: string;
  dueDate: string;
  assignedTo: Developer[];
  assignedDepartments: Department[];
  subTickets: SubTicket[];
  files: File[];
  meetings: Meeting[];
  rating?: number;
}

export function getStatusColor(status: string) {
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
}

export function getPriorityColor(priority: string) {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}
