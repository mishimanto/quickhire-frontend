'use client';
import { Filter, MapPin, Tag, Clock } from 'lucide-react';
import { JOB_CATEGORIES, JOB_TYPES } from '@/constants';

export default function JobFilters({ filters, onChange, counts = {} }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = filters.category || filters.type || filters.location;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-brand-500" />
          <span className="text-sm font-bold text-slate-700">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-brand-500 inline-block"></span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => onChange({ search: filters.search || '', category: '', type: '', location: '' })}
            className="text-xs text-brand-500 hover:text-brand-700 font-semibold transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Category */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <Tag size={12} /> Category
          </label>
          <div className="space-y-1">
            <button
              onClick={() => handleChange('category', '')}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors font-medium ${!filters.category ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              All Categories
            </button>
            {JOB_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleChange('category', cat === filters.category ? '' : cat)}
                className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors font-medium ${filters.category === cat ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <Clock size={12} /> Job Type
          </label>
          <div className="space-y-1">
            <button
              onClick={() => handleChange('type', '')}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors font-medium ${!filters.type ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              All Types
            </button>
            {JOB_TYPES.map(t => (
              <button
                key={t}
                onClick={() => handleChange('type', t === filters.type ? '' : t)}
                className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors font-medium ${filters.type === t ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}