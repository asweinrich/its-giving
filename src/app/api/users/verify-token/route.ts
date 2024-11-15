import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  const token = request.headers.get("cookie")?.split(";").find((c) => c.trim().startsWith("token="))?.split("=")[1];

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!); // Decode and verify token
    return NextResponse.json({ authenticated: true, user: decoded });
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
