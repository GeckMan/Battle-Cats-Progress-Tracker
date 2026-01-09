import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
  const usernameRaw = String(credentials?.username ?? "").trim();
  const password = String(credentials?.password ?? "");

  if (!usernameRaw || !password) return null;

  // Case-insensitive lookup so old accounts and mixed-case usernames still work
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: usernameRaw,
        mode: "insensitive",
      },
    },
  });

  if (!user) return null;

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  return {
    id: user.id,
    name: user.displayName ?? user.username,
  };
}
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        // @ts-expect-error
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
