'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import { BarChart3, Users, GraduationCap, DollarSign, TrendingUp, Award, Download, FileSpreadsheet } from 'lucide-react';

export default function AnalyticsPage() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleExportReport = (reportName: string) => {
    setToast({ message: `${reportName} generated and ready for download!`, type: 'success' });
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <Breadcrumbs items={[{ label: 'System' }, { label: 'Executive Analytics' }]} />
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Executive Analytics & Insights</h1>
              <p className="text-sm text-slate-500">Comprehensive overview of institutional KPIs, student statistics, fee trends, exam performance & placements</p>
            </div>
          </div>
          <button onClick={() => handleExportReport('Executive Summary PDF')} className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 shadow-md">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Students</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">1,248</p>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12% vs last year</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Active Faculty</span>
            <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">84</p>
          <p className="text-xs text-slate-400 font-medium">1:15 Student-Faculty Ratio</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Fee Collection</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">88.5%</p>
          <p className="text-xs text-slate-400 font-medium">₹1.42 Cr Collected</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Avg Attendance</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">86.2%</p>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +3.5% this month</p>
        </div>
      </div>

      {/* Visual Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admission Trends Bar Chart */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Admission Growth (Year-over-Year)</h3>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950">2022 - 2026</span>
          </div>
          <div className="space-y-3 pt-2">
            {[
              { year: '2026 Batch', count: 420, percent: 95 },
              { year: '2025 Batch', count: 380, percent: 85 },
              { year: '2024 Batch', count: 310, percent: 70 },
              { year: '2023 Batch', count: 260, percent: 58 },
            ].map((item) => (
              <div key={item.year} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700 dark:text-slate-300">{item.year}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{item.count} Enrolled</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Department Wise Distribution</h3>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950">Students & Faculty</span>
          </div>
          <div className="space-y-3 pt-2">
            {[
              { dept: 'Computer Science & Engineering', count: '480 Students', percent: 88, color: 'bg-indigo-600' },
              { dept: 'Electronics & Communication', count: '320 Students', percent: 65, color: 'bg-violet-600' },
              { dept: 'Mechanical Engineering', count: '240 Students', percent: 48, color: 'bg-cyan-600' },
              { dept: 'Business Administration (MBA)', count: '208 Students', percent: 40, color: 'bg-amber-600' },
            ].map((item) => (
              <div key={item.dept} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700 dark:text-slate-300">{item.dept}</span>
                  <span className="text-slate-900 dark:text-white font-bold">{item.count}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Download Grid */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">Export Academic & Financial Reports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button onClick={() => handleExportReport('Department Attendance Report')} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-center justify-between group transition-colors">
            <div>
              <p className="font-semibold text-sm text-slate-900 dark:text-white">Attendance Report</p>
              <p className="text-xs text-slate-500">Monthly student roll call</p>
            </div>
            <FileSpreadsheet className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
          </button>
          <button onClick={() => handleExportReport('Fee Outstanding Dues Report')} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-center justify-between group transition-colors">
            <div>
              <p className="font-semibold text-sm text-slate-900 dark:text-white">Fee Outstanding Dues</p>
              <p className="text-xs text-slate-500">Pending collections breakdown</p>
            </div>
            <FileSpreadsheet className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
          </button>
          <button onClick={() => handleExportReport('Placement & Package Analysis')} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-center justify-between group transition-colors">
            <div>
              <p className="font-semibold text-sm text-slate-900 dark:text-white">Placement Analysis</p>
              <p className="text-xs text-slate-500">CTC spectrum & recruiter list</p>
            </div>
            <FileSpreadsheet className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
