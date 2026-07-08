import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";

/**
 * Extract the client IP from next-auth's internal request object.
 * On Vercel, x-forwarded-for is set to a single trustworthy IP (Vercel
 * overwrites this header and does not forward externally-supplied
 * values), so taking the first entry is safe.
 */
function extractIp(req: unknown): string {
  try {
    const headers = (req as { headers?: unknown } | undefined)?.headers as
      | { get?: (name: string) => string | null; [key: string]: unknown }
      | undefined;
    if (!headers) return "unknown";

    let raw: unknown = typeof headers.get === "function"
      ? headers.get("x-forwarded-for")
      : (headers["x-forwarded-for"] ?? headers["X-Forwarded-For"]);

    if (Array.isArray(raw)) raw = raw[0];
    if (!raw || typeof raw !== "string") return "unknown";
    return raw.split(",")[0].trim();
  } catch {
    return "unknown";
  }
}

/** Record a login attempt for audit purposes. Never logs the password. */
async function logLoginAttempt(username: string, ip: string, success: boolean) {
  try {
    // @ts-ignore – LoginAttempt model added in new migration
    await (prisma as any).loginAttempt.create({
      data: { username, ip, success },
    });

    // Fire-and-forget cleanup of entries older than 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    // @ts-ignore
    (prisma as any).loginAttempt
      .deleteMany({ where: { createdAt: { lt: thirtyDaysAgo } } })
      .catch(() => {});
  } catch {
    // Never let audit logging break the actual login flow
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
  const usernameRaw = String(credentials?.username ?? "").trim();
  const password = String(credentials?.password ?? "");
  const ip = extractIp(req);

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

  if (!user) {
    await logLoginAttempt(usernameRaw.toLowerCase(), ip, false);
    return null;
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  await logLoginAttempt(usernameRaw.toLowerCase(), ip, ok);
  if (!ok) return null;

  return {
    id: user.id,
    name: user.displayName ?? user.username,
    role: user.role ?? "USER",
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
      if ((user as any)?.role) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        (session.user as any).role = (token.role as string) ?? "USER";
      }
      return session;
    },
  },
};
