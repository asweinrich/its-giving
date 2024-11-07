import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { verificationToken: token } });

  if (!user) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      verificationToken: null, // Clear the token after verification
    },
  });

  return NextResponse.redirect(`/dashboard/${user.id}/setup`);
}
