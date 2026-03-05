import { CATEGORY_COLORS, TYPE_COLORS } from '@/constants';

export function CategoryBadge({ category, className = '' }) {
  const colors = CATEGORY_COLORS[category] || 'bg-slate-50 text-slate-700 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${colors} ${className}`}>
      {category}
    </span>
  );
}

export function TypeBadge({ type, className = '' }) {
  const colors = TYPE_COLORS[type] || 'bg-slate-50 text-slate-700 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${colors} ${className}`}>
      {type}
    </span>
  );
}

export function FeaturedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
      ⭐ Featured
    </span>
  );
}