"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, RefreshCcw } from "lucide-react";

export default function VerifyOTP() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(120); // 2 minutes

  // Redirect if email missing
  useEffect(() => {
    if (!email) router.replace("/auth/forgotPassword");
  }, [email, router]);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);

    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verifyOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Invalid or expired OTP");
      }

      // Go to reset password
      router.push(`/auth/resetPassword?email=${data.email}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);

    try {
      await fetch("/api/auth/forgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setTimer(120);
    } catch {
      setError("Unable to resend OTP. Please try again later.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 px-4">
      <main className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 px-10 py-12 shadow-2xl border-t-8 border-yellow-500">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white">
            OTP Verification
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col gap-6">
          {/* OTP Input */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              One-Time Password
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
              className="w-full text-center tracking-widest text-lg rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
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

          {/* Verify Button */}
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
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Resend */}
        <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          {timer > 0 ? (
            <>Resend available in {timer}s</>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center gap-1 font-medium text-yellow-600 hover:underline dark:text-yellow-400"
            >
              <RefreshCcw className="h-4 w-4" />
              Resend OTP
            </button>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} RSA Construction Sites
        </div>
      </main>
    </div>
  );
}
