import { sendEmail } from "./emailService";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function notifyTicketAssignment(
  ticketId: string,
  developerIds: string[],
): Promise<void> {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    console.error(`Ticket with ID ${ticketId} not found`);
    return;
  }

  const developers = await prisma.developer.findMany({
    where: {
      id: { in: developerIds },
    },
  });

  for (const developer of developers) {
    await sendEmail(
      developer.email,
      `You've been assigned to ticket: ${ticket.title}`,
      `
        <h1>New Ticket Assignment</h1>
        <p>You have been assigned to ticket: ${ticket.title}</p>
        <p>Priority: ${ticket.priority}</p>
        <p>Due date: ${ticket.dueDate.toDateString()}</p>
        <p>Description: ${ticket.description}</p>
        <a href="${process.env.APP_URL}/tickets/${ticket.id}">View Ticket</a>
       `,
    );
  }
}

// For when a ticket is modified (status, description, etc)
export async function notifyTicketModified(
  ticketId: string,
  modifiedFields: { [s: string]: unknown } | ArrayLike<unknown>,
) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { assignedTo: true },
  });

  if (!ticket) {
    console.error(`Ticket with ID ${ticketId} not found`);
    return;
  }

  const developers = ticket.assignedTo;

  for (const developer of developers) {
    await sendEmail(
      developer.email,
      `Ticket updated: ${ticket.title}`,
      `
        <h1>Ticket Update</h1>
        <p>Ticket "${ticket.title}" has been updated.</p>
        <p>Changes:</p>
        <ul>
          ${Object.entries(modifiedFields)
            .map(([key, value]) => `<li>${key}: ${value}</li>`)
            .join("")}
        </ul>
        <a href="${process.env.APP_URL}/tickets/${ticket.id}">View Ticket</a>
      `,
    );
  }
}

// For when customer ticket status is changed
export async function notifyCustomerStatusChanged(customerTicketId: string) {
  const ticket = await prisma.customerTickets.findUnique({
    where: { id: customerTicketId },
    include: { customer: true },
  });

  if (ticket?.customer) {
    await sendEmail(
      ticket.customer.email,
      `Your ticket status has been updated: ${ticket.title}`,
      `
        <h1>Ticket Status Update</h1>
        <p>Your ticket "${ticket.title}" has been updated to status: ${ticket.status}</p>
        <a href="${process.env.APP_URL}/customer/tickets/${ticket.id}">View Ticket</a>
      `,
    );
  }
}

// For when feedback is added to customer ticket
export async function notifyCustomerFeedbackAdded(customerTicketId: string) {
  const ticket = await prisma.customerTickets.findUnique({
    where: { id: customerTicketId },
    include: { customer: true },
  });

  if (ticket?.customer && ticket?.feedback) {
    await sendEmail(
      ticket.customer.email,
      `New feedback on your ticket: ${ticket.title}`,
      `
        <h1>New Feedback</h1>
        <p>Your ticket "${ticket.title}" has received feedback:</p>
        <p>${ticket.feedback}</p>
        <a href="${process.env.APP_URL}/customer/tickets/${ticket.id}">View Ticket</a>
      `,
    );
  }
}
