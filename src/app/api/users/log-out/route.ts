import { NextResponse } from "next/server";

export async function GET() {
  // Clear the token cookie
  const response = NextResponse.redirect(new URL("/log-in", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));

  // Expire the token by setting the cookie to an empty value and immediate expiry
  response.cookies.set("token", "", { maxAge: -1, path: "/" });

  return response;
}
