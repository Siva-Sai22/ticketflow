import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { ticketId: string } },
) {
  const { ticketId } = await params;
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { ticketId: string } },
) {
  const { ticketId } = params;
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('fileId');
  
  if (!ticketId || !fileId) {
    return new Response("Ticket ID and File ID are required", { status: 400 });
  }

  try {
    await prisma.file.delete({
      where: {
        id: fileId,
      },
    });

    return new Response("File deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting file:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { ticketId: string } },
) {
  const { ticketId } = params;
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('fileId');
  
  if (!ticketId || !fileId) {
    return new Response("Ticket ID and File ID are required", { status: 400 });
  }

  try {
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!file) {
      return new Response("File not found", { status: 404 });
    }

    // Create headers for file download
    const headers = new Headers();
    headers.append('Content-Disposition', `attachment; filename="${file.name}"`);
    headers.append('Content-Type', file.mimeType || 'application/octet-stream');

    return new Response(file.content, { 
      status: 200,
      headers
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
