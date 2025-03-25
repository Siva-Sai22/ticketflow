import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { deptId: string } }
) {
  const id = params.deptId;

  if (!id) {
    return NextResponse.json(
      { error: "Department ID is required" },
      { status: 400 }
    );
  }

  const department = await prisma.department.findUnique({
    where: {
      id,
    },
  });

  return NextResponse.json(department, { status: 200 });
}
