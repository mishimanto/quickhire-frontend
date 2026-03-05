'use client';
import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, X } from 'lucide-react';
import { jobsApi } from '@/lib/api';
import Link from 'next/link';

function CompanyCard({ company }) {
  return (
    <Link
      href={`/find-jobs?search=${encodeURIComponent(company.name)}`}
      className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-indigo-200 transition-all duration-200 group flex flex-col"
    >
      {/* Logo */}
      <div className="w-16 h-16 rounded-2xl border border-slate-100 flex items-center justify-center bg-slate-50 mb-4 overflow-hidden">
        {company.logo_url ? (
          <img src={company.logo_url} alt={company.name} className="w-12 h-12 object-contain" />
        ) : (
          <span className="text-2xl font-extrabold text-indigo-400">{company.name?.[0]}</span>
        )}
      </div>

      {/* Name */}
      <h3 className="font-extrabold text-slate-900 text-base mb-1 group-hover:text-indigo-600 transition-colors">
        {company.name}
      </h3>

      {/* Location */}
      {company.location && (
        <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
          <MapPin size={11} /> {company.location}
        </p>
      )}

      {/* Categories */}
      {company.categories?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {company.categories.slice(0, 2).map((cat, i) => (
            <span key={i} className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
              {cat}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
          <Briefcase size={12} className="text-slate-400" />
          {company.job_count} open position{company.job_count !== 1 ? 's' : ''}
        </span>
        <span className="text-xs font-bold text-indigo-500 group-hover:translate-x-0.5 transition-transform">
          View jobs →
        </span>
      </div>
    </Link>
  );
}

export default function BrowseCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');

  useEffect(() => {
    jobsApi.getAll({ per_page: 100 })
      .then(r => {
        const jobs = r.data.data || [];

        // Jobs থেকে unique companies বের করি
        const map = {};
        jobs.forEach(job => {
          if (!map[job.company]) {
            map[job.company] = {
              name:       job.company,
              logo_url:   job.logo_url || null,
              location:   job.location,
              categories: [],
              job_count:  0,
            };
          }
          map[job.company].job_count++;
          if (job.category && !map[job.company].categories.includes(job.category)) {
            map[job.company].categories.push(job.category);
          }
        });

        setCompanies(Object.values(map).sort((a, b) => b.job_count - a.job_count));
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Browse <span className="text-indigo-600">Companies</span>
          </h1>
          <p className="text-slate-500 mb-6">
            Discover top companies and explore their open positions
          </p>

          {/* Search */}
          <div className="flex items-center gap-2 max-w-lg bg-white border border-slate-200 rounded-xl px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <Search size={18} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search companies..."
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="flex items-center gap-4 mb-6">
          <p className="text-sm font-semibold text-slate-500">
            <span className="text-slate-900 font-extrabold text-lg">{filtered.length}</span> companies
            {search && <span className="ml-1">matching "<strong>{search}</strong>"</span>}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-52 bg-white rounded-2xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
            <div className="text-5xl mb-4">🏢</div>
            <h3 className="font-extrabold text-slate-900 text-lg mb-2">No companies found</h3>
            <p className="text-slate-400 text-sm mb-4">Try a different search term</p>
            <button onClick={() => setSearch('')} className="text-indigo-600 font-semibold text-sm hover:underline">
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(company => (
              <CompanyCard key={company.name} company={company} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}