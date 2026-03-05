'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { jobsApi } from '@/lib/api';

const tagColors = [
  'text-orange-500 border-orange-200 bg-orange-50',
  'text-teal-500 border-teal-200 bg-teal-50',
  'text-indigo-600 border-indigo-200 bg-indigo-50',
  'text-pink-500 border-pink-200 bg-pink-50',
];

export default function FeaturedJobs() {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobsApi.getAll({ is_featured: 1, per_page: 8 })
      .then(r => setJobs(r.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-52 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {jobs.map((job, idx) => (
        <Link
          key={job.id}
          href={`/jobs/${job.id}`}
          className="bg-white border border-slate-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col group"
        >
          {/* Top row — logo + type badge */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center bg-slate-50 flex-shrink-0 overflow-hidden">
              {job.logo_url ? (
                <img src={job.logo_url} alt={job.company} className="w-8 h-8 object-contain" />
              ) : (
                <span className="text-lg font-extrabold text-indigo-400">{job.company?.[0]}</span>
              )}
            </div>
            <span className="text-xs font-bold px-2.5 py-1 border border-indigo-300 text-indigo-600 rounded-md whitespace-nowrap">
              {job.type}
            </span>
          </div>

          <h3 className="font-extrabold text-slate-900 text-sm mb-1 group-hover:text-indigo-600 transition-colors">
            {job.title}
          </h3>

          <p className="text-xs text-slate-400 mb-2">
            {job.company} · {job.location}
          </p>

          <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1 line-clamp-2">
            {job.description?.slice(0, 80)}...
          </p>

          <div className="flex flex-wrap gap-1.5">
            {job.category && (
              <span className={`text-xs font-semibold px-2.5 py-1.5 rounded-full ${tagColors[idx % tagColors.length]}`}>
                {job.category}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}