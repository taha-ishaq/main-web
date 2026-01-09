// ===============================
// 5) ADMIN REGISTER (ONLY SUPERADMIN CAN CREATE)
// File: app/api/auth/admin/register/route.js
// ===============================
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { requireRole } from "@/lib/middleware";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const authResult = await requireRole(request, ["superadmin"]);
        if (authResult.error) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status }
            );
        }

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
                role: "admin",
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

        return NextResponse.json(
            { message: "Admin created successfully", user },
            { status: 201 }
        );
    } catch (error) {
        console.error("Admin create error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
