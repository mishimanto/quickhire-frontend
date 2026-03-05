'use client';
import { useState, useEffect, useCallback } from 'react';
import { jobsApi } from '@/lib/api';

export function useJobs(initialFilters = {}) {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchJobs = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const res = await jobsApi.getAll({ ...filters, ...params });
      setJobs(res.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const createJob = async (data) => {
    const res = await jobsApi.create(data);
    setJobs(prev => [res.data.data, ...prev]);
    return res.data;
  };

  const deleteJob = async (id) => {
    await jobsApi.delete(id);
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  return { jobs, loading, error, filters, updateFilters, createJob, deleteJob, refetch: fetchJobs };
}

export function useJob(id) {
  const [job, setJob]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const res = await jobsApi.getOne(id);
        setJob(res.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return { job, loading, error };
}