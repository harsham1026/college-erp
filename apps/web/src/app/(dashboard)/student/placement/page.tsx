'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase, Calendar, MapPin, CheckCircle2, Search, Filter,
  Building2, Award, ArrowUpRight, Clock, Users, ExternalLink, AlertCircle
} from 'lucide-react';
import { INITIAL_PLACEMENTS, PlacementDrive } from '@/lib/studentMockData';

export default function StudentPlacementPage() {
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'DRIVES' | 'APPLICATIONS' | 'INTERVIEWS'>('DRIVES');

  // Apply Modal
  const [applyModalDrive, setApplyModalDrive] = useState<PlacementDrive | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDrives(INITIAL_PLACEMENTS);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredDrives = drives.filter(d => {
    const matchesSearch = d.companyName.toLowerCase().includes(search.toLowerCase()) ||
                          d.jobRole.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const myApplications = drives.filter(d => d.status !== 'NOT_APPLIED');
  const upcomingInterviews = drives.filter(d => d.interviewDate);

  const handleConfirmApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyModalDrive) return;

    const updated = drives.map(d => {
      if (d.id === applyModalDrive.id) {
        return {
          ...d,
          status: 'APPLIED' as const,
          appliedDate: new Date().toISOString().substring(0, 10),
        };
      }
      return d;
    });

    setDrives(updated);
    setApplyModalDrive(null);
    alert(`Successfully registered application for ${applyModalDrive.companyName}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-violet-950 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4" /> Career & Training Cell
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Campus Placement Drives</h1>
          <p className="text-indigo-200 text-sm mt-1">Explore recruiting companies, packages, eligibility criteria, and interview schedules</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl text-center">
            <span className="text-xs text-indigo-200 block">Highest Package</span>
            <span className="text-2xl font-bold text-amber-300">28.0 LPA</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        {[
          { key: 'DRIVES', label: 'All Recruitment Drives', count: drives.length },
          { key: 'APPLICATIONS', label: 'My Applications', count: myApplications.length },
          { key: 'INTERVIEWS', label: 'Interview Schedule', count: upcomingInterviews.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === tab.key
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
            <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or job role..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white border-0"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 border-0"
        >
          <option value="ALL">All Application Status</option>
          <option value="NOT_APPLIED">Not Applied</option>
          <option value="APPLIED">Applied</option>
          <option value="SHORTLISTED">Shortlisted</option>
        </select>
      </div>

      {/* Drives Grid */}
      {activeTab === 'DRIVES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-full p-12 text-center text-slate-500">Loading placement drives...</div>
          ) : filteredDrives.length === 0 ? (
            <div className="col-span-full p-12 text-center text-slate-500">No drives match your search criteria.</div>
          ) : (
            filteredDrives.map((drive) => (
              <div
                key={drive.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                        {drive.companyName[0]}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{drive.companyName}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3 text-rose-500" /> {drive.location}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-sm">
                      ₹{drive.packageLpa} LPA
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-semibold text-slate-900 dark:text-white">{drive.jobRole}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{drive.description}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Eligibility Min CGPA:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{drive.minCgpa} CGPA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Eligible Branches:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{drive.eligibleBranches.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Drive Date:</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{drive.driveDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    drive.status === 'NOT_APPLIED' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
                    drive.status === 'APPLIED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                    'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {drive.status === 'NOT_APPLIED' ? 'Eligible to Apply' : drive.status}
                  </span>

                  {drive.status === 'NOT_APPLIED' ? (
                    <button
                      onClick={() => setApplyModalDrive(drive)}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
                    >
                      Apply Now
                    </button>
                  ) : (
                    <button disabled className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-semibold cursor-not-allowed">
                      Applied on {drive.appliedDate}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === 'APPLICATIONS' && (
        <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">My Submitted Applications</h3>
          <div className="space-y-4">
            {myApplications.map((drive) => (
              <div key={drive.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{drive.companyName}</h4>
                  <p className="text-xs text-slate-500">{drive.jobRole} • Applied on {drive.appliedDate}</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    {drive.status}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">Package: ₹{drive.packageLpa} LPA</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interview Schedule Tab */}
      {activeTab === 'INTERVIEWS' && (
        <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Upcoming Interview Rounds</h3>
          <div className="space-y-4">
            {upcomingInterviews.map((drive) => (
              <div key={drive.id} className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{drive.companyName}</span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{drive.jobRole}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">Venue: {drive.interviewVenue}</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {drive.interviewDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {applyModalDrive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleConfirmApply} className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Application</h3>
              <button type="button" onClick={() => setApplyModalDrive(null)} className="p-2 text-slate-400 text-lg">✕</button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-2">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{applyModalDrive.companyName}</h4>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{applyModalDrive.jobRole}</p>
              <p className="text-xs text-slate-500">Package: ₹{applyModalDrive.packageLpa} LPA</p>
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <p>✓ Current Profile: Harsha M. (8.89 CGPA)</p>
              <p>✓ Resume: Primary Software Resume attached</p>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button type="button" onClick={() => setApplyModalDrive(null)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700">
                Confirm & Apply
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
