'use client';
import { useState } from 'react';
import { applicationsApi } from '@/lib/api';

export function useApplications() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await applicationsApi.submit(data);
      setSuccess(true);
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to submit';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return { submit, loading, error, success, reset };
}