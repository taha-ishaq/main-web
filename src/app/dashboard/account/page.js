"use client";

import { useState } from "react";

export default function Account() {
  // Dummy user data (replace with API data in production)
  const [user, setUser] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@rsa.com",
    phone: "+1234567890",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Normally, call API to update user info
    setTimeout(() => {
      setLoading(false);
      setSuccess("Account information updated successfully!");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Account Settings
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Manage your account information and update your credentials.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-700">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-white mb-4">
          Personal Information
        </h2>

        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          {/* First Name */}
          <input
            type="text"
            placeholder="First Name"
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />

          {/* Last Name */}
          <input
            type="text"
            placeholder="Last Name"
            value={user.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />

          {/* Phone */}
          <input
            type="tel"
            placeholder="Phone Number"
            value={user.phone}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="New Password"
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />

          {/* Status Messages */}
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/40 dark:text-green-400">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-max rounded-lg bg-yellow-500 px-5 py-2 text-sm font-semibold text-black hover:bg-yellow-600 dark:bg-yellow-600 dark:text-white dark:hover:bg-yellow-700 ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating..." : "Update Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
