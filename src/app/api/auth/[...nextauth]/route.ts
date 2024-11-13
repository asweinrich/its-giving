import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    // Google Sign-In
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    }),
    // Email/Password Sign-In
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (user && (await bcrypt.compare(credentials.password, user.passwordHash))) {
          return { id: user.id, email: user.email, name: user.name, roles: user.roles };
        }
        return null;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.roles = token.roles;
      session.user.emailVerified = token.emailVerified; // Add email verification status to session
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.roles = user.roles;
        token.emailVerified = user.emailVerified; // Add email verification status to token
      }
      return token;
    },
    async signIn({ user, account }) {
      if (account.provider === 'google') {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        // If the Google user doesn't have a username, redirect to setup
        if (dbUser && !dbUser.username) {
          return `/dashboard/${dbUser.id}/setup`; // Redirect new Google users to the setup page
        }
      } else if (!user.emailVerified) {
        // For email/password users, ensure email is verified before sign-in
        return `/dashboard/${user.id}/setup`; // Prevent full access sign-in if email not verified
      }
      return true; // Proceed with sign-in if all is well
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
