import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, TicketStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const customerTickets = await prisma.customerTickets.findMany({
      include: {
        customer: {
          select: {
            email: true,
          },
        },
      },
    });

    return NextResponse.json(customerTickets, { status: 200 });
  } catch (error) {
    console.error("Error fetching customer tickets:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, customerId, status } = await request.json();

    // Validate required fields
    if (!title || !description || !customerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the new support ticket
    const newTicket = await prisma.customerTickets.create({
      data: {
        title,
        description,
        status: status || TicketStatus.Todo,
        customerId,
      },
    });

    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    console.error("Error creating customer ticket:", error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
