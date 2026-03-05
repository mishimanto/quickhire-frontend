'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Briefcase, Users, Tag,
  ChevronRight, Zap, X,
} from 'lucide-react';

const navItems = [
  { href: '/admin',              icon: LayoutDashboard, label: 'Overview',     exact: true  },
  { href: '/admin/categories',   icon: Tag,             label: 'Categories',   exact: false },
  { href: '/admin/jobs',         icon: Briefcase,       label: 'Jobs',         exact: false },
  { href: '/admin/applications', icon: Users,           label: 'Applications', exact: false },
];

export default function AdminSidebar({ open, onClose }) {
  const pathname = usePathname();

  const isActive = (item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-50 flex flex-col
        bg-slate-900 text-white
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div>
              <p className="text-lg text-slate-400 font-medium uppercase tracking-widest">Admin Panel</p>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-slate-800 rounded-lg transition-colors">
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">
            Main Menu
          </p>
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = isActive({ href, exact: href === '/admin' });
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  active
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={17} className="flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight size={14} className="opacity-70" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom — View Site only */}
        <div className="px-4 py-4 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Briefcase size={17} />
            View Site
          </Link>
        </div>
      </aside>
    </>
  );
}