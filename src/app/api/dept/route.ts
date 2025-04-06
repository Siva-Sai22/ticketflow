import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const departments = await prisma.department.findMany({
    include: {
      teamLead: {
        select: {
          email: true,
        },
      },
    },
  });
  return NextResponse.json(departments, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const department = await prisma.department.create({
      data: {
        name: body.name,
      }
    });
    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    console.log("Error creating department:", error);
    return NextResponse.json({ error }, { status: 400 });
  }
}
