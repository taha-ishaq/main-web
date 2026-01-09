"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // should be passed from verifyOTP page

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Failed to reset password");

      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Invalid reset link</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 px-4">
      <main className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 px-10 py-12 shadow-2xl border-t-8 border-yellow-500">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white">
            Reset Password
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Enter a new secure password
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
          noValidate
        >
          {/* New Password */}
          <div className="relative">
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 pr-10 text-sm outline-none transition focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-yellow-500"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 pr-10 text-sm outline-none transition focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-yellow-500"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
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

          {/* Success */}
          {success && (
            <div
              role="alert"
              className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/40 dark:text-green-400"
            >
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 flex h-12 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition ${
              loading
                ? "cursor-not-allowed bg-zinc-400 text-white dark:bg-zinc-700"
                : "bg-yellow-500 text-black hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
            }`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </main>
    </div>
  );
}
