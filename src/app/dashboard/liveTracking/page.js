"use client";

import { MapPin, Truck, User, Activity, Wifi, WifiOff } from "lucide-react";

const trackers = [
  {
    id: 1,
    name: "Vehicle A12",
    type: "Truck",
    status: "online",
    location: "Berlin – Zone 3",
    lastUpdate: "2 sec ago",
  },
  {
    id: 2,
    name: "Driver John",
    type: "User",
    status: "idle",
    location: "Hamburg – Site B",
    lastUpdate: "1 min ago",
  },
  {
    id: 3,
    name: "Vehicle C07",
    type: "Truck",
    status: "offline",
    location: "Munich – Warehouse",
    lastUpdate: "10 min ago",
  },
];

export default function LiveTrackingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Live Tracking
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Monitor real-time location and status of vehicles and personnel
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <Activity className="h-4 w-4" />
          Live Updates Enabled
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Tracker List */}
        <div className="space-y-4">
          {trackers.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.type === "Truck" ? (
                    <Truck className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <User className="h-5 w-5 text-yellow-500" />
                  )}
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {item.location}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-1 text-xs font-medium">
                  {item.status === "online" && (
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <Wifi className="h-3 w-3" /> Online
                    </span>
                  )}
                  {item.status === "idle" && (
                    <span className="text-yellow-600 dark:text-yellow-400">
                      Idle
                    </span>
                  )}
                  {item.status === "offline" && (
                    <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                      <WifiOff className="h-3 w-3" /> Offline
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>Last update</span>
                <span>{item.lastUpdate}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Map Area */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto h-10 w-10 text-yellow-500 mb-3" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Live Map View
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
              Real-time map integration will display tracked vehicles and users
              here using GPS data.
            </p>

            <div className="mt-6 rounded-lg border border-dashed border-zinc-300 px-6 py-10 text-sm text-zinc-400 dark:border-zinc-700">
              Map provider integration pending
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
