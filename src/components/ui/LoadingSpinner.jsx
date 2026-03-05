export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-brand-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-slate-500 text-sm font-medium">{text}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-slate-200"></div>
        <div className="flex-1">
          <div className="h-4 bg-slate-200 rounded w-2/3 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-1/3"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-4/5"></div>
      </div>
      <div className="flex gap-2 mt-4">
        <div className="h-6 bg-slate-200 rounded-lg w-20"></div>
        <div className="h-6 bg-slate-200 rounded-lg w-16"></div>
      </div>
    </div>
  );
}