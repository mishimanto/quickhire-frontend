'use client';
import { useState, useEffect } from 'react';
import { Search, MapPin, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { jobsApi, categoriesApi } from '@/lib/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];

function JobCard({ job }) {
  const tagColors = [
    'text-orange-500 border-orange-200 bg-orange-50',
    'text-teal-500 border-teal-200 bg-teal-50',
    'text-indigo-600 border-indigo-200 bg-indigo-50',
  ];

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex gap-4 group"
    >
      {/* Logo */}
      <div className="w-14 h-14 rounded-xl border border-slate-100 flex items-center justify-center bg-slate-50 flex-shrink-0 overflow-hidden">
        {job.logo_url ? (
          <img src={job.logo_url} alt={job.company} className="w-10 h-10 object-contain" />
        ) : (
          <span className="text-xl font-extrabold text-indigo-400">{job.company?.[0]}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors truncate">
            {job.title}
          </h3>
          <span className="text-xs font-bold px-2.5 py-1 border border-indigo-300 text-indigo-600 rounded-md whitespace-nowrap flex-shrink-0">
            {job.type}
          </span>
        </div>

        <p className="text-sm text-slate-400 mb-3 flex items-center gap-1">
          <span className="font-medium text-slate-600">{job.company}</span>
          <span>·</span>
          <MapPin size={12} className="text-slate-400" />
          {job.location}
          {job.salary_range && (
            <>
              <span>·</span>
              <span className="text-green-600 font-semibold">{job.salary_range}</span>
            </>
          )}
        </p>

        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
          {job.description?.slice(0, 120)}...
        </p>

        <div className="flex flex-wrap gap-1.5">
          {job.category && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${tagColors[0]}`}>
              {job.category}
            </span>
          )}
          {job.is_featured && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200 text-amber-600 bg-amber-50">
              ⭐ Featured
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function FindJobsPage() {
  const [jobs, setJobs]             = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [location, setLocation]     = useState('');
  const [filters, setFilters]       = useState({ category: '', type: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [totalJobs, setTotalJobs]   = useState(0);
  const searchParams = useSearchParams();

  useEffect(() => {
    const s = searchParams.get('search')   || '';
    const l = searchParams.get('location') || '';
    setSearch(s);
    setLocation(l);
    }, []);

  useEffect(() => {
    categoriesApi.getAll().then(r => setCategories(r.data.data || []));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchJobs(), 300);
    return () => clearTimeout(t);
  }, [search, location, filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        search:   search   || undefined,
        location: location || undefined,
        category: filters.category || undefined,
        type:     filters.type     || undefined,
        per_page: 20,
      };
      const res = await jobsApi.getAll(params);
      setJobs(res.data.data || []);
      setTotalJobs(res.data.meta?.total || res.data.data?.length || 0);
    } catch {}
    finally { setLoading(false); }
  };

  const clearFilters = () => {
    setSearch('');
    setLocation('');
    setFilters({ category: '', type: '' });
  };

  const hasFilters = search || location || filters.category || filters.type;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Search Bar */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Find your <span className="text-indigo-600">dream job</span>
          </h1>
          <p className="text-slate-500 mb-6">Search from thousands of job listings</p>

          {/* Search row */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-4xl">
            <div className="flex items-center gap-2 flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <Search size={18} className="text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Job title, keyword, or company"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 outline-none text-sm text-slate-700 placeholder-slate-400 bg-transparent"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 sm:w-56 bg-white border border-slate-200 rounded-xl px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <MapPin size={18} className="text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="flex-1 outline-none text-sm text-slate-700 placeholder-slate-400 bg-transparent"
              />
            </div>

            <button
              onClick={fetchJobs}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all"
            >
              Search Jobs
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">

          {/* ── Sidebar Filters ── */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm sticky top-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-extrabold text-slate-900">Filters</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 font-semibold">
                    Clear all
                  </button>
                )}
              </div>

              {/* Category */}
              <div className="mb-5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Category</p>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setFilters(p => ({ ...p, category: '' }))}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      !filters.category ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setFilters(p => ({ ...p, category: cat.name }))}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                        filters.category === cat.name ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{cat.icon} {cat.name}</span>
                      <span className="text-xs text-slate-400">{cat.jobs_count || 0}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Type */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Job Type</p>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setFilters(p => ({ ...p, type: '' }))}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      !filters.type ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    All Types
                  </button>
                  {JOB_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => setFilters(p => ({ ...p, type }))}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        filters.type === type ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Job Results ── */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-semibold text-slate-500">
                <span className="text-slate-900 font-extrabold text-lg">{totalJobs}</span> jobs found
                {filters.category && (
                  <span className="ml-2 text-indigo-600">
                    in <strong>{filters.category}</strong>
                    <button onClick={() => setFilters(p => ({ ...p, category: '' }))} className="ml-1 text-slate-400 hover:text-red-500">✕</button>
                  </span>
                )}
              </p>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                <SlidersHorizontal size={15} /> Filters
              </button>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {search && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-xs font-semibold">
                    "{search}"
                    <button onClick={() => setSearch('')}><X size={11} /></button>
                  </span>
                )}
                {filters.category && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-xs font-semibold">
                    {filters.category}
                    <button onClick={() => setFilters(p => ({ ...p, category: '' }))}><X size={11} /></button>
                  </span>
                )}
                {filters.type && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-xs font-semibold">
                    {filters.type}
                    <button onClick={() => setFilters(p => ({ ...p, type: '' }))}><X size={11} /></button>
                  </span>
                )}
              </div>
            )}

            {/* Job list */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-36 bg-white rounded-xl border border-slate-100 animate-pulse" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">No jobs found</h3>
                <p className="text-slate-400 text-sm mb-4">Try adjusting your search or filters</p>
                <button onClick={clearFilters} className="text-indigo-600 font-semibold text-sm hover:underline">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map(job => <JobCard key={job.id} job={job} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}