"use client";

import { Bell, Calendar, User } from "lucide-react";

const newsPosts = [
  {
    id: 1,
    title: "Safety Protocol Update",
    description:
      "All employees are required to attend the new safety training session scheduled for next week.",
    author: "Admin",
    date: "2026-01-05",
  },
  {
    id: 2,
    title: "New Project Kickoff",
    description:
      "Construction of the Riverside Mall has officially started. Teams are assigned and ready for deployment.",
    author: "Project Manager",
    date: "2026-01-03",
  },
  {
    id: 3,
    title: "Maintenance Notice",
    description:
      "Server maintenance is scheduled this weekend. The dashboard may be intermittently unavailable.",
    author: "IT Department",
    date: "2026-01-01",
  },
];

export default function NewsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            News & Announcements
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Stay updated with the latest company news, updates, and alerts
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-600 dark:bg-yellow-600 dark:text-white dark:hover:bg-yellow-700">
          <Bell className="h-4 w-4" />
          Add News
        </button>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newsPosts.map((post) => (
          <div
            key={post.id}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {post.title}
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {post.description}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {post.author}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {post.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
