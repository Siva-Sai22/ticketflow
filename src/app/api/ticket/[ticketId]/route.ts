import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { ticketId: string } }) {
  const id = params.ticketId;

  if (!id) {
    return NextResponse.json(
      { error: "Ticket ID is required" },
      { status: 400 }
    );
  }

  const ticket = await prisma.ticket.findUnique({
    where: {
      id,
    },
  });
  return NextResponse.json(ticket, { status: 200 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const developerId = request.nextUrl.searchParams.get("id");
    const body = await request.json();
    const id = params.ticketId;

    if (!developerId) {
      return NextResponse.json(
        { error: "Developer ID is required" },
        { status: 400 }
      );
    }

    const ticket = await prisma.ticket.findUnique({
      where: {
        id,
      },
      include: {
        assignedDepartments: true,
      },
    });

    if (body.status) {
      const developer = await prisma.developer.findUnique({
        where: {
          id: developerId,
        },
      });

      if (
        ticket?.assignedDepartments.some(
          (department) => department.id === developer?.departmentId
        )
      ) {
        const updatedTicket = await prisma.ticket.update({
          where: {
            id,
          },
          data: body,
        });
        return NextResponse.json(updatedTicket, { status: 200 });
      }
    }

    const updatedTicket = await prisma.ticket.update({
      where: {
        id,
      },
      data: body,
    });

    return NextResponse.json(updatedTicket, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
