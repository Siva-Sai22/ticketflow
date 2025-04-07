import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body) {
    return new Response(JSON.stringify({ error: "Ticket data is required" }), {
      status: 400,
    });
  }

  const ticket = await prisma.ticket.create({
    data: {
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      progress: body.progress,
      dueDate: new Date(body.dueDate),
      assignedDepartments: {
        connect: body.assignedDepartments.map((id: string) => ({
          id,
        })),
      },
      assignedTo: {
        connect: body.assignedDevelopers.map((id: string) => ({
          id,
        })),
      },
    },
  });

  return new Response(JSON.stringify(ticket), { status: 201 });
}
