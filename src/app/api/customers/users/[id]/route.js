// src/app/api/customers/users/[id]/route.js
import prisma from '@/lib/prisma';
import { requireAuth, requireRole } from '@/lib/middleware';
import { hashPassword } from '@/lib/auth';

// GET single user
export async function GET(request, context) {
  try {
    const authResult = await requireAuth(request);

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

    const currentUser = authResult.user;
    const isViewingSelf = currentUser.userId === userId;
    const isAdmin = currentUser.role === 'admin';

    if (!isViewingSelf && !isAdmin) {
      return Response.json(
        { error: 'Forbidden - You can only view your own profile' },
        { status: 403 }
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
        customer_id: true, // Added
        customer: {
          select: {
            customerName: true,
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

    // CRITICAL: Check if admin is trying to view user from another company
    if (isAdmin && user.customer_id !== currentUser.customer_id) {
      return Response.json(
        { error: 'Forbidden - You can only view users from your company' },
        { status: 403 }
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

// UPDATE user
export async function PATCH(request, context) {
  try {
    const authResult = await requireAuth(request);

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

    const currentUser = authResult.user;
    const isUpdatingSelf = currentUser.userId === userId;
    const isAdmin = currentUser.role === 'admin';

    if (!isUpdatingSelf && !isAdmin) {
      return Response.json(
        { error: 'Forbidden - You can only update your own profile' },
        { status: 403 }
      );
    }

    // Get target user to check permissions
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true,
        role: true,
        customer_id: true, // Added
      }
    });

    if (!targetUser) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // CRITICAL: Check if admin is trying to update user from another company
    if (isAdmin && targetUser.customer_id !== currentUser.customer_id) {
      return Response.json(
        { error: 'Forbidden - You can only update users from your company' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { password, role, ...updateData } = body;

    // Admins can change roles
    if (role) {
      if (!isAdmin) {
        return Response.json(
          { error: 'Forbidden - Only admin can change roles' },
          { status: 403 }
        );
      }

      // Prevent admins from promoting someone to admin
      if (role === 'admin') {
        return Response.json(
          { error: 'Forbidden - Only superadmin can create admin users' },
          { status: 403 }
        );
      }

      updateData.role = role;
    }

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

// DELETE user - Only admin
export async function DELETE(request, context) {
  try {
    const authResult = await requireRole(request, ['admin']);

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

    const currentUser = authResult.user;

    // Prevent deleting your own account
    if (currentUser.userId === userId) {
      return Response.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true,
        customer_id: true, // Added
      }
    });

    if (!targetUser) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // CRITICAL: Check if admin is trying to delete user from another company
    if (targetUser.customer_id !== currentUser.customer_id) {
      return Response.json(
        { error: 'Forbidden - You can only delete users from your company' },
        { status: 403 }
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