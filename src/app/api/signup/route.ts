import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

function normalizeUsername(raw: string) {
  return raw.trim().toLowerCase();
}

export async function POST(req: Request) {
  try {
    // Rate limit: 5 signups per hour per IP
    const ip = getClientIp(req);
    const rl = await checkRateLimit(`signup:${ip}`, 5, 60 * 60 * 1000);
    if (rl.limited) return rateLimitResponse(rl.retryAfterMs);

    const body = await req.json();

    const usernameRaw = String(body.username ?? "");
    const password = String(body.password ?? "");

    const username = normalizeUsername(usernameRaw);

    // ---- Validation ----
    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { error: "Username must be 3–20 characters." },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: "Username may only contain letters, numbers, and underscores." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    // ---- Case-insensitive duplicate check ----
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username is already taken." },
        { status: 409 }
      );
    }

    // ---- Create user ----
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username, // stored normalized (lowercase)
        passwordHash,
        privacy: {
          create: {
            profileVisibility: "PUBLIC",
            progressVisibility: "FRIENDS",
          },
        },
      },
      select: {
        id: true,
        username: true,
      },
    });

    return NextResponse.json({ ok: true, user });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
