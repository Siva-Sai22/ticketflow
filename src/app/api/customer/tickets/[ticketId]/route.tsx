import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, TicketStatus } from "@prisma/client";
import {
  notifyCustomerFeedbackAdded,
  notifyCustomerStatusChanged,
} from "@/services/notificationService";

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { ticketId: string } },
) {
  try {
    const { ticketId } = await params;
    const data = await request.json();

    // Prepare update data object
    const updateData: {
      feedback?: string;
      status?: TicketStatus;
    } = {};

    // Add feedback if present
    if (data.feedback !== undefined) {
      updateData.feedback = data.feedback;
    }

    // Add status if present
    if (data.status !== undefined) {
      updateData.status = data.status as TicketStatus;
    }

    // Only allow support staff to update feedback (this would need proper authentication)
    const updatedTicket = await prisma.customerTickets.update({
      where: {
        id: ticketId,
      },
      data: updateData,
    });

    if (data.feedback) {
      // Notify customer about the feedback
      await notifyCustomerFeedbackAdded(ticketId);
    }
    if (data.status) {
      // Notify customer about the status change
      await notifyCustomerStatusChanged(ticketId);
    }

    return NextResponse.json(updatedTicket, { status: 200 });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 },
    );
  }
}
