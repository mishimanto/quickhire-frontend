'use client';
import { useState, useEffect } from 'react';
import { categoriesApi } from '@/lib/api';

export default function CategoryGrid({ onSelect }) {
  const [categories, setCategories] = useState([]);
  const [hovered, setHovered]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [showAll, setShowAll]       = useState(false);

  useEffect(() => {
    categoriesApi.getAll()
      .then(r => setCategories(r.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const visible = showAll ? categories : categories.slice(0, 8);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-36 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {visible.map((cat) => {
          const active = hovered === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.name)}
              onMouseEnter={() => setHovered(cat.id)}
              onMouseLeave={() => setHovered(null)}
              className={`text-left px-6 py-8 border transition-all duration-200 ${
                active
                  ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200 scale-[1.02]'
                  : 'bg-white border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="text-4xl mb-6">{cat.icon}</div>
              <h3 className={`font-extrabold text-lg mb-3 ${active ? 'text-white' : 'text-slate-900'}`}>
                {cat.name}
              </h3>
              <div className="flex items-center justify-between">
                <p className={`text-sm ${active ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {cat.jobs_count || 0} jobs available
                </p>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                  className={`flex-shrink-0 transition-transform duration-200 ${active ? 'translate-x-1' : ''}`}>
                  <path d="M3 9H15M15 9L10 4M15 9L10 14"
                    stroke={active ? '#fff' : '#6366f1'}
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      {categories.length > 8 && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 px-6 py-2.5 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-semibold transition-all"
          >
            {showAll ? 'Show less' : `View all ${categories.length} categories`}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
              className={`transition-transform duration-200 ${showAll ? 'rotate-180' : ''}`}>
              <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}