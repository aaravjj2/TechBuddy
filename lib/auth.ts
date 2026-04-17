// lib/auth.ts
// NextAuth v5 setup with a Credentials provider for SENIOR / INSTRUCTOR
// accounts. JWT session strategy (works alongside Prisma without needing the
// adapter + SQLite session table for the credentials flow). Roles carried in
// the JWT so middleware and Server Components can gate routes synchronously.

import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "SENIOR" | "INSTRUCTOR" | "ADMIN";
      centerId?: string | null;
    } & DefaultSession["user"];
  }
  interface User {
    id?: string;
    role?: "SENIOR" | "INSTRUCTOR" | "ADMIN";
    centerId?: string | null;
  }
}

// NOTE: next-auth v5 beta doesn't ship a separate "next-auth/jwt" subpath, so we
// attach our custom claims directly to the token via `as` casts in the callbacks
// below. That keeps us on the supported v5 surface and avoids a module-augment
// error during tsc.

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Credentials({
      name: "Email + Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email ?? undefined,
          name: user.name ?? undefined,
          role: user.role as "SENIOR" | "INSTRUCTOR" | "ADMIN",
          centerId: user.centerId ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const t = token as typeof token & {
        uid?: string;
        role?: "SENIOR" | "INSTRUCTOR" | "ADMIN";
        centerId?: string | null;
      };
      if (user) {
        t.uid = user.id as string;
        t.role = (user as { role?: "SENIOR" | "INSTRUCTOR" | "ADMIN" }).role;
        t.centerId = (user as { centerId?: string | null }).centerId ?? null;
      }
      return t;
    },
    async session({ session, token }) {
      const t = token as typeof token & {
        uid?: string;
        role?: "SENIOR" | "INSTRUCTOR" | "ADMIN";
        centerId?: string | null;
      };
      if (t.uid) session.user.id = t.uid;
      if (t.role) session.user.role = t.role;
      session.user.centerId = t.centerId ?? null;
      return session;
    },
  },
});
