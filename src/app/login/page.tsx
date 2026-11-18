"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Show NextAuth's ?error=... if we land here from a redirect (e.g. an old link).
  useEffect(() => {
    const e = new URLSearchParams(window.location.search).get("error");
    if (e) setErr(e === "CredentialsSignin" ? "Invalid username or password." : "Couldn't log in. Please try again.");
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    // redirect:false so a failed login shows a message here instead of silently
    // reloading the form (it used redirect:true and never read the error).
    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });
      if (res?.ok && !res.error) {
        window.location.href = res.url ?? "/dashboard";
        return;
      }
      setErr(
        res?.status === 429
          ? "Too many login attempts. Please wait a few minutes and try again."
          : "Invalid username or password."
      );
    } catch {
      // The login rate limiter answers 429 without the JSON NextAuth expects.
      setErr("Too many login attempts or a connection problem. Please wait a minute and try again.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm border rounded-lg p-6">
        <h1 className="text-xl font-semibold">Log in</h1>
        <p className="text-sm text-gray-500 mt-1">Use your username and password.</p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label htmlFor="login-u" className="text-sm">Username</label>
            <input
              id="login-u"
              className="mt-1 w-full border rounded-md px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="login-p" className="text-sm">Password</label>
            <input
              id="login-p"
              className="mt-1 w-full border rounded-md px-3 py-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {err && <div role="alert" className="text-sm text-red-400">{err}</div>}

          <button
            className="w-full rounded-md bg-amber-600 hover:bg-amber-500 text-black font-semibold py-2.5 disabled:opacity-50 transition-colors"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="mt-4 text-sm">
          No account yet?{" "}
          <a className="underline" href="/signup">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}

