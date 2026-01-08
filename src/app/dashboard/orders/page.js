"use client";

import { Search, Eye, FileText } from "lucide-react";

const orders = [
  {
    id: "ORD-10021",
    customer: "ABC Logistics GmbH",
    date: "2025-01-04",
    amount: "€4,500",
    status: "Completed",
  },
  {
    id: "ORD-10022",
    customer: "Müller Transport",
    date: "2025-01-06",
    amount: "€2,100",
    status: "Pending",
  },
  {
    id: "ORD-10023",
    customer: "Berlin Freight Co.",
    date: "2025-01-08",
    amount: "€7,850",
    status: "Cancelled",
  },
];

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Orders
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Track, manage, and review customer orders
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
          placeholder="Search orders..."
          className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-white"
        />
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-zinc-500">
                Order ID
              </th>
              <th className="px-6 py-3 text-left font-medium text-zinc-500">
                Customer
              </th>
              <th className="px-6 py-3 text-left font-medium text-zinc-500">
                Date
              </th>
              <th className="px-6 py-3 text-left font-medium text-zinc-500">
                Amount
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
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                  {order.id}
                </td>
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                  {order.customer}
                </td>
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                  {order.date}
                </td>
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                  {order.amount}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {order.status}
                  </span>
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
