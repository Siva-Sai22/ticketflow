import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = jwt.verify(token, JWT_SECRET);
    if (!data) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Type assertion to access email property
    const userData =
      typeof data === "object" ? data : JSON.parse(data as string);

    const user = await prisma.developer.findFirst({
      where: { email: userData.email },
      include: { leadOfDepartment: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.leadOfDepartment ? "lead" : "developer",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" + error },
      { status: 500 },
    );
  }
}
