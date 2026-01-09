"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Eye, Pencil, X, Shield, Users, RefreshCcw } from "lucide-react";

export default function CustomersPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [query, setQuery] = useState("");

  // modal
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return admins;
    return admins.filter((a) => {
      const fullName = `${a.firstName} ${a.lastName}`.toLowerCase();
      return (
        fullName.includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        a.username?.toLowerCase().includes(q) ||
        a.phoneNumber?.toLowerCase().includes(q) ||
        a.city?.toLowerCase().includes(q)
      );
    });
  }, [admins, query]);

  const loadAdmins = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/admins", { method: "GET" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load admins");
      setAdmins(data.admins || []);
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const onCreateAdmin = async (e) => {
    e.preventDefault();
    setCreateError(null);
    setCreating(true);

    const form = e.currentTarget;

    const payload = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      phoneNumber: form.phoneNumber.value.trim(),
      password: form.password.value,
      address: form.address.value.trim(),
      postalCode: form.postalCode.value.trim(),
      city: form.city.value.trim(),
      notes: form.notes.value.trim(),
    };

    // small validation
    if (!payload.firstName || !payload.lastName || !payload.username || !payload.email || !payload.phoneNumber || !payload.password) {
      setCreateError("Please fill all required fields.");
      setCreating(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create admin");
      }

      // add to UI instantly (or reload)
      setAdmins((prev) => [data.user, ...prev]);
      setOpen(false);
      form.reset();
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : "Failed to create admin");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/15">
              <Users className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                Admin Accounts
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Superadmin can manage all admin accounts from here.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={loadAdmins}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              <RefreshCcw size={16} />
              Refresh
            </button>

            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              <Plus size={16} />
              Add Admin
            </button>
          </div>
        </div>

        {/* Search + stats */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search by name, email, username, phone, city..."
              className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-white"
            />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-yellow-700 dark:text-yellow-400">
              Total admins: <b>{admins.length}</b>
            </span>
            <span className="rounded-full bg-green-500/15 px-3 py-1 text-green-700 dark:text-green-400">
              Active: <b>{admins.filter((a) => a.isActive).length}</b>
            </span>
          </div>
        </div>
      </div>

      {/* Errors / Loading */}
      {fetchError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
          {fetchError}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-zinc-500">Admin</th>
              <th className="px-6 py-3 text-left font-medium text-zinc-500">Email</th>
              <th className="px-6 py-3 text-left font-medium text-zinc-500">Phone</th>
              <th className="px-6 py-3 text-left font-medium text-zinc-500">City</th>
              <th className="px-6 py-3 text-left font-medium text-zinc-500">Status</th>
              <th className="px-6 py-3 text-right font-medium text-zinc-500">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {loading ? (
              <tr>
                <td className="px-6 py-6 text-zinc-500" colSpan={6}>
                  Loading admins...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="px-6 py-6 text-zinc-500" colSpan={6}>
                  No admins found.
                </td>
              </tr>
            ) : (
              filtered.map((admin) => (
                <tr key={admin.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-900 dark:text-white">
                          {admin.firstName} {admin.lastName}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          @{admin.username}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{admin.email}</td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{admin.phoneNumber}</td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{admin.city || "-"}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${admin.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                    >
                      {admin.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        title="View (coming soon)"
                        className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        title="Edit (coming soon)"
                        className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Add Admin */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !creating && setOpen(false)}
          />
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Add new Admin
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Only superadmin can create admins.
                </p>
              </div>
              <button
                onClick={() => !creating && setOpen(false)}
                className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onCreateAdmin} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    First Name *
                  </label>
                  <input
                    name="firstName"
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-white"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Last Name *
                  </label>
                  <input
                    name="lastName"
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-white"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Username *
                  </label>
                  <input
                    name="username"
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-white"
                    placeholder="johndoe"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Phone *
                  </label>
                  <input
                    name="phoneNumber"
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-white"
                    placeholder="+923001234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-white"
                    placeholder="admin@rsa.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Password *
                  </label>
                  <input
                    name="password"
                    type="password"
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Address
                  </label>
                  <input
                    name="address"
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-white"
                    placeholder="Street..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Postal Code
                  </label>
                  <input
                    name="postalCode"
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-white"
                    placeholder="54000"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    City
                  </label>
                  <input
                    name="city"
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-white"
                    placeholder="Lahore"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-white"
                  placeholder="Optional notes..."
                />
              </div>

              {createError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
                  {createError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => !creating && setOpen(false)}
                  className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${creating
                      ? "cursor-not-allowed bg-zinc-400 text-white dark:bg-zinc-700"
                      : "bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    }`}
                >
                  {creating ? "Creating..." : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
