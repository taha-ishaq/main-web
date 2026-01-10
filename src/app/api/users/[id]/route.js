// src/app/api/users/[id]/route.js
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/middleware';
import { hashPassword } from '@/lib/auth';

// GET single user - SUPERADMIN ONLY
export async function GET(request, context) {
  try {
    const authResult = await requireRole(request, ['superadmin']);

    if (authResult.error) {
      return Response.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { params } = context;
    const { id } = await params;

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return Response.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        phoneNumber: true,
        workPhone: true,
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
            customer_id: true,
            customerName: true,
            isActive: true,
          }
        }
      },
    });

    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// UPDATE user - SUPERADMIN ONLY
export async function PATCH(request, context) {
  try {
    const authResult = await requireRole(request, ['superadmin']);

    if (authResult.error) {
      return Response.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { params } = context;
    const { id } = await params;

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return Response.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { password, ...updateData } = body;

    // Hash password if provided
    if (password) {
      updateData.password = await hashPassword(password);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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
            customerName: true,
          }
        }
      },
    });

    return Response.json({
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE user - SUPERADMIN ONLY
export async function DELETE(request, context) {
  try {
    const authResult = await requireRole(request, ['superadmin']);

    if (authResult.error) {
      return Response.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { params } = context;
    const { id } = await params;

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return Response.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return Response.json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}