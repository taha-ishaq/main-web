"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Home,
  Users,
  User,
  ShoppingCart,
  FileText,
  MapPin,
  Newspaper,
  BookOpen,
  Clock,
  Bell,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [accountOpen, setAccountOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      // even if request fails, still redirect (middleware will handle access)
    } finally {
      router.push("/auth/login");
      router.refresh(); // optional: ensures UI updates immediately
    }
  };

  return (
    <div className="flex min-h-screen bg-linear-to-b from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-zinc-200 dark:border-zinc-800">
          <span
            className={`text-xl font-extrabold text-black dark:text-white ${
              !sidebarOpen && "hidden"
            }`}
          >
            RSA <span className="text-yellow-500">Construction</span>
          </span>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-zinc-500 hover:text-yellow-500"
          >
            <Menu />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavItem
            icon={Home}
            label="Home"
            href="/dashboard"
            open={sidebarOpen}
          />
          <NavItem
            icon={User}
            label="User"
            href="/dashboard/user"
            open={sidebarOpen}
          />
          <NavItem
            icon={Users}
            label="Customers"
            href="/dashboard/customers"
            open={sidebarOpen}
          />
          <NavItem
            icon={ShoppingCart}
            label="Orders"
            href="/dashboard/orders"
            open={sidebarOpen}
          />
          <NavItem
            icon={FileText}
            label="Protocols"
            href="/dashboard/protocols"
            open={sidebarOpen}
          />
          <NavItem
            icon={BookOpen}
            label="Protocol Profiles"
            href="/dashboard/protocolProfiles"
            open={sidebarOpen}
          />
          <NavItem
            icon={MapPin}
            label="Live Tracking"
            href="/dashboard/liveTracking"
            open={sidebarOpen}
          />
          <NavItem
            icon={Newspaper}
            label="News"
            href="/dashboard/news"
            open={sidebarOpen}
          />
          <NavItem
            icon={Users}
            label="Construction Diary Profiles"
            href="/dashboard/constructionDiaryProfiles"
            open={sidebarOpen}
          />
          <NavItem
            icon={Clock}
            label="Signal Timing Schedule"
            href="/dashboard/signalTimingSchedule"
            open={sidebarOpen}
          />
          <NavItem
            icon={Bell}
            label="Push Notifications"
            href="/dashboard/pushNotification"
            open={sidebarOpen}
          />
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex flex-1 flex-col">
        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-white dark:bg-zinc-900 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-lg font-semibold text-black dark:text-white">
            Dashboard
          </h1>

          {/* Account */}
          <div className="relative">
            <button
              onClick={() => setAccountOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <User className="h-5 w-5" />
              Admin
              <ChevronDown className="h-4 w-4" />
            </button>

            {accountOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800">
                <Link
                  href="/dashboard/account"
                  className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, href, open }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-yellow-50 hover:text-yellow-600 dark:text-zinc-200 dark:hover:bg-yellow-600/20 dark:hover:text-yellow-400"
    >
      <Icon className="h-5 w-5" />
      {open && label}
    </Link>
  );
}
