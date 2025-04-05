import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await prisma.developer.findFirst({
      where: { email: body.email },
    });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    const newUser = await prisma.developer.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
        department: {
          connect: {
            name: body.department,
          },
        },
        ...(body.role === "lead" && {
          leadOfDepartment: {
            connect: { name: body.department },
          },
        }),
      },
    });

    const token = jwt.sign(
      {
        username: newUser.name,
        email: newUser.email,
        role: body.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }, // 7 days
    );

    const cookie = serialize("authToken", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // One week
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": cookie,
        },
      },
    );
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json(
      { error: "Internal server error" + error },
      { status: 500 },
    );
  }
}
