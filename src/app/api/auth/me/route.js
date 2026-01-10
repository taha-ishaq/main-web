import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/middleware";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Verify authentication via jwt token
    const authResult = await requireAuth(request);

    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { userId, role } = authResult.user;

    // Check if SuperAdmin
    if (role === "superadmin") {
      const superAdmin = await prisma.superAdmin.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true,
          createdAt: true,
        },
      });

      if (!superAdmin) {
        return NextResponse.json(
          { error: "SuperAdmin not found" },
          { status: 404 }
        );
      }

      if (!superAdmin.isActive) {
        return NextResponse.json(
          { error: "Account is deactivated" },
          { status: 403 }
        );
      }

      return NextResponse.json({ 
        user: { ...superAdmin, role: "superadmin" } 
      });
    }

    // Otherwise, it's a regular User
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        phoneNumber: true,
        address: true,
        postalCode: true,
        city: true,
        role: true,
        isActive: true,
        notes: true,
        registrationDate: true,
        customer_id: true,
        customer: {
          select: {
            customerName: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 403 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}