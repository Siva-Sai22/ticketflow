import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { notifyTicketAssignment } from "@/services/notificationService";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body) {
    return new Response(JSON.stringify({ error: "Ticket data is required" }), {
      status: 400,
    });
  }

  // Prepare ticket data
  const ticketData = {
    title: body.title,
    description: body.description,
    status: body.status,
    priority: body.priority,
    progress: parseInt(body.progress),
    dueDate: new Date(body.dueDate),
    assignedDepartments: {
      connect: body.assignedDepartments.map((id: string) => ({
        id,
      })),
    },
    assignedTo: {
      connect: body.assignedDevelopers.map((id: string) => ({
        id,
      })),
    },
  };

  // Add parent relation if parentId is provided
  if (body.parentId) {
    Object.assign(ticketData, {
      parent: {
        connect: { id: body.parentId },
      },
    });
  }

  const ticket = await prisma.ticket.create({
    data: ticketData,
  });

  // Notify assigned developers
  if (body.assignedDevelopers && body.assignedDevelopers.length > 0) {
    await notifyTicketAssignment(ticket.id, body.assignedDevelopers);
  }

  return new Response(JSON.stringify(ticket), { status: 201 });
}

export async function GET() {
  const tickets = await prisma.ticket.findMany({
    select: {
      id: true,
      title: true,
    },
  });

  return new Response(JSON.stringify(tickets), { status: 200 });
}
