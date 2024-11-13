import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust based on your Prisma client location

export async function POST(request: Request) {
  const data = await request.json();
  console.log("Received data:", data); // Debugging line
  const { user_id, username, name, imageUrl, bio, phoneNumber } = data;

  // Validate required fields
  if (!user_id || !username || !name) {
    return NextResponse.json(
      { error: "User ID, username, and name are required" },
      { status: 400 }
    );
  }

  try {
    // Update user information in the database
    const updatedUser = await prisma.user.update({
      where: { id: Number(user_id) }, // Use userId to locate the record
      data: {
        username,
        name,
        imageUrl,
        bio,
        phoneNumber,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user information" },
      { status: 500 }
    );
  }
}
