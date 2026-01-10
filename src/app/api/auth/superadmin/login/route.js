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

        const superAdmin = await prisma.superAdmin.findUnique({ where: { email } });

        if (!superAdmin) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        if (!superAdmin.isActive) {
            return NextResponse.json({ error: "Account is deactivated" }, { status: 403 });
        }

        const ok = await verifyPassword(password, superAdmin.password);
        if (!ok) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = await generateToken(superAdmin.id, "superadmin");
        
        const { password: _, ...superAdminWithoutPassword } = superAdmin;

        const res = NextResponse.json({
            message: "Superadmin login successful",
            user: superAdminWithoutPassword,
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
        console.error("Superadmin login error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}