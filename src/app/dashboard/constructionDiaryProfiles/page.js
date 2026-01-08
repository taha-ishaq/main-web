"use client";

import { User, Calendar, FileText } from "lucide-react";

const diaryProfiles = [
  {
    id: 1,
    name: "Riverside Mall Project",
    manager: "John Doe",
    date: "2026-01-05",
    summary:
      "Foundation work completed, site inspections ongoing. Safety compliance report submitted.",
  },
  {
    id: 2,
    name: "Downtown Office Tower",
    manager: "Jane Smith",
    date: "2026-01-04",
    summary:
      "Structural framework in progress, material delivery scheduled for next week.",
  },
  {
    id: 3,
    name: "Sunrise Apartments",
    manager: "Michael Johnson",
    date: "2026-01-03",
    summary:
      "Excavation complete, preliminary concrete pouring started for the basement level.",
  },
];

export default function CustomerDiaryProfiles() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Construction Diary Profiles
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            View and manage construction diaries for all projects
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-600 dark:bg-yellow-600 dark:text-white dark:hover:bg-yellow-700">
          <FileText className="h-4 w-4" />
          Add Diary
        </button>
      </div>

      {/* Diary Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {diaryProfiles.map((diary) => (
          <div
            key={diary.id}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {diary.name}
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {diary.summary}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {diary.manager}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {diary.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
