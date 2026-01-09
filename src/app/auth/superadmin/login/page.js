"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuperAdminLogin() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const form = e.currentTarget;
        const email = form.email.value.trim();
        const password = form.password.value;

        // ✅ Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errs = [];

        if (!email) errs.push("Email is required");
        else if (!emailRegex.test(email)) errs.push("Email format is invalid");

        if (!password) errs.push("Password is required");

        if (errs.length) {
            setError(errs.join(", "));
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/superadmin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || "Invalid email or password");
            }

            // ✅ cookie set by backend route; now go to dashboard
            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 px-4">
            <main className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 px-10 py-12 shadow-2xl border-t-8 border-red-600">
                {/* Brand */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/10">
                        <Shield className="h-6 w-6 text-red-600" />
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white">
                        RSA <span className="text-red-600">Superadmin</span>
                    </h1>

                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        High-privilege secure portal
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                    {/* Email */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="superadmin@rsa.com"
                            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 pr-10 text-sm outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((p) => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-red-600"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* ✅ Forgot Password Link (same as normal login) */}
                    <div className="text-center">
                        <Link
                            href="/auth/forgotPassword"
                            className="text-sm font-medium text-red-600 hover:underline"
                        >
                            Forgot Password?
                        </Link>
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
                        className={`mt-2 flex h-12 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition ${loading
                                ? "cursor-not-allowed bg-zinc-400 text-white dark:bg-zinc-700"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {loading ? "Signing in..." : "Sign In (Superadmin)"}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    Go to normal login?{" "}
                    <Link href="/auth/login" className="font-medium text-red-600 hover:underline">
                        User login
                    </Link>
                </div>

                <div className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
                    © {new Date().getFullYear()} RSA Construction Sites
                </div>
            </main>
        </div>
    );
}
