// =============================================
// File: app/auth/superadmin/register/page.js
// (If you're using src/app, then: src/app/auth/superadmin/register/page.js)
// =============================================
"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ShieldPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuperAdminRegister() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const form = e.currentTarget;

        const firstName = form.firstName.value.trim();
        const lastName = form.lastName.value.trim();
        const username = form.username.value.trim();
        const email = form.email.value.trim();
        const phoneNumber = form.phoneNumber.value.trim();
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;

        const address = form.address.value.trim();
        const postalCode = form.postalCode.value.trim();
        const city = form.city.value.trim();
        const notes = form.notes.value.trim();

        // Validation
        const errs = [];
        if (!firstName) errs.push("First name is required");
        if (!lastName) errs.push("Last name is required");
        if (!username) errs.push("Username is required");
        if (!email) errs.push("Email is required");
        if (!phoneNumber) errs.push("Phone number is required");
        if (!password) errs.push("Password is required");
        if (!confirmPassword) errs.push("Confirm password is required");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) errs.push("Email format is invalid");

        if (password && confirmPassword && password !== confirmPassword) {
            errs.push("Passwords do not match");
        }

        if (errs.length) {
            setError(errs.join(", "));
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/superadmin/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    username,
                    email,
                    phoneNumber,
                    password,
                    address,
                    postalCode,
                    city,
                    notes,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 409) {
                    throw new Error("A user with this email, username, or phone already exists");
                }
                throw new Error(data?.error || "Unable to create superadmin account");
            }

            // ✅ cookie set by backend route
            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 px-4 py-12">
            <main className="w-full max-w-2xl rounded-3xl bg-white dark:bg-zinc-900 px-10 py-12 shadow-2xl border-t-8 border-red-600">
                {/* Brand */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/10">
                        <ShieldPlus className="h-6 w-6 text-red-600" />
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white">
                        Create <span className="text-red-600">Superadmin</span>
                    </h1>

                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        Temporary setup page — delete later when done
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                    {/* Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Super"
                                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Admin"
                                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Username + Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                placeholder="superadmin"
                                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="+923001234567"
                                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="superadmin@rsa.com"
                            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                        />
                    </div>

                    {/* Optional details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Address (optional)
                            </label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Street..."
                                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Postal Code (optional)
                            </label>
                            <input
                                type="text"
                                name="postalCode"
                                placeholder="54000"
                                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                City (optional)
                            </label>
                            <input
                                type="text"
                                name="city"
                                placeholder="Lahore"
                                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Notes (optional)
                        </label>
                        <textarea
                            name="notes"
                            placeholder="Temporary superadmin setup..."
                            rows={3}
                            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                        />
                    </div>

                    {/* Passwords */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 pr-10 text-sm outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((p) => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-red-600"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        <div className="relative">
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Confirm Password
                            </label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 pr-10 text-sm outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((p) => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-red-600"
                                aria-label="Toggle confirm password visibility"
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
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
                        {loading ? "Creating..." : "Create Superadmin"}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    Already have a superadmin?{" "}
                    <Link
                        href="/auth/superadmin/login"
                        className="font-medium text-red-600 hover:underline"
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
