import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { serialize } from "cookie";

const prisma = new PrismaClient();

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
      data: body,
    });

    const cookie = serialize(
      "user",
      JSON.stringify({ email: newUser.email, id: newUser.id }),
      {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // One week
        path: "/",
      },
    );

    return NextResponse.redirect("/", {
      status: 302,
      headers: {
        "Set-Cookie": cookie,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" + error },
      { status: 500 },
    );
  }
}
