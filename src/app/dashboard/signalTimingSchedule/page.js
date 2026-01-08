"use client";

const signalSchedules = [
  {
    id: 1,
    intersection: "1st Ave & Main St",
    green: "45s",
    yellow: "5s",
    red: "30s",
    notes: "Peak hour adjustment applied",
  },
  {
    id: 2,
    intersection: "2nd Ave & Pine St",
    green: "50s",
    yellow: "4s",
    red: "40s",
    notes: "Normal timing",
  },
  {
    id: 3,
    intersection: "3rd Ave & Oak St",
    green: "60s",
    yellow: "6s",
    red: "50s",
    notes: "Construction nearby, reduced green time",
  },
];

export default function SignalTimingSchedule() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Signal Timing Schedule
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Overview of traffic signal timings for all intersections
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-600 dark:bg-yellow-600 dark:text-white dark:hover:bg-yellow-700">
          Add Schedule
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full min-w-max divide-y divide-zinc-200 dark:divide-zinc-700">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Intersection
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Green
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Yellow
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Red
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {signalSchedules.map((schedule) => (
              <tr
                key={schedule.id}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <td className="px-4 py-3 text-zinc-900 dark:text-white">
                  {schedule.intersection}
                </td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                  {schedule.green}
                </td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                  {schedule.yellow}
                </td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                  {schedule.red}
                </td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                  {schedule.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
