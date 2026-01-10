// src/app/api/auth/superadmin/register/route.js
import prisma from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            name,
            email,
            password,
        } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existingSuperAdmin = await prisma.superAdmin.findUnique({
            where: { email },
        });

        if (existingSuperAdmin) {
            return NextResponse.json(
                { error: "SuperAdmin with this email already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await hashPassword(password);

        const superAdmin = await prisma.superAdmin.create({
            data: {
                name,
                email,
                password: hashedPassword,
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                createdAt: true,
            },
        });

        // No customer_id for SuperAdmin
        const token = await generateToken(superAdmin.id, "superadmin");

        const res = NextResponse.json(
            { message: "Superadmin registered successfully", user: superAdmin, token },
            { status: 201 }
        );

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return res;
    } catch (error) {
        console.error("Superadmin registration error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}