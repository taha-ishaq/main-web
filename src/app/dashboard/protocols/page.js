"use client";

import { Search, Eye, FileText, ShieldCheck } from "lucide-react";

const protocols = [
  {
    id: "PR-001",
    name: "Site Safety Protocol",
    customer: "ABC Logistics GmbH",
    status: "Active",
    updatedAt: "2025-01-06",
  },
  {
    id: "PR-002",
    name: "Emergency Response Plan",
    customer: "Müller Transport",
    status: "Draft",
    updatedAt: "2025-01-03",
  },
  {
    id: "PR-003",
    name: "Vehicle Access Control",
    customer: "Berlin Freight Co.",
    status: "Archived",
    updatedAt: "2024-12-28",
  },
];

export default function ProtocolsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Protocols
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Manage safety, operational, and compliance protocols
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          type="text"
          placeholder="Search protocols..."
          className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-white"
        />
      </div>

      {/* Protocols Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-zinc-500">
                Protocol ID
              </th>
              <th className="px-6 py-3 text-left font-medium text-zinc-500">
                Protocol Name
              </th>
              <th className="px-6 py-3 text-left font-medium text-zinc-500">
                Customer
              </th>
              <th className="px-6 py-3 text-left font-medium text-zinc-500">
                Status
              </th>
              <th className="px-6 py-3 text-left font-medium text-zinc-500">
                Last Updated
              </th>
              <th className="px-6 py-3 text-right font-medium text-zinc-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {protocols.map((protocol) => (
              <tr
                key={protocol.id}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                  {protocol.id}
                </td>

                <td className="px-6 py-4 flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  <ShieldCheck className="h-4 w-4 text-yellow-500" />
                  {protocol.name}
                </td>

                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                  {protocol.customer}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      protocol.status === "Active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : protocol.status === "Draft"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {protocol.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                  {protocol.updatedAt}
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      <Eye size={16} />
                    </button>
                    <button className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      <FileText size={16} />
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
