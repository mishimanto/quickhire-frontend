'use client';
import { useState, useEffect } from 'react';
import { jobsApi, applicationsApi } from '@/lib/api';
import {
  Briefcase, Users, Building2, TrendingUp,
  Clock, CheckCircle, XCircle, ArrowUpRight,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { CategoryBadge, TypeBadge } from '@/components/ui/Badge';

function StatCard({ icon: Icon, value, label, sub, color, trend }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center shadow-sm`}>
          <Icon size={20} className="text-white" />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
            <TrendingUp size={11} /> {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-extrabold text-slate-900 mb-0.5">{value}</p>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminOverviewPage() {
  const [jobs, setJobs]               = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([
      jobsApi.getAll(),
      applicationsApi.getAll(),
    ]).then(([jobsRes, appsRes]) => {
      setJobs(jobsRes.data.data || []);
      setApplications(appsRes.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const featured  = jobs.filter(j => j.is_featured).length;
  const companies = new Set(jobs.map(j => j.company)).size;
  const pending   = applications.filter(a => a.status === 'pending').length;
  const reviewed  = applications.filter(a => a.status === 'reviewed').length;
  const recentJobs = [...jobs].slice(0, 5);
  const recentApps = [...applications].slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Briefcase}  value={jobs.length}    label="Total Jobs"    sub={`${featured} featured`}   color="bg-brand-500"  trend="+2 this week" />
        <StatCard icon={Building2}  value={companies}      label="Companies"     sub="unique employers"         color="bg-violet-500" />
        <StatCard icon={Users}      value={applications.length} label="Applications" sub={`${pending} pending`} color="bg-emerald-500" trend={`+${pending} new`} />
        <StatCard icon={CheckCircle} value={reviewed}      label="Reviewed"      sub="applications"             color="bg-amber-500"  />
      </div>

      {/* Tables */}
      <div className="grid xl:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Recent Jobs</h3>
            <Link href="/admin/jobs" className="flex items-center gap-1 text-xs font-bold text-brand-500 hover:text-brand-700 transition-colors">
              View all <ArrowUpRight size={13} />
            </Link>
          </div>
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Loading...</div>
          ) : recentJobs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No jobs yet</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentJobs.map(job => (
                <div key={job.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase size={15} className="text-brand-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{job.title}</p>
                    <p className="text-xs text-slate-400">{job.company} · {job.location}</p>
                  </div>
                  <TypeBadge type={job.type} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Recent Applications</h3>
            <Link href="/admin/applications" className="flex items-center gap-1 text-xs font-bold text-brand-500 hover:text-brand-700 transition-colors">
              View all <ArrowUpRight size={13} />
            </Link>
          </div>
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Loading...</div>
          ) : recentApps.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No applications yet</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentApps.map(app => (
                <div key={app.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0 text-emerald-700 font-bold text-sm">
                    {app.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900">{app.name}</p>
                    <p className="text-xs text-slate-400 truncate">{app.job?.title} · {app.job?.company}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-lg capitalize border ${
                    app.status === 'pending'  ? 'bg-amber-50 text-amber-700 border-amber-200'  :
                    app.status === 'reviewed' ? 'bg-blue-50 text-blue-700 border-blue-200'     :
                    app.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-200'  :
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>{app.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}