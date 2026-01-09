// ===============================
// 6) ADMIN LOGIN
// File: app/api/auth/admin/login/route.js
// ===============================
import prisma from "@/lib/prisma";
import { verifyPassword, generateToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        if (!user.isActive) {
            return NextResponse.json({ error: "Account is deactivated" }, { status: 403 });
        }

        const ok = await verifyPassword(password, user.password);
        if (!ok) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = await generateToken(user.id, user.role);
        const { password: _, ...userWithoutPassword } = user;

        const res = NextResponse.json({
            message: "Admin login successful",
            user: userWithoutPassword,
            token,
        });

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return res;
    } catch (error) {
        console.error("Admin login error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
