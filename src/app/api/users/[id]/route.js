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

    // Users can view their own profile OR admins/superadmins can view anyone
    const currentUser = authResult.user;
    const isViewingSelf = currentUser.userId === userId;
    const canViewOthers = ['superadmin', 'admin', 'manager'].includes(currentUser.role);

    if (!isViewingSelf && !canViewOthers) {
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
        address: true,
        postalCode: true,
        city: true,
        role: true,
        isActive: true,
        notes: true,
        registrationDate: true,
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
    const canUpdateOthers = ['superadmin', 'admin'].includes(currentUser.role);

    // Users can update their own profile
    // Only superadmin/admin can update others
    if (!isUpdatingSelf && !canUpdateOthers) {
      return Response.json(
        { error: 'Forbidden - You can only update your own profile' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { password, role, ...updateData } = body;

    // Prevent non-superadmins from changing roles
    if (role && currentUser.role !== 'superadmin') {
      return Response.json(
        { error: 'Forbidden - Only superadmin can change roles' },
        { status: 403 }
      );
    }

    // Get target user to check their role
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!targetUser) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent admins from editing superadmins
    if (currentUser.role === 'admin' && targetUser.role === 'superadmin') {
      return Response.json(
        { error: 'Forbidden - Admins cannot edit superadmins' },
        { status: 403 }
      );
    }

    // Hash password if provided
    if (password) {
      updateData.password = await hashPassword(password);
    }

    // Add role if superadmin is changing it
    if (role && currentUser.role === 'superadmin') {
      updateData.role = role;
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

// DELETE user - Only superadmin and admin
export async function DELETE(request, context) {
  try {

    const authResult = await requireRole(request, ['superadmin', 'admin']);

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

    // Prevent deleting your own account
    if (authResult.user.userId === userId) {
      return Response.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Get target user to check their role
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!targetUser) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent admins from deleting superadmins
    if (authResult.user.role === 'admin' && targetUser.role === 'superadmin') {
      return Response.json(
        { error: 'Forbidden - Admins cannot delete superadmins' },
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