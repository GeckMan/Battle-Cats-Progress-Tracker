"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const resp = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      setErr(data?.error ?? "Signup failed.");
      setLoading(false);
      return;
    }

    // Auto-login after signup
    await signIn("credentials", {
      username,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm border rounded-lg p-6">
        <h1 className="text-xl font-semibold">Sign up</h1>
        <p className="text-sm text-gray-500 mt-1">Create a username for your friends to find you.</p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-sm">Username</label>
            <input
              className="mt-1 w-full border rounded-md px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <div className="text-xs text-gray-500 mt-1">3–20 chars, letters/numbers/underscores.</div>
          </div>

          <div>
            <label className="text-sm">Password</label>
            <input
              className="mt-1 w-full border rounded-md px-3 py-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <div className="text-xs text-gray-500 mt-1">At least 8 characters.</div>
          </div>

          {err && <div className="text-sm text-red-600">{err}</div>}

          <button className="w-full rounded-md bg-black text-white py-2 disabled:opacity-50" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="mt-4 text-sm">
          Already have an account?{" "}
          <a className="underline" href="/login">
            Log in
          </a>
        </div>
      </div>
    </div>
  );
}
