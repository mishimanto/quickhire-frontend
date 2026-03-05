'use client';
import { useState, useEffect } from 'react';
import { useJobs } from '@/hooks/useJobs';
import JobGrid from '@/components/jobs/JobGrid';
import JobFilters from '@/components/jobs/JobFilters';

import HeroSection      from '@/components/home/HeroSection';
import CompaniesSection from '@/components/home/CompaniesSection';
import CategoryGrid     from '@/components/home/CategoryGrid';
import CtaSection       from '@/components/home/CtaSection';
import FeaturedJobs     from '@/components/home/FeaturedJobs';
import LatestJobs       from '@/components/home/LatestJobs';

function ShowAllBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
    >
      Show all jobs
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

export default function HomePage() {
  const [localSearch, setLocalSearch] = useState('');
  const [filters, setFilters]         = useState({ search: '', category: '', type: '' });
  const { jobs, loading, error, updateFilters } = useJobs();

  useEffect(() => {
    const t = setTimeout(() => updateFilters({ search: localSearch }), 350);
    return () => clearTimeout(t);
  }, [localSearch]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    updateFilters(newFilters);
  };

  const handleCategorySelect = (categoryName) => {
    const updated = { ...filters, category: categoryName };
    setFilters(updated);
    updateFilters(updated);
    document.getElementById('jobs-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Hero */}
      <HeroSection localSearch={localSearch} setLocalSearch={setLocalSearch} />

      {/* Companies */}
      <CompaniesSection />

      {/* Explore by Category */}
      <div className="w-full mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Explore by <span className="text-[#26A4FF]">category</span>
          </h2>
          <ShowAllBtn onClick={() => handleFilterChange({ ...filters, category: '' })} />
        </div>
        <CategoryGrid onSelect={handleCategorySelect} />
      </div>

      {/* CTA */}
      <CtaSection />

      {/* Featured Jobs */}
      <div className="w-full mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Featured <span className="text-blue-500">jobs</span>
          </h2>
          <ShowAllBtn onClick={() => handleCategorySelect('')} />
        </div>
        <FeaturedJobs />
      </div>

      {/* Latest Jobs Open */}
      <div className="w-full mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Latest <span className="text-blue-500">jobs open</span>
          </h2>
          <ShowAllBtn onClick={() => handleCategorySelect('')} />
        </div>
        <LatestJobs />
      </div>
    </div>
  );
}