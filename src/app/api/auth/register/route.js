import prisma from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
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
      role,
      notes
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !username || !email || !password || !phoneNumber) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
          { phoneNumber }
        ]
      }
    });

    if (existingUser) {
      return Response.json(
        { error: 'User with this email, username, or phone already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
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
        role: role || 'superadmin',
        notes: notes || '',
        isActive: true
      },
      // return only necessary fields
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        phoneNumber: true,
        role: true,
        isActive: true
      }
    });

    // Generate token
    const token = await generateToken(user.id, user.role);

    return Response.json({
      message: 'User registered successfully',
      user,
      token
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


// import pool from '@/lib/prisma';
// import { hashPassword, generateToken } from '@/lib/auth';

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { 
//       firstName, 
//       lastName, 
//       username, 
//       email, 
//       password, 
//       phoneNumber,
//       address,
//       postalCode,
//       city,
//       role,
//       notes
//     } = body;

//     // Validate required fields
//     if (!firstName || !lastName || !username || !email || !password || !phoneNumber) {
//       return Response.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       );
//     }

//     // Check if user already exists - USING RAW SQL
//     const [rows] = await pool.query(
//       'SELECT * FROM User WHERE email = ? OR username = ? OR phoneNumber = ? LIMIT 1',
//       [email, username, phoneNumber]
//     );
    
//     const existingUser = rows[0];

//     if (existingUser) {
//       return Response.json(
//         { error: 'User with this email, username, or phone already exists' },
//         { status: 409 }
//       );
//     }

//     // Hash password
//     const hashedPassword = await hashPassword(password);

//     // Create user - USING RAW SQL
// const now = new Date();
// const [result] = await pool.query(
//   `INSERT INTO User (firstName, lastName, username, email, password, phoneNumber, address, postalCode, city, role, notes, isActive, registrationDate, updatedAt) 
//    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//   [firstName, lastName, username, email, hashedPassword, phoneNumber, address || '', postalCode || '', city || '', role || 'superadmin', notes || '', true, now, now]
// );

//     const user = {
//       id: result.insertId,
//       firstName,
//       lastName,
//       username,
//       email,
//       phoneNumber,
//       role: role || 'superadmin'
//     };

//     // Generate token
//     const token = await generateToken(user.id, user.role);

//     return Response.json({
//       message: 'User registered successfully',
//       user,
//       token
//     }, { status: 201 });

//   } catch (error) {
//     console.error('Registration error:', error);
//     return Response.json(
//       { error: 'Internal server error', details: error.message },
//       { status: 500 }
//     );
//   }
// }