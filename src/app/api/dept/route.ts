import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const departments = await prisma.department.findMany();
  return NextResponse.json(departments, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const department = await prisma.department.create({
      data: body,
    });
    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
