'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3, Download, Award, CheckCircle2, TrendingUp,
  FileSpreadsheet, Printer, Search, BookOpen, Layers
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { INITIAL_RESULTS, SemesterResult } from '@/lib/studentMockData';

export default function StudentResultsPage() {
  const [results, setResults] = useState<SemesterResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSemIndex, setActiveSemIndex] = useState<number>(2); // Default to Sem 3
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setResults(INITIAL_RESULTS);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const activeResult = results[activeSemIndex] || results[0];

  const sgpaTrendData = results.map(r => ({
    sem: `Sem ${r.semester}`,
    SGPA: r.sgpa,
    CGPA: r.cgpa,
  }));

  const handlePrintResult = () => {
    window.print();
  };

  const filteredSubjects = activeResult?.subjects.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" /> Official Examination Transcript
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Semester Examination Results</h1>
          <p className="text-slate-300 text-sm mt-1">VTU Credit Based Evaluation System • Grade Sheet</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintResult}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all"
          >
            <Printer className="w-4 h-4" /> Download Result PDF
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cumulative GPA (CGPA)</p>
          <h3 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">{activeResult?.cgpa || '8.89'}</h3>
          <p className="text-xs text-slate-500 mt-2">First Class with Distinction</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Semester GPA (SGPA)</p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{activeResult?.sgpa || '9.10'}</h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">↑ +0.45 higher than Sem 2</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Credits Earned</p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {activeResult?.earnedCredits} <span className="text-sm font-normal text-slate-400">/ {activeResult?.totalCredits}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-2">100% Credit Completion</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Result Status</p>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">PASSED</h3>
          <p className="text-xs text-slate-500 mt-2">Zero backlog units</p>
        </div>
      </div>

      {/* Semester Tab Switcher & Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Select Semester Grade Sheet</h3>
            <div className="flex flex-wrap gap-2">
              {results.map((r, idx) => (
                <button
                  key={r.semester}
                  onClick={() => setActiveSemIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeSemIndex === idx
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  Sem {r.semester}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subject code or name..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white border-0"
              />
            </div>
            <span className="text-xs text-slate-500">Showing Sem {activeResult?.semester} Marks</span>
          </div>

          {/* Subject Grade Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3">Subject Code & Name</th>
                  <th className="px-3 py-3 text-center">Credits</th>
                  <th className="px-3 py-3 text-center">Internal</th>
                  <th className="px-3 py-3 text-center">External</th>
                  <th className="px-3 py-3 text-center">Total</th>
                  <th className="px-3 py-3 text-center">Grade</th>
                  <th className="px-3 py-3 text-center">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredSubjects.map((s) => (
                  <tr key={s.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3">
                      <div>
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mr-2">{s.code}</span>
                        <span className="font-medium text-slate-900 dark:text-white">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center text-slate-600 dark:text-slate-400 font-medium">{s.credits}</td>
                    <td className="px-3 py-3 text-center text-slate-600 dark:text-slate-400">{s.internal}</td>
                    <td className="px-3 py-3 text-center text-slate-600 dark:text-slate-400">{s.external}</td>
                    <td className="px-3 py-3 text-center font-bold text-slate-900 dark:text-white">{s.total}</td>
                    <td className="px-3 py-3 text-center">
                      <span className="px-2.5 py-0.5 rounded text-xs font-extrabold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {s.grade}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Progression Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">SGPA & CGPA Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sgpaTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="sem" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis domain={[7.0, 10.0]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', background: '#1e293b', color: '#fff', border: 'none' }} />
                <Line type="monotone" dataKey="SGPA" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="CGPA" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 text-xs font-semibold">
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-indigo-600" /> SGPA</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500" /> CGPA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
