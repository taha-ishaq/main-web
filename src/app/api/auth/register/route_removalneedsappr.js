// src/app/api/auth/register/route.js
import prisma from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      phoneNumber,
      address,
      postalCode,
      city,
      role,
      notes,
    } = body;

    if (!firstName || !lastName || !username || !email || !password || !phoneNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }, { phoneNumber }] },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email, username, or phone already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        phoneNumber,
        address,
        postalCode,
        city,
        role: role || "superadmin",
        notes: notes || "",
        isActive: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        phoneNumber: true,
        role: true,
        isActive: true,
      },
    });

    const token = await generateToken(user.id, user.role);

    const res = NextResponse.json(
      { message: "User registered successfully", user, token },
      { status: 201 }
    );

    // ✅ cookie set
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
