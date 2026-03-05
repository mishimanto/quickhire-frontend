'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { applicationsApi } from '@/lib/api';
import {
  Briefcase, Clock, CheckCircle, XCircle, User,
  MapPin, ExternalLink, Calendar, TrendingUp, ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

function StatusBadge({ status }) {
  const styles = {
    pending:  'bg-amber-50 text-amber-700 border-amber-200',
    reviewed: 'bg-blue-50 text-blue-700 border-blue-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    accepted: 'bg-green-50 text-green-700 border-green-200',
  };
  const icons = {
    pending:  <Clock size={11} />,
    reviewed: <TrendingUp size={11} />,
    rejected: <XCircle size={11} />,
    accepted: <CheckCircle size={11} />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${styles[status] || styles.pending}`}>
      {icons[status] || icons.pending}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function ApplicationCard({ app }) {
  return (
    <div className="card p-5 hover:-translate-y-0.5 transition-transform duration-200">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-[15px]">{app.job?.title || 'Unknown Position'}</h3>
          <p className="text-sm text-slate-500 font-medium mt-0.5">{app.job?.company || '—'}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-3">
        {app.job?.location && (
          <span className="flex items-center gap-1"><MapPin size={11} /> {app.job.location}</span>
        )}
        {app.job?.type && (
          <span className="flex items-center gap-1"><Briefcase size={11} /> {app.job.type}</span>
        )}
        <span className="flex items-center gap-1">
          <Calendar size={11} /> Applied {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <a href={app.resume_link} target="_blank" rel="noopener noreferrer"
          className="text-xs text-brand-500 hover:text-brand-700 font-semibold flex items-center gap-1 transition-colors">
          <ExternalLink size={12} /> View Resume
        </a>
        {app.job?.id && (
          <Link href={`/jobs/${app.job.id}`}
            className="text-xs text-slate-400 hover:text-brand-500 font-semibold flex items-center gap-1 transition-colors">
            View Job <ChevronRight size={12} />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('all');

  useEffect(() => {
    applicationsApi.getMine()
      .then(r => setApplications(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    all:      applications.length,
    pending:  applications.filter(a => a.status === 'pending').length,
    reviewed: applications.filter(a => a.status === 'reviewed').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-fade-in min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Hi, {user.name.split(' ')[0]} 👋</h1>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total Applied',  value: counts.all,      color: 'bg-brand-500',  icon: Briefcase  },
          { label: 'Pending',        value: counts.pending,  color: 'bg-amber-500',  icon: Clock      },
          { label: 'Reviewed',       value: counts.reviewed, color: 'bg-blue-500',   icon: TrendingUp },
          { label: 'Rejected',       value: counts.rejected, color: 'bg-red-500',    icon: XCircle    },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-7 h-7 ${color} rounded-lg flex items-center justify-center`}>
                <Icon size={13} className="text-white" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Applications */}
      <div>
        <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
          <h2 className="text-lg font-bold text-slate-900">My Applications</h2>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            {(['all', 'pending', 'reviewed', 'rejected']).map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                  filter === s ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {s} <span className="ml-1 opacity-60">({counts[s]})</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/3 mb-4"></div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase size={28} className="text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-700 mb-1">No applications yet</h3>
            <p className="text-slate-400 text-sm mb-4">Start browsing and apply to your dream jobs!</p>
            <Link href="/find-jobs" className="btn-primary text-sm py-2 inline-flex">Browse Jobs</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map(app => <ApplicationCard key={app.id} app={app} />)}
          </div>
        )}
      </div>
    </div>
  );
}