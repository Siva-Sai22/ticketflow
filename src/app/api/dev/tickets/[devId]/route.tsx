import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const devid = query.get("devId");

  if (!devid) {
    return new Response("Developer ID is required", { status: 400 });
  }

  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        developerId: Number(devid),
      },
    });

    return new Response(JSON.stringify(tickets), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}