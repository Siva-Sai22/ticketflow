import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { notifyTicketModified } from "@/services/notificationService";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> },
) {
  const { ticketId } = await params;
  if (!ticketId) {
    return new Response("Ticket ID is required", { status: 400 });
  }

  const body = await request.json();
  const { status } = body;
  if (!status) {
    return new Response("Status is required", { status: 400 });
  }

  try {
    const ticket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status },
    });

    // Notify about the status change
    await notifyTicketModified(ticketId, { status });

    return new Response(JSON.stringify(ticket), { status: 200 });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
