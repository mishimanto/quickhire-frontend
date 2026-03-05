'use client';
import { Suspense } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Briefcase, Mail, Lock, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

// Loading fallback component
function LoginLoadingFallback() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md">
        <div className="card p-10">
          <div className="h-8 w-32 bg-slate-200 rounded-lg mx-auto mb-8 animate-pulse" />
          
          <div className="space-y-5">
            <div>
              <div className="h-4 w-20 bg-slate-200 rounded mb-2 animate-pulse" />
              <div className="h-11 bg-slate-200 rounded-xl animate-pulse" />
            </div>
             
            <div>
              <div className="h-4 w-16 bg-slate-200 rounded mb-2 animate-pulse" />
              <div className="h-11 bg-slate-200 rounded-xl animate-pulse" />
            </div>
            
            <div className="h-11 bg-indigo-200 rounded-xl animate-pulse mt-2" />
          </div>
          
          <div className="mt-5 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="h-3 w-24 bg-slate-200 rounded mb-2 animate-pulse" />
            <div className="space-y-1">
              <div className="h-3 w-40 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-36 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="h-4 w-48 bg-slate-200 rounded mx-auto mt-5 animate-pulse" />
      </div>
    </div>
  );
}

// Main login content component
function LoginContent() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { 
      setError('Please fill in all fields.'); 
      return; 
    }
    try {
      setLoading(true);
      setError('');
      const user = await login(form.email, form.password);
      router.push(user.role === 'admin' ? '/admin' : redirectTo);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-100 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-light rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Card */}
        <div className="card p-10">
          <h1 className="text-2xl text-center mb-8 font-extrabold text-slate-900">Login</h1>
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 mb-5">
              <AlertCircle size={15} className="flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set('email')}
                  className="input-field pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  className="input-field pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2"><LogIn size={16} /> Sign In</span>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-bold text-slate-500 mb-2">Demo credentials:</p>
            <div className="space-y-1 text-xs text-slate-600">
              <p><span className="font-semibold text-purple-600">Admin:</span> admin@gmail.com / password</p>
              <p><span className="font-semibold text-brand-600">User:</span> user@gmail.com / password</p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Don't have an account?{' '}
          <Link href="/register" className="text-brand-500 font-semibold hover:text-brand-700 transition-colors">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}

// Main exported component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoadingFallback />}>
      <LoginContent />
    </Suspense>
  );
}
