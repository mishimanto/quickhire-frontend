'use client';
import { useState, useEffect } from 'react';
import { categoriesApi } from '@/lib/api';
import {
  Plus, Trash2, Pencil, Tag,
  AlertTriangle, GripVertical,
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

const COLOR_OPTIONS = [
  { label: 'Blue',   value: 'bg-blue-50 text-blue-700'     },
  { label: 'Pink',   value: 'bg-pink-50 text-pink-700'     },
  { label: 'Green',  value: 'bg-green-50 text-green-700'   },
  { label: 'Orange', value: 'bg-orange-50 text-orange-700' },
  { label: 'Purple', value: 'bg-purple-50 text-purple-700' },
  { label: 'Red',    value: 'bg-red-50 text-red-700'       },
  { label: 'Yellow', value: 'bg-yellow-50 text-yellow-700' },
  { label: 'Slate',  value: 'bg-slate-50 text-slate-700'   },
];

function CategoryForm({ initial, onSubmit, onClose, loading, error }) {
  const [form, setForm] = useState(
    initial || { name: '', icon: '💼', color: 'bg-blue-50 text-blue-700', order: 0 }
  );

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
      )}

      <div className="grid grid-cols-4 gap-3">
        {/* Icon */}
        <div>
          <label className="label">Icon (emoji)</label>
          <input
            className="input-field text-center text-2xl"
            value={form.icon}
            onChange={set('icon')}
            maxLength={4}
            placeholder="💼"
          />
        </div>
        {/* Name */}
        <div className="col-span-3">
          <label className="label">Category Name *</label>
          <input
            className="input-field"
            value={form.name}
            onChange={set('name')}
            placeholder="e.g. Technology"
          />
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="label">Badge Color</label>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_OPTIONS.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => setForm(p => ({ ...p, color: c.value }))}
              className={`px-3 py-2 rounded-lg text-xs font-bold border-2 transition-all ${c.value} ${
                form.color === c.value ? 'border-slate-400 scale-105' : 'border-transparent'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div>
        <label className="label">Preview</label>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${form.color}`}>
            <span>{form.icon}</span> {form.name || 'Category Name'}
          </span>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button variant="primary" className="flex-1" loading={loading} onClick={() => onSubmit(form)}>
          {initial ? 'Save Changes' : 'Add Category'}
        </Button>
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [addOpen, setAddOpen]       = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formLoading, setFormLoading]   = useState(false);
  const [formError, setFormError]       = useState('');

  const load = () => {
    setLoading(true);
    categoriesApi.getAll()
      .then(r => setCategories(r.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (form) => {
    try {
      setFormLoading(true);
      setFormError('');
      await categoriesApi.create(form);
      load();
      setAddOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (form) => {
    try {
      setFormLoading(true);
      setFormError('');
      await categoriesApi.update(editItem.id, form);
      load();
      setEditItem(null);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await categoriesApi.delete(deleteTarget.id);
      load();
      setDeleteTarget(null);
    } catch {}
  };

  return (
    <div className="space-y-5 animate-fade-in">    
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm text-center">
          <p className="text-2xl font-extrabold text-brand-600">{categories.length}</p>
          <p className="text-xs text-slate-500 font-semibold">Total Categories</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm text-center">
          <p className="text-2xl font-extrabold text-emerald-600">
            {categories.reduce((sum, c) => sum + (c.jobs_count || 0), 0)}
          </p>
          <p className="text-xs text-slate-500 font-semibold">Total Jobs</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm text-center">
          <p className="text-2xl font-extrabold text-amber-600">
            {categories.length}
          </p>
          <p className="text-xs text-slate-500 font-semibold">Active Categories</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-end">
        <Button variant="primary" icon={Plus} onClick={() => { setFormError(''); setAddOpen(true); }}>
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
              <div className="h-8 w-8 bg-slate-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Tag size={28} className="text-slate-300" />
          </div>
          <h3 className="font-bold text-slate-700 mb-1">No categories yet</h3>
          <p className="text-slate-400 text-sm mb-4">Add your first job category</p>
          <Button variant="primary" icon={Plus} onClick={() => setAddOpen(true)}>Add Category</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${cat.color?.split(' ')[0] || 'bg-slate-100'}`}>
                  {cat.icon}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setFormError(''); setEditItem(cat); }}
                    className="p-1.5 hover:bg-brand-50 rounded-lg text-slate-400 hover:text-brand-500 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(cat)}
                    className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 mb-1">{cat.name}</h3>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${cat.color}`}>
                  {cat.icon} {cat.name}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {cat.jobs_count || 0} jobs
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add New Category" size="md">
        <CategoryForm
          onSubmit={handleCreate}
          onClose={() => setAddOpen(false)}
          loading={formLoading}
          error={formError}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title={`Edit — ${editItem?.name}`} size="md">
        {editItem && (
          <CategoryForm
            initial={editItem}
            onSubmit={handleUpdate}
            onClose={() => setEditItem(null)}
            loading={formLoading}
            error={formError}
          />
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Category" size="sm">
        <div className="text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={26} className="text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Delete "{deleteTarget?.name}"?</h3>
          <p className="text-slate-500 text-sm mb-6">
            This category will be removed. Jobs using it will have no category.
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