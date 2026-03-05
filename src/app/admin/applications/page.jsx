'use client';
import { useState, useEffect } from 'react';
import { applicationsApi } from '@/lib/api';
import {
  Search, ChevronRight, Users, Filter,
} from 'lucide-react';

const STATUS_OPTIONS = ['pending', 'reviewed', 'accepted', 'rejected'];

const statusStyles = {
  pending:  'bg-amber-50 text-amber-700 border-amber-200',
  reviewed: 'bg-blue-50 text-blue-700 border-blue-200',
  accepted: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

function StatusDropdown({ appId, current, onChange }) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    try {
      setLoading(true);
      await applicationsApi.updateStatus(appId, newStatus);
      onChange(appId, newStatus);
    } catch {
      alert('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={loading}
      className={`text-xs font-bold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60 ${statusStyles[current]}`}
    >
      {STATUS_OPTIONS.map(s => (
        <option key={s} value={s} className="bg-white text-slate-700 font-semibold capitalize">
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  );
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    applicationsApi.getAll()
      .then(r => setApplications(r.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setApplications(prev =>
      prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
    );
  };

  const filtered = applications.filter(app => {
    const matchSearch =
      app.name?.toLowerCase().includes(search.toLowerCase()) ||
      app.email?.toLowerCase().includes(search.toLowerCase()) ||
      app.job?.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    all:      applications.length,
    pending:  applications.filter(a => a.status === 'pending').length,
    reviewed: applications.filter(a => a.status === 'reviewed').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total',    value: counts.all,      color: 'bg-brand-500'   },
          { label: 'Pending',  value: counts.pending,  color: 'bg-amber-500'   },
          { label: 'Accepted', value: counts.accepted, color: 'bg-emerald-500' },
          { label: 'Rejected', value: counts.rejected, color: 'bg-red-500'     },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Users size={16} className="text-white" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 font-semibold">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search applicants, jobs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-slate-400" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="input-field w-36"
          >
            <option value="all">All ({counts.all})</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s} className="capitalize">
                {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">
            Applications
            <span className="text-slate-400 font-normal text-sm ml-1">({filtered.length})</span>
          </h3>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading applications...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={36} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No applications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Applicant', 'Email', 'Job', 'Resume', 'Applied', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center text-brand-700 text-xs font-extrabold flex-shrink-0">
                          {app.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{app.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-500">{app.email}</td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-bold text-slate-800">{app.job?.title || '—'}</p>
                      <p className="text-xs text-slate-400">{app.job?.company}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      {app.resume_link ? (
                        <a
                          href={app.resume_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-brand-500 hover:text-brand-700 transition-colors"
                        >
                          View CV <ChevronRight size={11} />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(app.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusDropdown
                        appId={app.id}
                        current={app.status}
                        onChange={handleStatusChange}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}