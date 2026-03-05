'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin, Clock, DollarSign, Calendar, Users,
  ArrowLeft, CheckCircle, Briefcase, ExternalLink,
} from 'lucide-react';
import { useJob } from '@/hooks/useJobs';
import { useAuth } from '@/context/AuthContext';
import { applicationsApi } from '@/lib/api';
import { CategoryBadge, TypeBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ApplyForm from '@/components/forms/ApplyForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

function CompanyAvatar({ company, logoUrl, size = 'lg' }) {
  const dim = size === 'lg' ? 'w-16 h-16 text-xl' : 'w-10 h-10 text-sm';
  const initials = company.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];
  const color = colors[company.charCodeAt(0) % colors.length];
  if (logoUrl) {
    return <img src={logoUrl} alt={company} className={`${dim} rounded-2xl object-contain border border-slate-100 bg-white p-1`} />;
  }
  return (
    <div className={`${dim} rounded-2xl ${color} flex items-center justify-center text-white font-bold shadow-sm`}>
      {initials}
    </div>
  );
}

function RequirementItem({ text }) {
  return (
    <li className="flex items-start gap-2 text-sm text-slate-600">
      <CheckCircle size={15} className="text-brand-500 flex-shrink-0 mt-0.5" />
      <span>{text}</span>
    </li>
  );
}

export default function JobDetailPage() {
  const { id }     = useParams();
  const router     = useRouter();
  const { job, loading, error } = useJob(id);
  const { user, loading: authLoading } = useAuth();
  const [applyOpen, setApplyOpen]     = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [checkingApplied, setCheckingApplied] = useState(false);

  // User login করা থাকলে already applied কিনা check করো
  useEffect(() => {
    if (!user || !id) return;
    setCheckingApplied(true);
    applicationsApi.getMine()
      .then(r => {
        const apps = r.data.data || [];
        const applied = apps.some(a => Number(a.job_id) === Number(id));
        setAlreadyApplied(applied);
      })
      .catch(() => {})
      .finally(() => setCheckingApplied(false));
  }, [user, id]);

  const handleApplyClick = () => {
    if (!user) {
      // Login ছাড়া apply করা যাবে না
      router.push(`/login?redirect=/jobs/${id}`);
      return;
    }
    setApplyOpen(true);
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12"><LoadingSpinner text="Loading job details..." /></div>;

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Briefcase size={28} className="text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Job Not Found</h2>
        <p className="text-slate-500 mb-6">This job may have been removed.</p>
        <Link href="/"><Button variant="secondary">← Back to Jobs</Button></Link>
      </div>
    );
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const requirements = job.requirements?.split('\n').filter(Boolean) || [];

  // Apply button state
  const renderApplyButton = () => {
    if (checkingApplied) {
      return (
        <Button variant="secondary" className="w-full" disabled>
          Checking...
        </Button>
      );
    }

    if (alreadyApplied) {
      return (
        <div className="w-full flex items-center justify-center gap-2 py-3 bg-green-50 border border-green-200 rounded-xl">
          <CheckCircle size={18} className="text-green-500" />
          <span className="text-sm font-bold text-green-700">Already Applied</span>
        </div>
      );
    }

    return (
      <Button
        variant="primary"
        className="w-full"
        onClick={handleApplyClick}
        icon={ExternalLink}
      >
        {user ? 'Apply Now' : 'Login to Apply'}
      </Button>
    );
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 font-semibold mb-6 transition-colors group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Jobs
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="card p-6">
              <div className="flex items-start gap-4 mb-5">
                <CompanyAvatar company={job.company} logoUrl={job.logo_url} />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h1 className="text-2xl font-extrabold text-slate-900 leading-tight mb-1">{job.title}</h1>
                      <p className="text-slate-500 font-semibold text-base">{job.company}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl mb-5">
                {[
                  { icon: MapPin,     label: 'Location', value: job.location },
                  { icon: Clock,      label: 'Type',     value: job.type },
                  { icon: DollarSign, label: 'Salary',   value: job.salary_range || 'Competitive' },
                  { icon: Calendar,   label: 'Posted',   value: formatDate(job.created_at) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label}>
                    <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">
                      <Icon size={11} /> {label}
                    </div>
                    <p className="text-sm font-bold text-slate-700">{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <CategoryBadge category={job.category} />
                <TypeBadge type={job.type} />
                {job.applications_count > 0 && (
                  <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200 font-medium">
                    <Users size={11} /> {job.applications_count} applicants
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Briefcase size={18} className="text-brand-500" /> About This Role
              </h2>
              <div className="prose prose-slate prose-sm max-w-none">
                {job.description.split('\n').map((para, i) => (
                  para ? <p key={i} className="text-slate-600 leading-relaxed mb-3">{para}</p> : <br key={i} />
                ))}
              </div>
            </div>

            {/* Requirements */}
            {requirements.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle size={18} className="text-brand-500" /> Requirements
                </h2>
                <ul className="space-y-2.5">
                  {requirements.map((req, i) => <RequirementItem key={i} text={req} />)}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Apply Card */}
            <div className="card p-5 sticky top-20">
              <div className="text-center mb-4">
                <h3 className="font-bold text-slate-900 mb-1">Interested in this role?</h3>
                <p className="text-sm text-slate-500">
                  {alreadyApplied
                    ? 'You have already applied for this job'
                    : user
                    ? 'Apply now and hear back soon'
                    : 'Login to apply for this job'
                  }
                </p>
              </div>

              {renderApplyButton()}

              {!user && !alreadyApplied && (
                <p className="text-xs text-center text-slate-400 mt-3">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
                    Sign up free
                  </Link>
                </p>
              )}
            </div>

            {/* Company Info */}
            <div className="card p-5">
              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-3">About the Company</h3>
              <div className="flex items-center gap-3 mb-3">
                <CompanyAvatar company={job.company} logoUrl={job.logo_url} size="sm" />
                <div>
                  <p className="font-bold text-slate-900 text-sm">{job.company}</p>
                  <p className="text-xs text-slate-500">{job.location}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Category</span>
                  <span className="font-semibold">{job.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Work Type</span>
                  <span className="font-semibold">{job.type}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={applyOpen}
        onClose={() => setApplyOpen(false)}
        title={`Apply — ${job.title}`}
        size="md"
      >
        <ApplyForm
          jobId={Number(job.id)}
          jobTitle={job.title}
          defaultName={user?.name || ''}
          defaultEmail={user?.email || ''}
          onSuccess={() => {
            setAlreadyApplied(true);
            setTimeout(() => setApplyOpen(false), 2500);
          }}
        />
      </Modal>
    </>
  );
}