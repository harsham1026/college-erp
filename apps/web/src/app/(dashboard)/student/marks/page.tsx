'use client';

import React, { useState, useEffect } from 'react';
import {
  Award, TrendingUp, Search, Filter, BookOpen,
  CheckCircle2, AlertCircle, BarChart3, ChevronLeft, ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { INITIAL_MARKS, SubjectMarks } from '@/lib/studentMockData';

export default function StudentMarksPage() {
  const [marksList, setMarksList] = useState<SubjectMarks[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState<string>('Semester 5');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setMarksList(INITIAL_MARKS);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const totalObtained = marksList.reduce((acc, m) => acc + m.totalMarks, 0);
  const totalMax = marksList.length * 100;
  const overallPercentage = totalMax > 0 ? Number(((totalObtained / totalMax) * 100).toFixed(1)) : 0;

  const filteredMarks = marksList.filter(m =>
    m.subjectName.toLowerCase().includes(search.toLowerCase()) ||
    m.subjectCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" /> Academic Performance
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Internal & Continuous Assessment</h1>
          <p className="text-emerald-200 text-sm mt-1">Assignment, quiz, lab, and mid-term score analytics</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl text-center">
          <span className="text-xs text-emerald-200 block">Overall Percentage</span>
          <span className="text-3xl font-extrabold">{overallPercentage}%</span>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Marks Obtained</p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {totalObtained} <span className="text-sm text-slate-400 font-normal">/ {totalMax}</span>
          </h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">✓ Passed in all subjects</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Top Subject</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">CS305L (98%)</h3>
          <p className="text-xs text-slate-500 mt-2">DSA Laboratory - S Grade</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Assignment Score</p>
          <h3 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">18.2 / 20</h3>
          <p className="text-xs text-slate-500 mt-2">Based on 6 course assessments</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Semester</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Semester 5</h3>
          <p className="text-xs text-slate-500 mt-2">CSE Department • Autonomous</p>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Subject Marks Breakdown (Total Out of 100)</h3>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="Semester 5">Semester 5 (Current)</option>
            <option value="Semester 4">Semester 4</option>
            <option value="Semester 3">Semester 3</option>
          </select>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={marksList}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="subjectCode" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', background: '#1e293b', color: '#fff', border: 'none' }} />
              <Bar dataKey="totalMarks" radius={[8, 8, 0, 0]}>
                {marksList.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.totalMarks >= 90 ? '#10b981' : entry.totalMarks >= 80 ? '#6366f1' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search & Table */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search marks by subject..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white border-0"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading marks...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-[#334155]">
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-4 py-4 text-center">Assignment (20)</th>
                  <th className="px-4 py-4 text-center">Lab (20)</th>
                  <th className="px-4 py-4 text-center">Quiz (10)</th>
                  <th className="px-4 py-4 text-center">Mid-Term (50)</th>
                  <th className="px-6 py-4 text-center">Total (100)</th>
                  <th className="px-6 py-4 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredMarks.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md mr-2">
                          {m.subjectCode}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white text-sm">{m.subjectName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-sm font-medium text-slate-700 dark:text-slate-300">{m.assignmentMarks}</td>
                    <td className="px-4 py-4 text-center text-sm font-medium text-slate-700 dark:text-slate-300">{m.labMarks}</td>
                    <td className="px-4 py-4 text-center text-sm font-medium text-slate-700 dark:text-slate-300">{m.quizMarks}</td>
                    <td className="px-4 py-4 text-center text-sm font-medium text-slate-700 dark:text-slate-300">{m.midTermMarks}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">{m.totalMarks}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        m.grade === 'S' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        Grade {m.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
