// src/app/api/customers/users/route.js
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/middleware';
import { hashPassword } from "@/lib/auth";

export async function GET(request) {
  try {
    // Only admin can view all users in their company
    const authResult = await requireRole(request, ['admin']);
    
    if (authResult.error) {
      return Response.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // Get the logged-in admin's customer_id
    const loggedInUser = authResult.user;
    
    // Filter users by the admin's customer_id
    const users = await prisma.user.findMany({
      where: {
        customer_id: loggedInUser.customer_id, // Filter by company
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
        registrationDate: true,
        customer: {
          select: {
            customerName: true
          }
        }
      },
      orderBy: {
        registrationDate: 'desc'
      }
    });

    return Response.json({ users });

  } catch (error) {
    console.error('Get users error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new user (admin adds user to their company)
export async function POST(request) {
  try {
    const authResult = await requireRole(request, ['admin']);
    
    if (authResult.error) {
      return Response.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const body = await request.json();
    const { firstName, lastName, username, email, password, phoneNumber, role, workPhone, address, postalCode, city, notes } = body;

    // Validate required fields
    if (!firstName || !lastName || !username || !email || !password || !phoneNumber) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with the admin's customer_id
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        phoneNumber,
        role: role || 'employeeAdministrator',
        workPhone,
        address,
        postalCode,
        city,
        notes,
        customer_id: authResult.user.customer_id, //Assign's to admin's company
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
            customerName: true
          }
        }
      }
    });

    return Response.json({
      message: 'User created successfully',
      user
    }, { status: 201 });

  } catch (error) {
    console.error('Create user error:', error);
    
    if (error.code === 'P2002') {
      return Response.json(
        { error: 'Username, email, or phone number already exists' },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}