"use client";

import { Search, Plus, Eye, Pencil } from "lucide-react";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Manager",
    status: "Active",
  },
  {
    id: 2,
    name: "Sarah Khan",
    email: "sarah@example.com",
    role: "Driver",
    status: "Inactive",
  },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Users
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Manage system users and their roles
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          type="text"
          placeholder="Search users..."
          className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-white"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-zinc-500">
                Name
              </th>
              <th className="px-6 py-3 text-left font-medium text-zinc-500">
                Email
              </th>
              <th className="px-6 py-3 text-left font-medium text-zinc-500">
                Role
              </th>
              <th className="px-6 py-3 text-left font-medium text-zinc-500">
                Status
              </th>
              <th className="px-6 py-3 text-right font-medium text-zinc-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      <Eye size={16} />
                    </button>
                    <button className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      <Pencil size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
