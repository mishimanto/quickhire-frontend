'use client';
import { useState, useEffect } from 'react';
import Input, { Textarea, Select } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { categoriesApi } from '@/lib/api';
import { JOB_TYPES } from '@/constants';
import { AlertCircle } from 'lucide-react';

export default function AddJobForm({ onSubmit, loading, error }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '', company: '', location: '', category: '',
    category_id: '', type: 'Full-time', salary_range: '',
    description: '', requirements: '', logo_url: '', is_featured: false,
  });
  const [errors, setErrors] = useState({});

  // Database থেকে categories load করুন
  useEffect(() => {
    categoriesApi.getAll()
      .then(r => setCategories(r.data.data || []))
      .catch(() => {});
  }, []);

  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: '' }));
  };

  // Category select করলে category_id ও set হবে
  const handleCategoryChange = (e) => {
    const selectedName = e.target.value;
    const selectedCat  = categories.find(c => c.name === selectedName);
    setForm(p => ({
      ...p,
      category:    selectedName,
      category_id: selectedCat?.id || '',
    }));
    setErrors(p => ({ ...p, category: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Title is required';
    if (!form.company.trim())     e.company     = 'Company is required';
    if (!form.location.trim())    e.location    = 'Location is required';
    if (!form.category)           e.category    = 'Category is required';
    if (!form.description.trim()) e.description = 'Description is required';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    await onSubmit(form);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <AlertCircle size={15} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Job Title *" placeholder="e.g. Frontend Developer" value={form.title} onChange={set('title')} error={errors.title} />
        <Input label="Company *" placeholder="e.g. Acme Inc." value={form.company} onChange={set('company')} error={errors.company} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Location *" placeholder="e.g. New York, NY or Remote" value={form.location} onChange={set('location')} error={errors.location} />
        <Input label="Salary Range" placeholder="e.g. $80k - $120k" value={form.salary_range} onChange={set('salary_range')} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Dynamic categories from DB */}
        <div>
          <label className="label">Category *</label>
          <select
            value={form.category}
            onChange={handleCategoryChange}
            className={`input-field ${errors.category ? 'border-red-400' : ''}`}
          >
            <option value="">Select category...</option>
            {categories.length === 0 ? (
              <option disabled>Loading categories...</option>
            ) : (
              categories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))
            )}
          </select>
          {errors.category && <p className="text-xs text-red-500 mt-1 font-medium">{errors.category}</p>}
        </div>

        <Select label="Job Type *" value={form.type} onChange={set('type')}>
          {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </Select>
      </div>

      <Textarea
        label="Description *"
        placeholder="Describe the role, responsibilities, and team..."
        rows={4}
        value={form.description}
        onChange={set('description')}
        error={errors.description}
      />
      <Textarea
        label="Requirements"
        placeholder="List key requirements, one per line..."
        rows={3}
        value={form.requirements}
        onChange={set('requirements')}
      />
      <Input label="Logo URL" type="url" placeholder="https://..." value={form.logo_url} onChange={set('logo_url')} />
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={form.is_featured}
          onChange={set('is_featured')}
          className="w-4 h-4 rounded accent-brand-500"
        />
        <span className="text-sm font-semibold text-slate-700">Mark as Featured</span>
      </label>

      <Button variant="primary" loading={loading} className="w-full" onClick={handleSubmit}>
        Post Job
      </Button>
    </div>
  );
}