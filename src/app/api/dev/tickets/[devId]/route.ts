import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { devId: string } },
) {
  const { devId } = await params;
  if (!devId) {
    return new Response("Developer ID is required", { status: 400 });
  }

  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        assignedTo: {
          some: {
            id: devId,
          },
        },
      },
    });

    return new Response(JSON.stringify(tickets), { status: 200 });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
