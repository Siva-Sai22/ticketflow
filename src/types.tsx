export enum TicketStatus {
  Open = "Open",
  Paused = "Paused",
  Closed = "Closed"
}

export enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High"
}

export interface Department {
  id: string;
  name: string;
  teamLeadId?: string | null;
  teamLead?: Developer | null;
  tickets?: Ticket[];
  developers?: Developer[];
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: TicketStatus;
  subTickets?: Ticket[];
  assignedDepartments?: Department[];
  files?: File[];
  rating?: number | null;
  meetings?: Meeting[];
  parentId?: string | null;
  parent?: Ticket | null;
  priority: Priority;
}

export interface CustomerTicket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  customerId: string;
  customer?: Customer;
}

export interface Developer {
  id: string;
  name: string;
  email: string;
  password: string;
  leadOfDepartment?: Department | null;
  departmentId: string;
  department?: Department;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  ticketsOpened?: CustomerTicket[];
}

export interface Meeting {
  id: string;
  date: Date;
  notes: string;
  ticketId: string;
  ticket?: Ticket;
}

export interface File {
  id: string;
  name: string;
  mimeType: string;
  content: Uint8Array;
  size: number;
  createdAt: Date;
  ticketId: string;
  ticket?: Ticket;
}
