import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/middleware';

export async function GET(request) {
  try {
    // Only superadmin and admin can view all users
    const authResult = await requireRole(request, ['superadmin', 'admin']);
    
    if (authResult.error) {
      return Response.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        phoneNumber: true,
        role: true,
        isActive: true,
        registrationDate: true
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