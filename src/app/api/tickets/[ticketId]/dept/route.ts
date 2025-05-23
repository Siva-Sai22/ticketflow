import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { notifyTicketModified } from "@/services/notificationService";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> },
) {
  const { ticketId } = await params;
  if (!ticketId) {
    return new Response("Ticket ID is required", { status: 400 });
  }

  const body = await request.json();
  const { departmentId } = body;

  try {
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        assignedDepartments: {
          connect: [{ id: departmentId }],
        },
      },
    });

    // Notify about department assignment change
    await notifyTicketModified(ticketId, { assignedDepartment: departmentId });

    return new Response(JSON.stringify(updatedTicket), { status: 200 });
  } catch (error) {
    console.error("Error updating ticket department:", error);
    return new Response("Error updating ticket department", { status: 500 });
  }
}
