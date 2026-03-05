'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Briefcase, Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm]       = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [errors, setErrors]   = useState({});

  const set = (k) => (e) => { setForm(p => ({ ...p, [k]: e.target.value })); setErrors(p => ({ ...p, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())               e.name = 'Name is required';
    if (!form.email.trim())              e.email = 'Email is required';
    if (!form.password)                  e.password = 'Password is required';
    else if (form.password.length < 8)   e.password = 'Min 8 characters';
    if (form.password !== form.password_confirmation) e.password_confirmation = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length) { setErrors(ve); return; }
    try {
      setLoading(true);
      setError('');
      await register(form.name, form.email, form.password, form.password_confirmation);
      router.push('/dashboard');
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) setErrors(Object.fromEntries(Object.entries(apiErrors).map(([k, v]) => [k, v[0]])));
      else setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const pwStrength = form.password.length >= 12 ? 'strong' : form.password.length >= 8 ? 'medium' : form.password.length > 0 ? 'weak' : '';
  const strengthColors = { strong: 'bg-green-500', medium: 'bg-amber-500', weak: 'bg-red-400' };
  const strengthWidths = { strong: 'w-full', medium: 'w-2/3', weak: 'w-1/3' };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-100 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-light rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md animate-slide-up">

        <div className="card p-10">
          <h1 className="text-2xl text-center mb-8 font-extrabold text-slate-900">Create new account</h1>
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 mb-5">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="John Doe" value={form.name} onChange={set('name')}
                  className={`input-field pl-10 ${errors.name ? 'border-red-400' : ''}`} />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')}
                  className={`input-field pl-10 ${errors.email ? 'border-red-400' : ''}`} />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPw ? 'text' : 'password'} placeholder="Min 8 characters" value={form.password} onChange={set('password')}
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400' : ''}`} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {pwStrength && (
                <div className="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${strengthColors[pwStrength]} ${strengthWidths[pwStrength]}`}></div>
                </div>
              )}
              {errors.password && <p className="text-xs text-red-500 mt-1 font-medium">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label">Confirm password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" placeholder="Repeat password" value={form.password_confirmation} onChange={set('password_confirmation')}
                  className={`input-field pl-10 ${errors.password_confirmation ? 'border-red-400' : ''}`} />
                {form.password && form.password === form.password_confirmation && (
                  <CheckCircle size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                )}
              </div>
              {errors.password_confirmation && <p className="text-xs text-red-500 mt-1 font-medium">{errors.password_confirmation}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-500 font-semibold hover:text-brand-700 transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}