import { Briefcase, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1f2937] text-slate-300">
      
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* COLUMN 1 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo.svg"
                alt="QuickHire"
                className="h-8 w-auto"
              />

              <span className="text-white font-semibold text-lg">
                QuickHire
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Great platform for the job seeker that passionate about startups.
              Find your dream job easier.
            </p>
          </div>

          {/* COLUMN 2 */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              About
            </h3>

            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-white">Companies</Link></li>
              <li><Link href="#" className="hover:text-white">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white">Terms</Link></li>
              <li><Link href="#" className="hover:text-white">Advice</Link></li>
              <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* COLUMN 3 */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Resources
            </h3>

            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-white">Help Docs</Link></li>
              <li><Link href="#" className="hover:text-white">Guide</Link></li>
              <li><Link href="#" className="hover:text-white">Updates</Link></li>
              <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* COLUMN 4 */}
          <div>
            <h3 className="text-white font-semibold mb-3">
              Get job notifications
            </h3>

            <p className="text-sm text-slate-400 mb-4">
              The latest job news, articles, sent to your inbox weekly.
            </p>

            <div className="flex">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 px-3 py-2 me-2 text-sm bg-slate-200 text-slate-700 outline-none"
              />

              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 text-sm font-medium">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-slate-700 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* COPYRIGHT */}
          <p className="text-sm text-slate-400">
             2026 &copy; QuickHire. All rights reserved.
          </p>

          {/* SOCIAL */}
          <div className="flex items-center gap-4">

            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 cursor-pointer">
              <Facebook size={14}/>
            </div>

            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 cursor-pointer">
              <Instagram size={14}/>
            </div>

            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 cursor-pointer">
              <Twitter size={14}/>
            </div>

            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 cursor-pointer">
              <Linkedin size={14}/>
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}