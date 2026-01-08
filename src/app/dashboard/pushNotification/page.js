"use client";

import { useState } from "react";

const dummyNotifications = [
  {
    id: 1,
    title: "Maintenance Alert",
    message: "Scheduled maintenance on 5th Ave from 10 PM to 12 AM.",
    date: "2026-01-08",
    status: "Sent",
  },
  {
    id: 2,
    title: "New Protocol Update",
    message: "Protocol 12B has been updated. Review the changes.",
    date: "2026-01-07",
    status: "Scheduled",
  },
];

export default function PushNotifications() {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!title || !message) return;
    const newNotification = {
      id: Date.now(),
      title,
      message,
      date: new Date().toISOString().split("T")[0],
      status: "Scheduled",
    };
    setNotifications([newNotification, ...notifications]);
    setTitle("");
    setMessage("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Push Notifications
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Schedule and manage notifications for users.
          </p>
        </div>
      </div>

      {/* Send Notification Form */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-700">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-white mb-4">
          Send New Notification
        </h2>
        <form onSubmit={handleSend} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white resize-none"
          />
          <button
            type="submit"
            className="w-max rounded-lg bg-yellow-500 px-5 py-2 text-sm font-semibold text-black hover:bg-yellow-600 dark:bg-yellow-600 dark:text-white dark:hover:bg-yellow-700"
          >
            Schedule Notification
          </button>
        </form>
      </div>

      {/* Notifications Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full min-w-max divide-y divide-zinc-200 dark:divide-zinc-700">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Message
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {notifications.map((n) => (
              <tr
                key={n.id}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <td className="px-4 py-3 text-zinc-900 dark:text-white">
                  {n.title}
                </td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                  {n.message}
                </td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                  {n.date}
                </td>
                <td
                  className={`px-4 py-3 font-medium ${
                    n.status === "Sent"
                      ? "text-green-600 dark:text-green-400"
                      : "text-yellow-600 dark:text-yellow-400"
                  }`}
                >
                  {n.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
