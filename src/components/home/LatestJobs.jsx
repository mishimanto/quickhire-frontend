'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { jobsApi } from '@/lib/api';

export default function LatestJobs() {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobsApi.getAll({ per_page: 8, sort: 'latest' })
      .then(r => setJobs(r.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {jobs.map((job) => (
        <Link
          key={job.id}
          href={`/jobs/${job.id}`}
          className="bg-white border border-slate-200 px-5 py-4 shadow-md hover:shadow-lg hover:border-indigo-200 transition-all duration-200 flex items-center gap-4 group"
        >
          {/* Logo */}
          <div className="w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center bg-slate-50 flex-shrink-0 overflow-hidden">
            {job.logo_url ? (
              <img src={job.logo_url} alt={job.company} className="w-8 h-8 object-contain" />
            ) : (
              <span className="text-lg font-extrabold text-indigo-400">{job.company?.[0]}</span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-slate-900 text-sm mb-0.5 group-hover:text-indigo-600 transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-xs text-slate-400 mb-2">
              {job.company} · {job.location}
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs font-semibold px-2.5 py-1.5 rounded-full border border-teal-200 text-teal-600 bg-teal-50">
                {job.type}
              </span>
              {job.category && (
                <span className="text-xs font-semibold px-2.5 py-1.5 rounded-full border border-orange-200 text-orange-500 bg-orange-50">
                  {job.category}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}