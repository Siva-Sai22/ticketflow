import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, {params}: {params: {devId: string}}) {
  const id = params.devId;

  if (!id) {
    return NextResponse.json(
      { error: "Developer ID is required" },
      { status: 400 }
    );
  }

  const developer = await prisma.developer.findUnique({
    where: {
      id,
    },
  });
  return NextResponse.json(developer, { status: 200 });
}