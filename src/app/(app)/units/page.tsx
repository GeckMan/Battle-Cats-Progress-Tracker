import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { UNIT_CATEGORY_META } from "@/lib/unit-catalog";
import UnitsClient from "./UnitsClient";

export default async function UnitsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const categories = Object.entries(UNIT_CATEGORY_META).map(([key, meta]) => ({
    key,
    label: meta.label,
  }));

  return <UnitsClient categories={categories} />;
}
