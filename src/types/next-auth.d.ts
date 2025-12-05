import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    roles?: string[];
    emailVerified?: boolean;
  }

  interface Session {
    user: {
      roles?: string[];
      emailVerified?: boolean;
      id?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles?: string[];
    emailVerified?: boolean;
    sub?: string; // For user id
  }
}