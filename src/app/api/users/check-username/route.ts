import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust the import based on your Prisma client location

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  // Return an error if username is missing
  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  // Check if username exists in the database
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  const available = existingUser ? false : true;

  return NextResponse.json({ available });
}
