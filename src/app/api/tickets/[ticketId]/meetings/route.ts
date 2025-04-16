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
  const { date, notes } = body;

  try {
    const meeting = await prisma.meeting.create({
      data: {
        date,
        notes,
        ticket: {
          connect: {
            id: ticketId,
          },
        },
      },
    });

    // Notify about the meeting creation
    await notifyTicketModified(ticketId, { meeting });

    return new Response(JSON.stringify(meeting), { status: 201 });
  } catch (error) {
    console.error("Error creating meeting:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
