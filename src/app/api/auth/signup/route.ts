import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const SALT_ROUNDS = 10;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if user with this email already exists (either developer or customer)
    const existingDeveloper = await prisma.developer.findFirst({
      where: { email: body.email },
    });
    
    const existingCustomer = await prisma.customer.findFirst({
      where: { email: body.email },
    });
    
    if (existingDeveloper || existingCustomer) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);
    
    let userData;
    
    if (body.role === "customer") {
      // Create customer account with hashed password
      const newCustomer = await prisma.customer.create({
        data: {
          name: body.name,
          email: body.email,
          password: hashedPassword,
        },
      });
      
      userData = {
        id: newCustomer.id,
        name: newCustomer.name,
        email: newCustomer.email,
        role: "customer",
      };
    } else {
      // Check if the user is signing up for support department
      const isSupport = body.department === "Support";
      
      // Create developer account (developer, lead, or support) with hashed password
      const newUser = await prisma.developer.create({
        data: {
          name: body.name,
          email: body.email,
          password: hashedPassword,
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
      
      userData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: isSupport ? "support" : body.role,
      };
    }

    const token = jwt.sign(
      {
        id: userData.id,
        username: userData.name,
        email: userData.email,
        role: userData.role,
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
        user: userData,
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
