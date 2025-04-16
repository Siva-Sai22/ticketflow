import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ deptId: string }> },
) {
  const { deptId } = await params;

  if (!deptId) {
    return NextResponse.json(
      { error: "Department ID is required" },
      { status: 400 },
    );
  }

  const department = await prisma.department.findUnique({
    where: {
      id: deptId,
    },
  });

  return NextResponse.json(department, { status: 200 });
}
