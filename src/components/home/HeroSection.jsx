'use client';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection({ localSearch, setLocalSearch }) {
  const [location, setLocation] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (localSearch) params.set('search', localSearch);
    if (location)    params.set('location', location);
    router.push(`/find-jobs?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="relative overflow-hidden mb-16">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 border-2 border-indigo-100 rounded-2xl rotate-12 opacity-60"></div>
        <div className="absolute top-20 right-32 w-48 h-48 border-2 border-indigo-100 rounded-2xl rotate-6 opacity-40"></div>
        <div className="absolute -top-10 right-20 w-32 h-32 border-2 border-indigo-100 rounded-2xl rotate-3 opacity-30"></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-center min-h-[520px]">
        <div className="relative z-10 py-10">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-800 leading-[1.1] tracking-tight">
            Discover <br />
            more than <br />
            <span className="text-blue-500 relative inline-block mt-1">
              5000+ Jobs
              <svg className="absolute -bottom-3 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 9C50 3 150 1 298 6" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>

          <p className="text-slate-500 mt-8 max-w-md text-base leading-relaxed">
            Great platform for the job seeker that searching for
            new career heights and passionate about startups.
          </p>

          {/* Search Bar */}
          <div className="mt-10 bg-white shadow-xl flex flex-col sm:flex-row items-stretch border border-slate-100 overflow-hidden max-w-2xl">
            <div className="flex items-center gap-3 flex-1 px-5 py-4 min-w-0">
              <Search size={18} className="text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Job title or keyword"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 outline-none text-sm text-slate-700 placeholder-slate-400 bg-transparent min-w-0"
              />
            </div>
            <div className="hidden sm:block w-px bg-slate-200 my-3 flex-shrink-0"></div>
            <div className="sm:hidden h-px bg-slate-100 mx-4"></div>
            <div className="flex items-center gap-3 flex-1 px-5 py-4 min-w-0">
              <MapPin size={18} className="text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="City or location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 outline-none text-sm text-slate-700 placeholder-slate-400 bg-transparent min-w-0"
              />
              <ChevronDown size={15} className="text-slate-400 flex-shrink-0" />
            </div>
            <div className="p-2 flex-shrink-0">
              <button
                onClick={handleSearch}
                className="h-full w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-8 py-3.5 text-sm font-bold transition-all duration-200 whitespace-nowrap"
              >
                Search my job
              </button>
            </div>
          </div>

          {/* Popular tags */}
          <p className="text-xs text-slate-400 mt-4">
            <span className="font-semibold text-slate-500">Popular : </span>
            {['UI Designer', 'UX Researcher', 'Android', 'Admin'].map((tag, i, arr) => (
              <button
                key={tag}
                onClick={() => {
                  setLocalSearch(tag);
                  router.push(`/find-jobs?search=${encodeURIComponent(tag)}`);
                }}
                className="hover:text-indigo-600 transition-colors"
              >
                {tag}{i < arr.length - 1 ? ', ' : ''}
              </button>
            ))}
          </p>
        </div>

        {/* Right — Hero image */}
        <div className="hidden lg:flex relative justify-end items-end h-full">
          <div className="absolute right-8 top-1/2 -translate-y-1/2 w-[380px] h-[380px] border-[1.5px] border-indigo-100 rotate-12 rounded-2xl pointer-events-none"></div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 w-[320px] h-[320px] border-[1.5px] border-indigo-100 rotate-6 rounded-2xl pointer-events-none"></div>
          <img
            src="/hero.png"
            alt="Job seeker"
            className="relative z-10 w-[420px] object-contain object-bottom"
            style={{ maxHeight: '520px' }}
          />
        </div>
      </div>
    </div>
  );
}