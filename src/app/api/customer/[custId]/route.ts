import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ custId: string }> },
) {
  try {
    const { custId } = await params;

    // Fetch all tickets for this customer
    const customerTickets = await prisma.customerTickets.findMany({
      where: { customerId: custId },
    });

    return NextResponse.json(customerTickets, { status: 200 });
  } catch (error) {
    console.error("Error fetching customer tickets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 },
    );
  }
}
