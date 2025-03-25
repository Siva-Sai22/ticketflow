import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const tickets = await prisma.ticket.findMany();
  return NextResponse.json(tickets, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ticket = await prisma.ticket.create({
      data: body,
    });
    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
