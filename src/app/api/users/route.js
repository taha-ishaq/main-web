import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/middleware';

export async function GET(request) {
  try {
    // Only superadmin can view all users across all companies
    const authResult = await requireRole(request, ['superadmin']);
    
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