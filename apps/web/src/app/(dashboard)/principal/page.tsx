'use client';

import React from 'react';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Briefcase, TrendingUp, Users, GraduationCap, DollarSign, Award, CheckCircle, Clock, FileText, ArrowUpRight } from 'lucide-react';

export default function PrincipalDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs items={[{ label: 'Executive Dashboard', href: '#' }, { label: 'Principal Portal' }]} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md text-white flex-shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Institutional Performance Dashboard</h1>
              <p className="text-sm text-slate-500">Executive overview, financial approvals, and academic KPIs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Academic Year 2026-2027
            </span>
          </div>
        </div>
      </div>

      {/* High-level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Enrolled Students</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">4,850</p>
          <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12% from previous term
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Faculty Strength</span>
            <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">312</p>
          <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
            96.4% Attendance Rate
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Fee Collection</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">₹ 3.42 Cr</p>
          <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> 88% Collection Target Achieved
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Institutional CGPA</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">8.42 / 10</p>
          <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">
            NAAC Grade A++ Standard
          </div>
        </div>
      </div>

      {/* Main Grid: Approvals & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals Section */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Pending Executive Approvals</h3>
              <p className="text-xs text-slate-500">Items requiring Principal authorization</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-xs font-bold">
              3 Pending
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                  R&D
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">AI Research Lab Equipment Budget Grant</p>
                  <p className="text-xs text-slate-500">Requested by Department of Computer Science • ₹ 12,50,000</p>
                </div>
              </div>
              <button className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700">
                Authorize
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                  SCH
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Merit-cum-Means Scholarship Release List</p>
                  <p className="text-xs text-slate-500">42 Qualifying Students • Financial Aid Division</p>
                </div>
              </div>
              <button className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700">
                Authorize
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                  FAC
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Faculty Duty Leave Application</p>
                  <p className="text-xs text-slate-500">Dr. Priya Sharma • International IEEE Symposium</p>
                </div>
              </div>
              <button className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700">
                Authorize
              </button>
            </div>
          </div>
        </div>

        {/* Academic Performance Summary */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Departmental Pass %</h3>
            <p className="text-xs text-slate-500">Semester examination metrics</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span>Computer Science (CSE)</span>
                <span>94.8%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" style={{ width: '94.8%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span>Electronics (ECE)</span>
                <span>91.2%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" style={{ width: '91.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span>Mechanical Engineering</span>
                <span>88.5%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" style={{ width: '88.5%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span>Management (MBA)</span>
                <span>96.4%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" style={{ width: '96.4%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
