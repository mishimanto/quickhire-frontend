'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Briefcase, LayoutDashboard, Menu, X,
  LogIn, LogOut, UserCircle, ChevronDown
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
      >
        <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {user.name[0].toUpperCase()}
        </div>

        <span className="text-sm font-semibold text-slate-700 hidden sm:block">
          {user.name}
        </span>

        <ChevronDown
          size={14}
          className={`text-slate-400 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-xl border border-slate-100 py-2 z-50">
          {user.role === 'admin' ? (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <LayoutDashboard size={15} /> Admin Dashboard
            </Link>
          ) : (
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <UserCircle size={15} /> My Dashboard
            </Link>
          )}

          <button
            onClick={() => { setOpen(false); onLogout(); }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="relative sticky top-0 z-40 bg-[#f5f6fb] border-b border-slate-200">
      {/* Right Diagonal Decoration */}
      <div className="absolute right-0 top-0 h-full w-40 pointer-events-none overflow-hidden">
        <div className="absolute right-[-40px] top-0 w-full h-full border-t border-r border-indigo-200 transform skew-x-[-25deg]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-10">

            {/* Logo Image */}
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo.svg"
                alt="QuickHire"
                className="h-8 w-auto"
              />

              <span className="text-lg font-semibold text-slate-700">
                Quick<span className="text-indigo-600">Hire</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">

              <Link
                href="/find-jobs"
                className="hover:text-indigo-600 transition"
              >
                Find Jobs
              </Link>

              <Link
                href="/companies"
                className="hover:text-indigo-600 transition"
              >
                Browse Companies
              </Link>

            </nav>

          </div>

          {/* RIGHT SIDE */}
          <nav className="hidden sm:flex items-center gap-6">

            {user ? (
              <UserMenu user={user} onLogout={handleLogout} />
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-indigo-600 text-sm font-medium hover:underline"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 hover:bg-indigo-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}

          </nav>

          {/* Mobile Button */}
          <button
            className="sm:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </div>
    </header>
  );
}