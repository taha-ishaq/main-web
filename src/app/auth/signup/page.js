"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Signup() {
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

    // Collect all fields
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const phoneNumber = form.phoneNumber.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    // Client-side validation
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    // ✅ Validate proper email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Validate phone number format
    // const phoneRegex = /^\+?[0-9]{7,15}$/;
    // if (!phoneRegex.test(phoneNumber)) {
    //   setError("Please enter a valid phone number");
    //   setLoading(false);
    //   return;
    // }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          phoneNumber,
          password,
          address: "", // optional
          postalCode: "", // optional
          city: "", // optional
          notes: "", // optional
          role: "", // optional
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          throw new Error(
            "A user with this email, username, or phone already exists"
          );
        }
        if (res.status === 400) {
          throw new Error(data?.error || "Missing required fields");
        }
        throw new Error(
          data?.error || "Unable to create account. Please try again."
        );
      }

      // Successful registration → redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 px-4 py-12">
      <main className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 px-10 py-12 shadow-2xl border-t-8 border-yellow-500">
        {/* Brand */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white">
            RSA <span className="text-yellow-500">Construction</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Create your professional account
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
          noValidate
        >
          {/* First & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                required
                placeholder="John"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                required
                placeholder="Doe"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          {/* Username & Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Username
              </label>
              <input
                type="text"
                name="username"
                required
                placeholder="johndoe"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                required
                placeholder="+1234567890"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
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
              required
              placeholder="admin@rsa.com"
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 pr-10 text-sm outline-none transition focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2  text-zinc-500 hover:text-yellow-500"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="relative">
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 pr-10 text-sm outline-none transition focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-3 top-1/2  text-zinc-500 hover:text-yellow-500"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
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
            className={`mt-2 flex h-12 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition ${
              loading
                ? "cursor-not-allowed bg-zinc-400 text-white dark:bg-zinc-700"
                : "bg-yellow-500 text-black hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
            }`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
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
