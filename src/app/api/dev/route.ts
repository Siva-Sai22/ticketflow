import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const developers = await prisma.developer.findMany({
      select: {
        id: true,
        email: true,
        department: {
          select: {
            id: true,
          },
        }
      },
    });

    return new Response(JSON.stringify(developers), { status: 200 });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
