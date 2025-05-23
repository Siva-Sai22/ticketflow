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

    const userRole = userData.role;
    
    if (userRole === "customer") {
      const customer = await prisma.customer.findFirst({
        where: { email: userData.email },
      });
      
      if (!customer) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      
      return NextResponse.json({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        role: "customer",
      });
    } else {
      const developer = await prisma.developer.findFirst({
        where: { email: userData.email },
        include: { 
          leadOfDepartment: true,
          department: true 
        },
      });
      
      if (!developer) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      
      // Check if the developer is from the Support department
      const isSupport = developer.department?.name === "Support";
      
      // Determine role (support, lead, or developer)
      const role = isSupport 
        ? "support" 
        : developer.leadOfDepartment 
          ? "lead" 
          : "developer";
      
      return NextResponse.json({
        id: developer.id,
        name: developer.name,
        email: developer.email,
        role: role,
        department: developer.department?.name
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" + error },
      { status: 500 },
    );
  }
}
