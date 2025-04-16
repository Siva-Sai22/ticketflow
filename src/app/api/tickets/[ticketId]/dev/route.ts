import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { notifyTicketModified } from "@/services/notificationService";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { ticketId: string } },
) {
  const { ticketId } = await params;
  if (!ticketId) {
    return new Response("Ticket ID is required", { status: 400 });
  }

  const body = await request.json();
  const { developerIds } = body;

  try {
    // First get current ticket with its developers
    const currentTicket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { assignedTo: true }
    });
    
    if (!currentTicket) {
      return new Response("Ticket not found", { status: 404 });
    }
    
    // Get existing developer IDs
    const existingDeveloperIds = currentTicket.assignedTo.map(dev => dev.id);
    
    // Add new developers without duplicates
    const allDeveloperIds = [...new Set([...existingDeveloperIds, ...developerIds])];
    
    // Update with the combined list
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        assignedTo: {
          set: allDeveloperIds.map((id: string) => ({ id })),
        },
      },
      include: { assignedTo: true }
    });

    // Notify about developer assignment changes
    await notifyTicketModified(ticketId, { assignedDevelopers: developerIds });

    return new Response(JSON.stringify(updatedTicket), { status: 200 });
  } catch (error) {
    console.error("Error updating ticket department:", error);
    return new Response("Error updating ticket department", { status: 500 });
  }
}
