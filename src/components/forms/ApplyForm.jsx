'use client';
import { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Input, { Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useApplications } from '@/hooks/useApplications';

export default function ApplyForm({ jobId, jobTitle, onSuccess, defaultName = '', defaultEmail = ''  }) {
  const { submit, loading, error } = useApplications();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: defaultName, email: defaultEmail, resume_link: '', cover_note: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())         e.name        = 'Name is required';
    if (!form.email.trim())        e.email       = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.resume_link.trim())  e.resume_link = 'Resume link is required';
    else {
      try { new URL(form.resume_link); } catch { e.resume_link = 'Enter a valid URL'; }
    }
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    try {
      const payload = {
        job_id:      Number(jobId),  
        name:        form.name,
        email:       form.email,
        resume_link: form.resume_link,
        cover_note:  form.cover_note,
      };
      console.log('Sending payload:', payload); 
      await submit(payload);
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.log('Validation errors:', err.response?.data);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Application Submitted!</h3>
        <p className="text-slate-500 text-sm">
          Your application for <strong>{jobTitle}</strong> has been received. Good luck! 🎉
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      <Input
        label="Full Name *"
        placeholder="John Doe"
        value={form.name}
        onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })); }}
        error={errors.name}
      />
      <Input
        label="Email Address *"
        type="email"
        placeholder="john@example.com"
        value={form.email}
        onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })); }}
        error={errors.email}
      />
      <Input
        label="Resume Link (URL) *"
        type="url"
        placeholder="https://drive.google.com/..."
        value={form.resume_link}
        onChange={e => { setForm(p => ({ ...p, resume_link: e.target.value })); setErrors(p => ({ ...p, resume_link: '' })); }}
        error={errors.resume_link}
      />
      <Textarea
        label="Cover Note"
        placeholder="Tell us why you'd be a great fit..."
        rows={4}
        value={form.cover_note}
        onChange={e => setForm(p => ({ ...p, cover_note: e.target.value }))}
      />

      <Button
        variant="primary"
        loading={loading}
        className="w-full"
        onClick={handleSubmit}
      >
        Submit Application
      </Button>
    </div>
  );
}