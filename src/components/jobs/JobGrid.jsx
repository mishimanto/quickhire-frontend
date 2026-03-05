import JobCard from './JobCard';
import { SkeletonCard } from '@/components/ui/LoadingSpinner';
import { SearchX } from 'lucide-react';

export default function JobGrid({ jobs, loading, error }) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <SearchX size={28} className="text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-1">Failed to load jobs</h3>
        <p className="text-slate-400 text-sm">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <SearchX size={28} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-1">No jobs found</h3>
        <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 animate-fade-in">
      {jobs.map(job => <JobCard key={job.id} job={job} />)}
    </div>
  );
}