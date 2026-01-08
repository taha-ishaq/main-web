"use client";

import {
  ShieldCheck,
  FileText,
  Users,
  Calendar,
  Edit,
  Archive,
} from "lucide-react";

export default function ProtocolProfilePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Protocol Profile
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Detailed information and configuration for this protocol
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800">
            <Edit size={16} />
            Edit
          </button>

          <button className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200">
            <Archive size={16} />
            Archive
          </button>
        </div>
      </div>

      {/* Protocol Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Site Safety Protocol
            </h2>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            This protocol defines the mandatory safety procedures, emergency
            actions, and access rules for all personnel and vehicles operating
            within the construction site premises.
          </p>

          {/* Description Blocks */}
          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
              <h3 className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Scope
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Applies to all staff, contractors, and third-party logistics
                personnel.
              </p>
            </div>

            <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
              <h3 className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Compliance Level
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Mandatory – Failure to comply may result in access revocation.
              </p>
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            Protocol Details
          </h3>

          <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            <FileText className="h-4 w-4 text-yellow-500" />
            Protocol ID: <span className="font-medium">PR-001</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            <Users className="h-4 w-4 text-yellow-500" />
            Customer: <span className="font-medium">ABC Logistics GmbH</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            <Calendar className="h-4 w-4 text-yellow-500" />
            Last Updated: <span className="font-medium">06 Jan 2025</span>
          </div>

          {/* Status */}
          <div>
            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        Any changes made to this protocol will be logged and may require
        re-approval depending on compliance rules.
      </div>
    </div>
  );
}
