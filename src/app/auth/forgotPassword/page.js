"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Mail } from "lucide-react";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Something went wrong. Please try again.");
      }

      // ✅ Redirect to Verify OTP page with email in query
      router.push(`/auth/verifyOTP?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to process request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 px-4">
      <main className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 px-10 py-12 shadow-2xl border-t-8 border-yellow-500">
        {/* Brand */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white">
            RSA <span className="text-yellow-500">Construction</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Password Recovery
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
          noValidate
        >
          {/* Email */}
          <div className="relative">
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@rsa.com"
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 pr-10 text-sm outline-none transition focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-400"
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`flex h-12 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition ${
              loading
                ? "cursor-not-allowed bg-zinc-400 text-white dark:bg-zinc-700"
                : "bg-yellow-500 text-black hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
            }`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Remembered your password?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-yellow-600 hover:underline dark:text-yellow-400"
          >
            Sign in
          </Link>
        </div>

        <div className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} RSA Construction Sites
        </div>
      </main>
    </div>
  );
}
