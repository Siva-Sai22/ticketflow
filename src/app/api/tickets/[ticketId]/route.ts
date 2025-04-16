import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> },
) {
  const { ticketId } = await params;

  if (!ticketId) {
    return NextResponse.json(
      { error: "Ticket ID is required" },
      { status: 400 },
    );
  }

  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
    include: {
      assignedDepartments: true,
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      files: true,
      subTickets: true,
      meetings: true,
      parent: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  return NextResponse.json(ticket, { status: 200 });
}
