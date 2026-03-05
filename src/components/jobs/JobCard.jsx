'use client';
import Link from 'next/link';
import { MapPin, Clock, DollarSign, Users, ArrowRight } from 'lucide-react';
import { CategoryBadge, TypeBadge, FeaturedBadge } from '@/components/ui/Badge';

function CompanyAvatar({ company, logoUrl }) {
  if (logoUrl) {
    return <img src={logoUrl} alt={company} className="w-11 h-11 rounded-xl object-contain border border-slate-100 bg-white p-1" />;
  }
  const initials = company.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];
  const color = colors[company.charCodeAt(0) % colors.length];
  return (
    <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
      {initials}
    </div>
  );
}

export default function JobCard({ job }) {
  const timeAgo = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff}d ago`;
    if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
    return `${Math.floor(diff / 30)}mo ago`;
  };

  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <div className={`card-hover p-5 group ${job.is_featured ? 'border-amber-200 bg-amber-50/30' : ''}`}>
        <div className="flex items-start gap-3 mb-3">
          <CompanyAvatar company={job.company} logoUrl={job.logo_url} />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-[15px] leading-tight group-hover:text-brand-600 transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-sm text-slate-500 font-medium mt-0.5">{job.company}</p>
          </div>
          {job.is_featured && <FeaturedBadge />}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1">
            <MapPin size={11} className="text-slate-400 flex-shrink-0" />
            {job.location}
          </span>
          {job.salary_range && (
            <span className="flex items-center gap-1">
              <DollarSign size={11} className="text-slate-400 flex-shrink-0" />
              {job.salary_range}
            </span>
          )}
          {job.applications_count > 0 && (
            <span className="flex items-center gap-1">
              <Users size={11} className="text-slate-400 flex-shrink-0" />
              {job.applications_count} applied
            </span>
          )}
        </div>

        <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {job.description?.replace(/\\n/g, ' ')}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <CategoryBadge category={job.category} />
            <TypeBadge type={job.type} />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{timeAgo(job.created_at)}</span>
            <ArrowRight size={13} className="text-brand-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}