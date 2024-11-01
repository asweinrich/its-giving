import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma'; // Adjust path as needed to your Prisma setup

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  // Validate required fields
  if (!email || !password || !name) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        roles: ['USER'], // Default role
      },
    });

    // Return success response, omitting the password hash
    return NextResponse.json(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
