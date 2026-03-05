'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Bell, ChevronDown, LogOut, User, Shield, Search, X, Briefcase, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { jobsApi, applicationsApi } from '@/lib/api';
import Link from 'next/link';

const pageTitles = {
  '/admin':              { title: 'Dashboard Overview',  sub: 'Welcome to your admin panel' },
  '/admin/categories':   { title: 'Job Categories',      sub: 'Manage job listing categories' },
  '/admin/jobs':         { title: 'Job Listings',        sub: 'Manage and edit job postings' },
  '/admin/applications': { title: 'Applications',        sub: 'Review and manage applicants' },
};

function GlobalSearch() {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState({ jobs: [], apps: [] });
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults({ jobs: [], apps: [] }); setOpen(false); return; }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const [jobsRes, appsRes] = await Promise.all([
          jobsApi.getAll({ search: query }),
          applicationsApi.getAll(),
        ]);

        const jobs = (jobsRes.data.data || []).slice(0, 4);
        const apps = (appsRes.data.data || [])
          .filter(a =>
            a.name?.toLowerCase().includes(query.toLowerCase()) ||
            a.email?.toLowerCase().includes(query.toLowerCase())
          ).slice(0, 3);

        setResults({ jobs, apps });
        setOpen(true);
      } catch {}
      finally { setLoading(false); }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const clear = () => { setQuery(''); setResults({ jobs: [], apps: [] }); setOpen(false); };
  const hasResults = results.jobs.length > 0 || results.apps.length > 0;

  return (
    <div className="relative hidden md:block" ref={ref}>
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        type="text"
        placeholder="Search jobs, applicants..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => query && setOpen(true)}
        className="pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 w-72 transition-all"
      />
      {query && (
        <button onClick={clear} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
          <X size={13} />
        </button>
      )}

      {/* Dropdown results */}
      {open && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-fade-in">
          {loading ? (
            <div className="p-4 text-center text-sm text-slate-400">Searching...</div>
          ) : !hasResults ? (
            <div className="p-4 text-center text-sm text-slate-400">No results for "{query}"</div>
          ) : (
            <div className="py-2 max-h-80 overflow-y-auto">
              {/* Jobs */}
              {results.jobs.length > 0 && (
                <>
                  <div className="px-4 py-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Briefcase size={10} /> Jobs
                    </p>
                  </div>
                  {results.jobs.map(job => (
                    <Link
                      key={job.id}
                      href={`/admin/jobs`}
                      onClick={clear}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-7 h-7 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase size={13} className="text-brand-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{job.title}</p>
                        <p className="text-xs text-slate-400">{job.company} · {job.location}</p>
                      </div>
                    </Link>
                  ))}
                </>
              )}

              {/* Applications */}
              {results.apps.length > 0 && (
                <>
                  <div className="px-4 py-1.5 mt-1 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Users size={10} /> Applicants
                    </p>
                  </div>
                  {results.apps.map(app => (
                    <Link
                      key={app.id}
                      href="/admin/applications"
                      onClick={clear}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0 text-emerald-700 text-xs font-bold">
                        {app.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{app.name}</p>
                        <p className="text-xs text-slate-400 truncate">{app.job?.title}</p>
                      </div>
                    </Link>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UserDropdown({ user, onLogout }) {
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
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white text-sm font-extrabold shadow-sm">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name}</p>
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden z-50 animate-fade-in">
          <div className="border-t border-slate-100 py-1.5">
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminHeader({ onMenuClick }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { logout, user } = useAuth();
  const pageInfo = pageTitles[pathname] || { title: 'Admin', sub: '' };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 sticky top-0 z-30 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <Menu size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-base font-extrabold text-slate-900 leading-tight">{pageInfo.title}</h1>
          {/* <p className="text-xs text-slate-400 font-medium hidden sm:block">{pageInfo.sub}</p> */}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <GlobalSearch />
        <div className="w-px h-6 bg-slate-200 mx-1"></div>
        <UserDropdown user={user} onLogout={handleLogout} />
      </div>
    </header>
  );
}