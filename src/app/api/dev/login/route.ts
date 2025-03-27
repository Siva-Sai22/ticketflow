import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { serialize } from "cookie";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const user = await prisma.developer.findFirst({
      where: { email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const cookie = serialize(
      "user",
      JSON.stringify({ email: user.email, id: user.id }),
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
