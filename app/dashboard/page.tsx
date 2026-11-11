'use client';

import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top Navbar */}
      <nav className="border-b border-zinc-800 bg-zinc-900 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-white">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700 hover:text-white"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl p-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-white">Welcome back!</h2>
          <p className="mt-2 text-zinc-400">
            You have successfully logged in and accessed your backend service.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-sm text-zinc-500">Status</p>
              <p className="mt-1 text-lg font-medium text-emerald-400">Active Session</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-sm text-zinc-500">Backend</p>
              <p className="mt-1 text-lg font-medium text-indigo-400">Connected</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-sm text-zinc-500">Environment</p>
              <p className="mt-1 text-lg font-medium text-zinc-200">Production</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}