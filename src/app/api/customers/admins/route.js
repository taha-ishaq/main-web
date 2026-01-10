// src/app/api/customers/admins/route.js
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { requireRole } from "@/lib/middleware";
import { NextResponse } from "next/server";

// SuperAdmin views all admins across all customers
export async function GET(request) {
    try {
        const auth = await requireRole(request, ["superadmin"]);
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const admins = await prisma.user.findMany({
            where: { role: "admin" },
            include: {
                customer: {
                    select: {
                        customer_id: true,
                        customerName: true,
                        isActive: true,
                    }
                }
            },
            orderBy: { registrationDate: "desc" },
        });

        return NextResponse.json({ admins });
    } catch (err) {
        console.error("GET /api/customers/admins error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// SuperAdmin creates new Customer + assigns first Admin
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
            // Customer details
            customerName,
            note,
            
            // Admin user details
            firstName,
            lastName,
            username,
            email,
            password,
            phoneNumber,
            workPhone,
            address,
            postalCode,
            city,
            notes,
        } = body;

        // Validate required fields
        if (!customerName || !firstName || !lastName || !username || !email || !password || !phoneNumber) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if email/username/phone already exists
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }, { phoneNumber }] },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email, username, or phone already exists" },
                { status: 409 }
            );
        }

        // Check if customer name already exists
        const existingCustomer = await prisma.customer.findUnique({
            where: { customerName },
        });

        if (existingCustomer) {
            return NextResponse.json(
                { error: "Customer with this name already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await hashPassword(password);

        // Create Customer and Admin user in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Customer
            const customer = await tx.customer.create({
                data: {
                    customerName,
                    note,
                    createdBy: authResult.user.userId, // SuperAdmin ID
                    isActive: true,
                },
            });

            // 2. Create Admin user for this customer
            const adminUser = await tx.user.create({
                data: {
                    firstName,
                    lastName,
                    username,
                    email,
                    password: hashedPassword,
                    phoneNumber,
                    workPhone,
                    address,
                    postalCode,
                    city,
                    role: "admin",
                    notes: notes || "",
                    isActive: true,
                    customer_id: customer.customer_id, // Link to customer
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
                    customer: {
                        select: {
                            customer_id: true,
                            customerName: true,
                        }
                    }
                },
            });

            return { customer, adminUser };
        });

        return NextResponse.json(
            { 
                message: "Customer and admin created successfully", 
                customer: result.customer,
                admin: result.adminUser
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create customer admin error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}