import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const user = await prisma.developer.findFirst({
      where: { email },
      include: { leadOfDepartment: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.name,
        email: user.email,
        role: user.leadOfDepartment ? "lead" : "developer",
      },
      JWT_SECRET,
      { expiresIn: "7d" }, // 7 days
    );

    const cookie = serialize("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // One week
      path: "/",
    });

    return NextResponse.json(
      {
        id: user.id,
        username: user.name,
        email: user.email,
        role: user.leadOfDepartment ? "lead" : "developer",
      },
      {
        status: 302,
        headers: {
          "Set-Cookie": cookie,
        },
      },
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Internal server error" + error },
      { status: 500 },
    );
  }
}
