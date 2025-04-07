import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { ticketId: string } },
) {
  const { ticketId } = params;
  if (!ticketId) {
    return new Response("Ticket ID is required", { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return new Response("File is required", { status: 400 });
  }

  try {
    const fileRecord = await prisma.file.create({
      data: {
        name: file.name,
        size: file.size,
        mimeType: file.type,
        content: Buffer.from(await file.arrayBuffer()),
        ticket: {
          connect: {
            id: ticketId,
          },
        },
      },
    });

    return new Response(JSON.stringify(fileRecord), { status: 201 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
