'use client';
import { Search, X } from 'lucide-react';

export default function JobSearch({ value, onChange, onClear }) {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        type="text"
        placeholder="Search jobs, companies..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all text-sm shadow-sm"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X size={14} className="text-slate-400" />
        </button>
      )}
    </div>
  );
}