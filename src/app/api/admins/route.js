import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/middleware";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const auth = await requireRole(request, ["superadmin"]);
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const admins = await prisma.user.findMany({
            where: { role: "admin" },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                email: true,
                phoneNumber: true,
                city: true,
                isActive: true,
                registrationDate: true,
            },
            orderBy: { registrationDate: "desc" },
        });

        return NextResponse.json({ admins });
    } catch (err) {
        console.error("GET /api/admins error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
