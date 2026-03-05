'use client';
import { useState, useEffect } from 'react';
import { useJobs } from '@/hooks/useJobs';
import { jobsApi, categoriesApi } from '@/lib/api';
import {
  Plus, Trash2, Eye, Pencil, Search,
  AlertTriangle, Briefcase, Users, Star,
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import AddJobForm from '@/components/forms/AddJobForm';
import { CategoryBadge, TypeBadge } from '@/components/ui/Badge';
import Link from 'next/link';
import { JOB_TYPES } from '@/constants';

function EditJobModal({ job, onClose, onSave }) {
  const [form, setForm]           = useState({ ...job });
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [categories, setCategories] = useState([]);

  // Database থেকে categories load
  useEffect(() => {
    categoriesApi.getAll()
      .then(r => setCategories(r.data.data || []))
      .catch(() => {});
  }, []);

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(p => ({ ...p, [k]: val }));
  };

  // Category change হলে category_id ও update
  const handleCategoryChange = (e) => {
    const selectedName = e.target.value;
    const selectedCat  = categories.find(c => c.name === selectedName);
    setForm(p => ({
      ...p,
      category:    selectedName,
      category_id: selectedCat?.id || '',
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await jobsApi.update(job.id, form);
      onSave(res.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Job Title *</label>
          <input className="input-field" value={form.title || ''} onChange={set('title')} />
        </div>
        <div>
          <label className="label">Company *</label>
          <input className="input-field" value={form.company || ''} onChange={set('company')} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Location *</label>
          <input className="input-field" value={form.location || ''} onChange={set('location')} />
        </div>
        <div>
          <label className="label">Salary Range</label>
          <input className="input-field" value={form.salary_range || ''} onChange={set('salary_range')} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Dynamic category dropdown */}
        <div>
          <label className="label">Category *</label>
          <select
            className="input-field"
            value={form.category || ''}
            onChange={handleCategoryChange}
          >
            <option value="">Select...</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Type *</label>
          <select className="input-field" value={form.type || ''} onChange={set('type')}>
            {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Description *</label>
        <textarea
          className="input-field resize-none"
          rows={4}
          value={form.description || ''}
          onChange={set('description')}
        />
      </div>
      <div>
        <label className="label">Requirements</label>
        <textarea
          className="input-field resize-none"
          rows={3}
          value={form.requirements || ''}
          onChange={set('requirements')}
        />
      </div>
      <div>
        <label className="label">Logo URL</label>
        <input className="input-field" type="url" value={form.logo_url || ''} onChange={set('logo_url')} />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={!!form.is_featured}
          onChange={set('is_featured')}
          className="w-4 h-4 accent-brand-500 rounded"
        />
        <span className="text-sm font-semibold text-slate-700">Featured Job</span>
      </label>

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button variant="primary" className="flex-1" loading={loading} onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}

export default function AdminJobsPage() {
  const { jobs, loading, createJob, deleteJob, refetch } = useJobs();
  const [search, setSearch]             = useState('');
  const [addOpen, setAddOpen]           = useState(false);
  const [editJob, setEditJob]           = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [addLoading, setAddLoading]     = useState(false);
  const [addError, setAddError]         = useState('');

  const filtered = jobs.filter(j =>
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.company?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (data) => {
    try {
      setAddLoading(true);
      setAddError('');
      await createJob(data);
      setAddOpen(false);
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to create job');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try { await deleteJob(deleteTarget.id); setDeleteTarget(null); } catch {}
  };

  return (
    <div className="space-y-5 animate-fade-in">     

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Jobs', value: jobs.length,                            color: 'text-brand-600 bg-brand-50'   },
          { label: 'Featured',   value: jobs.filter(j => j.is_featured).length, color: 'text-amber-600 bg-amber-50'   },
          { label: 'Companies',  value: new Set(jobs.map(j => j.company)).size, color: 'text-violet-600 bg-violet-50' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 p-4 text-center shadow-sm">
            <p className={`text-2xl font-extrabold ${color.split(' ')[0]}`}>{value}</p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex justify-end gap-4 flex-wrap">        
        <Button variant="primary" icon={Plus} onClick={() => setAddOpen(true)}>
          Post New Job
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">
            All Jobs <span className="text-slate-400 font-normal text-sm ml-1">({filtered.length})</span>
          </h3>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading jobs...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase size={36} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No jobs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Job', 'Company', 'Location', 'Category', 'Type', 'Apps', 'Featured', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(job => (
                  <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-900 text-sm">{job.title}</p>
                      <p className="text-xs text-slate-400">#{job.id}</p>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{job.company}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-500 whitespace-nowrap">{job.location}</td>
                    <td className="px-4 py-3.5"><CategoryBadge category={job.category} /></td>
                    <td className="px-4 py-3.5"><TypeBadge type={job.type} /></td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1 text-sm font-bold text-slate-600">
                        <Users size={13} className="text-slate-400" /> {job.applications_count ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {job.is_featured
                        ? <span className="flex items-center gap-1 text-xs font-bold text-amber-600"><Star size={12} className="fill-amber-400 text-amber-400" /> Yes</span>
                        : <span className="text-xs text-slate-300 font-medium">—</span>
                      }
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/jobs/${job.id}`} target="_blank">
                          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors" title="View">
                            <Eye size={14} />
                          </button>
                        </Link>
                        <button
                          onClick={() => setEditJob(job)}
                          className="p-1.5 hover:bg-brand-50 rounded-lg text-slate-400 hover:text-brand-500 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(job)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Job Modal */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Post New Job" size="lg">
        <AddJobForm onSubmit={handleCreate} loading={addLoading} error={addError} />
      </Modal>

      {/* Edit Job Modal */}
      <Modal isOpen={!!editJob} onClose={() => setEditJob(null)} title={`Edit — ${editJob?.title}`} size="lg">
        {editJob && (
          <EditJobModal
            job={editJob}
            onClose={() => setEditJob(null)}
            onSave={() => { refetch(); setEditJob(null); }}
          />
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Job" size="sm">
        <div className="text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={26} className="text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Delete this job?</h3>
          <p className="text-slate-500 text-sm mb-6">
            <strong>"{deleteTarget?.title}"</strong> and all its applications will be permanently removed.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" className="flex-1" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}