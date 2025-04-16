import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Check for developer
    const developer = await prisma.developer.findFirst({
      where: { email },
      include: { 
        leadOfDepartment: true,
        department: true
      },
    });

    // Check for customer if no developer found
    const customer = !developer
      ? await prisma.customer.findFirst({
          where: { email },
        })
      : null;

    // If neither found, return error
    if (!developer && !customer) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Handle authentication based on user type
    if (developer) {
      // Compare password with hashed password using bcrypt
      const passwordValid = await bcrypt.compare(password, developer.password);
      if (!passwordValid) {
        return NextResponse.json(
          { error: "Invalid password" },
          { status: 401 },
        );
      }

      // Check if the developer is from the Support department
      const isSupport = developer.department?.name === "Support";
      
      // Determine role (support, lead, or developer)
      const role = isSupport 
        ? "support" 
        : developer.leadOfDepartment 
          ? "lead" 
          : "developer";

      const token = jwt.sign(
        {
          id: developer.id,
          username: developer.name,
          email: developer.email,
          role: role,
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
          id: developer.id,
          name: developer.name,
          email: developer.email,
          role: role,
        },
        {
          status: 302,
          headers: {
            "Set-Cookie": cookie,
          },
        },
      );
    } else {
      if (!customer) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      // Customer authentication with bcrypt
      const passwordValid = await bcrypt.compare(password, customer.password);
      if (!passwordValid) {
        return NextResponse.json(
          { error: "Invalid password" },
          { status: 401 },
        );
      }

      const token = jwt.sign(
        {
          id: customer.id,
          username: customer.name,
          email: customer.email,
          role: "customer",
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
          id: customer.id,
          name: customer.name,
          email: customer.email,
          role: "customer",
        },
        {
          status: 302,
          headers: {
            "Set-Cookie": cookie,
          },
        },
      );
    }
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Internal server error" + error },
      { status: 500 },
    );
  }
}
