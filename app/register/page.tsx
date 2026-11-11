'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('https://demo-repo-cslv.onrender.com/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error('Registration failed');

      router.push('/login');
    } catch (err: any) {
      setError('Failed to register. Try a different username.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Create Account</h1>
          <p className="text-sm text-zinc-400">Register a new account to get started.</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
              placeholder="Enter your username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-500 active:scale-[0.98]"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-zinc-400">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}