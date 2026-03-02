"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function AppHeader() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `px-3 py-2 rounded border border-gray-700 text-sm ${
      pathname === href
        ? "bg-gray-700 text-white"
        : "bg-gray-900 text-gray-200 hover:bg-gray-800"
    }`;

  return (
    <div className="w-full border-b border-gray-800 bg-black">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left nav */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>
          <Link href="/story" className={linkClass("/story")}>
            Story
          </Link>
          <Link href="/legend" className={linkClass("/legend")}>
            Legend
          </Link>
          <Link href="/social" className={linkClass("/social")}>
            Social
          </Link>
          <Link href="/medals" className={linkClass("/medals")}>
            Medals
          </Link>
          <Link href="/milestones" className={linkClass("/milestones")}>
            Milestones
          </Link>
          <Link href="/about" className={linkClass("/about")}>
            About
          </Link>
        </div>

        {/* Right actions */}
        <button
          type="button"
          className="px-3 py-2 rounded border border-gray-700 text-sm bg-gray-900 text-gray-200 hover:bg-gray-800"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
