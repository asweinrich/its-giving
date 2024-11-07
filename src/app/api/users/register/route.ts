import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma'; // Adjust path as needed to your Prisma setup
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';



export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Validate required fields
  if (!email || !password+) {
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
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        authMethod: 'email',
        roles: ['USER'], // Default role
        verificationToken, 
      },
    });

    // Send the verification email
    await sendVerificationEmail(email, verificationToken, newUser.id);


    // Return user ID without redirecting
    return NextResponse.json({ userId: newUser.id, message: 'User registered successfully' }, { status: 201 });

  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
