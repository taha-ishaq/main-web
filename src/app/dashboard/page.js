// "use client";

// import { useState } from "react";
// import { Menu, User, LogOut, Home, FileText, Settings } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// export default function Dashboard() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const router = useRouter();

//   const handleLogout = async () => {
//     try {
//       await fetch("/api/auth/logout", { method: "POST" });
//     } catch (e) {
//       // even if request fails, still redirect (middleware will handle access)
//     } finally {
//       router.push("/auth/login");
//       router.refresh(); // optional: ensures UI updates immediately
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100 dark:bg-zinc-900">
//       {/* Sidebar */}
//       <aside
//         className={`${sidebarOpen ? "w-64" : "w-20"
//           } transition-all duration-300 bg-white dark:bg-zinc-800 shadow-md flex flex-col`}
//       >
//         {/* Brand */}
//         <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200 dark:border-zinc-700">
//           <span
//             className={`text-xl font-bold text-yellow-500 ${!sidebarOpen && "hidden"
//               }`}
//           >
//             RSA
//           </span>

//           <button
//             className="text-zinc-500 hover:text-yellow-500"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             aria-label="Toggle sidebar"
//           >
//             <Menu className="h-6 w-6" />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 px-2 py-4 space-y-2">
//           <Link
//             href="/"
//             className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 dark:text-zinc-200 dark:hover:bg-yellow-600/20 dark:hover:text-yellow-500"
//           >
//             <Home className="h-5 w-5" />
//             {sidebarOpen && "Home"}
//           </Link>

//           <Link
//             href="#"
//             className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 dark:text-zinc-200 dark:hover:bg-yellow-600/20 dark:hover:text-yellow-500"
//           >
//             <FileText className="h-5 w-5" />
//             {sidebarOpen && "Projects"}
//           </Link>

//           <Link
//             href="#"
//             className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 dark:text-zinc-200 dark:hover:bg-yellow-600/20 dark:hover:text-yellow-500"
//           >
//             <Settings className="h-5 w-5" />
//             {sidebarOpen && "Settings"}
//           </Link>
//         </nav>

//         {/* Logout */}
//         <div className="px-4 py-4 border-t border-gray-200 dark:border-zinc-700">
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-600/20 dark:hover:text-red-300"
//           >
//             <LogOut className="h-5 w-5" />
//             {sidebarOpen && "Logout"}
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-auto">
//         {/* Header */}
//         <header className="flex items-center justify-between bg-white dark:bg-zinc-800 px-6 py-4 shadow-sm">
//           <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
//             Dashboard
//           </h1>

//           <div className="flex items-center gap-4">
//             <User className="h-6 w-6 text-zinc-600 dark:text-zinc-300" />
//             <span className="text-gray-700 dark:text-zinc-200 font-medium">
//               Admin
//             </span>
//           </div>
//         </header>

//         {/* Content Area */}
//         <main className="flex-1 p-6 bg-gray-100 dark:bg-zinc-900">
//           {/* Welcome Card */}
//           <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-md mb-6">
//             <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
//               Welcome, Admin!
//             </h2>
//             <p className="text-gray-600 dark:text-zinc-300">
//               Here's a quick overview of your construction projects and tasks.
//             </p>
//           </div>

//           {/* Stats / Quick Links */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="bg-yellow-500/20 dark:bg-yellow-500/10 rounded-xl p-4 shadow-sm">
//               <h3 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
//                 Total Projects
//               </h3>
//               <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
//                 12
//               </p>
//             </div>

//             <div className="bg-green-500/20 dark:bg-green-500/10 rounded-xl p-4 shadow-sm">
//               <h3 className="text-sm font-medium text-green-600 dark:text-green-400">
//                 Active Tasks
//               </h3>
//               <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
//                 34
//               </p>
//             </div>

//             <div className="bg-red-500/20 dark:bg-red-500/10 rounded-xl p-4 shadow-sm">
//               <h3 className="text-sm font-medium text-red-600 dark:text-red-400">
//                 Pending Issues
//               </h3>
//               <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
//                 5
//               </p>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

//------------------------------------------------------

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Stat title="Total Projects" value="12" color="yellow" />
      <Stat title="Active Workers" value="38" color="green" />
      <Stat title="Pending Issues" value="5" color="red" />
    </div>
  );
}

function Stat({ title, value, color }) {
  const colors = {
    yellow: "border-yellow-500",
    green: "border-green-500",
    red: "border-red-500",
  };

  return (
    <div
      className={`rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg border-t-4 ${colors[color]}`}
    >
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{title}</p>
      <p className="mt-2 text-3xl font-bold text-black dark:text-white">
        {value}
      </p>
    </div>
  );
}
