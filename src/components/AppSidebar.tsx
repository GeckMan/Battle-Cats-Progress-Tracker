"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

/* ─── Nav items ──────────────────────────────────────────────────────────── */

const NAV_ITEMS = [
  { href: "/dashboard",  label: "Dashboard",  icon: <IconDashboard /> },
  { href: "/story",      label: "Story",       icon: <IconStory /> },
  { href: "/legend",     label: "Legend",      icon: <IconLegend /> },
  { href: "/social",     label: "Social",      icon: <IconSocial /> },
  { href: "/medals",     label: "Medals",      icon: <IconMedals /> },
  { href: "/milestones", label: "Milestones",  icon: <IconMilestones /> },
  { href: "/units",      label: "Units",       icon: <IconUnits /> },
  { href: "/about",      label: "About",       icon: <IconAbout /> },
];

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 flex-shrink-0 h-screen fixed left-0 top-0 bg-black border-r border-gray-800 flex flex-col z-10">

      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-gray-800">
        <div className="text-amber-400 font-bold text-sm tracking-widest uppercase">
          Battle Cats
        </div>
        <div className="text-gray-600 text-xs mt-0.5">Progress Tracker</div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            active={pathname === item.href}
            icon={item.icon}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: Settings + Logout */}
      <div className="px-2 py-3 border-t border-gray-800 space-y-0.5">
        <NavLink href="/settings" active={pathname === "/settings"} icon={<IconSettings />}>
          Settings
        </NavLink>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded text-left text-sm text-gray-500 hover:bg-gray-900 hover:text-gray-200 transition-colors"
        >
          <span className="text-gray-600 flex-shrink-0">
            <IconLogout />
          </span>
          Logout
        </button>
      </div>
    </aside>
  );
}

/* ─── NavLink ─────────────────────────────────────────────────────────────── */

function NavLink({
  href,
  active,
  icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
        active
          ? "bg-amber-950 text-amber-200 border border-amber-800"
          : "text-gray-400 border border-transparent hover:bg-gray-900 hover:text-gray-200"
      }`}
    >
      <span className={`flex-shrink-0 ${active ? "text-amber-400" : "text-gray-600"}`}>
        {icon}
      </span>
      {children}
    </Link>
  );
}

/* ─── Icons (16×16 inline SVG) ───────────────────────────────────────────── */

function IconDashboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="1" y="1" width="6" height="6" rx="1" />
      <rect x="9" y="1" width="6" height="6" rx="1" />
      <rect x="1" y="9" width="6" height="6" rx="1" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  );
}

function IconStory() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 2h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
      <line x1="5" y1="5" x2="11" y2="5" />
      <line x1="5" y1="8" x2="11" y2="8" />
      <line x1="5" y1="11" x2="9" y2="11" />
    </svg>
  );
}

function IconLegend() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1.5 9.5 6H14l-3.7 2.7 1.4 4.3L8 10.3l-3.7 2.7 1.4-4.3L2 6h4.5z" />
    </svg>
  );
}

function IconSocial() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="6" cy="5" r="2.5" />
      <path d="M1 13c0-2.5 2.2-4 5-4s5 1.5 5 4H1z" />
      <circle cx="12" cy="5" r="2" />
      <path d="M10.5 10c.8-.2 3.5.4 3.5 3h-2.3" />
    </svg>
  );
}

function IconMedals() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="8" cy="10" r="4.5" />
      <path d="M5.5 2h5l-1 3H6.5z" />
      <circle cx="8" cy="10" r="2.5" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function IconMilestones() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="2" y="2.5" width="4" height="4" rx="0.5" />
      <polyline points="3,4.5 4.2,6 6,3.5" />
      <line x1="8" y1="4.5" x2="14" y2="4.5" />
      <rect x="2" y="9.5" width="4" height="4" rx="0.5" />
      <line x1="8" y1="11.5" x2="14" y2="11.5" />
    </svg>
  );
}

function IconUnits() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="4"  cy="5"  r="2.2" />
      <circle cx="12" cy="5"  r="2.2" />
      <circle cx="4"  cy="12" r="2.2" />
      <circle cx="12" cy="12" r="2.2" />
      <circle cx="8"  cy="8.5"  r="2.5" />
    </svg>
  );
}

function IconActivity() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1,8 4,8 6,3 8,13 10,6 12,8 15,8" />
    </svg>
  );
}

function IconAbout() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="8" cy="8" r="6" />
      <line x1="8" y1="7.5" x2="8" y2="11" />
      <circle cx="8" cy="5.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm0 1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
      <path d="M6.8 1.2 6 3H5L3.5 4.5l.8 1.7L3 8l1.3 1.8-.8 1.7L5 13h1l.8 1.8 2 .2 1.2-2h1L12.5 11.5l-.8-1.7L13 8l-1.3-1.8.8-1.7L11 3h-1L9.2 1.2l-2.4.0z" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M6 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3" />
      <polyline points="10,5 13,8 10,11" />
      <line x1="13" y1="8" x2="5" y2="8" />
    </svg>
  );
}
