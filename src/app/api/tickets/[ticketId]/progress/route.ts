import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { notifyTicketModified } from "@/services/notificationService";

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> },
) {
  const body = await req.json();
  const { progress } = body;
  const { ticketId } = await params;

  try {
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { progress },
    });

    // Notify about the progress change
    await notifyTicketModified(ticketId, { progress });

    return new Response(JSON.stringify(updatedTicket), { status: 200 });
  } catch (error) {
    return new Response("Error updating ticket progress: " + error, {
      status: 500,
    });
  }
}
