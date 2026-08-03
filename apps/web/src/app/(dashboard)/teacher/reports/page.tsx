'use client';

import React, { useState } from 'react';
import {
  BarChart3, Download, Printer, Calendar, Filter, FileSpreadsheet,
  CheckCircle2, Users, BookOpen, Award, FileText
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function TeacherReportsPage() {
  const [reportType, setReportType] = useState<'ATTENDANCE' | 'PERFORMANCE' | 'ASSIGNMENT' | 'QUIZ' | 'SUBJECT' | 'STUDENT'>('ATTENDANCE');
  const [selectedSection, setSelectedSection] = useState('CSE-A');
  const [selectedSubject, setSelectedSubject] = useState('CS301');

  const attendanceReportData = [
    { label: 'CSE-A', value: 91.5 },
    { label: 'CSE-B', value: 87.2 },
    { label: 'CSE-C', value: 84.8 },
  ];

  const performanceReportData = [
    { label: 'CS301 DSA', value: 82.5 },
    { label: 'CS302 DBMS', value: 78.4 },
    { label: 'CS303 OS', value: 80.1 },
  ];

  const handleExportCSV = () => {
    alert(`Downloading ${reportType} Report for ${selectedSection} in CSV format...`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" /> Academic Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Faculty Reports Generator</h1>
          <p className="text-slate-300 text-sm mt-1">Export comprehensive section, subject performance, attendance, and assignment metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all">
            <Download className="w-4 h-4" /> Download Excel
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all">
            <Printer className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { key: 'ATTENDANCE', label: 'Attendance', icon: Users },
          { key: 'PERFORMANCE', label: 'Performance', icon: Award },
          { key: 'ASSIGNMENT', label: 'Assignment', icon: FileText },
          { key: 'QUIZ', label: 'Quiz Scores', icon: BarChart3 },
          { key: 'SUBJECT', label: 'Subject Metric', icon: BookOpen },
          { key: 'STUDENT', label: 'Student Profile', icon: CheckCircle2 },
        ].map(r => {
          const Icon = r.icon;
          const isActive = reportType === r.key;
          return (
            <button
              key={r.key}
              onClick={() => setReportType(r.key as any)}
              className={`p-4 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                isActive
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                  : 'bg-white dark:bg-[#1e293b] border-slate-200 dark:border-[#334155] text-slate-700 dark:text-slate-300 hover:border-indigo-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              {r.label}
            </button>
          );
        })}
      </div>

      {/* Filter Parameters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border-0">
            <option value="CSE-A">Section CSE-A</option>
            <option value="CSE-B">Section CSE-B</option>
          </select>
          <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border-0">
            <option value="CS301">CS301 - Data Structures</option>
            <option value="CS302">CS302 - DBMS</option>
          </select>
        </div>
        <span className="text-xs font-semibold text-slate-400">Generated for Academic Term 2025-2026</span>
      </div>

      {/* Visual Report Preview */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {reportType} Analytics Summary ({selectedSection})
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportType === 'ATTENDANCE' ? attendanceReportData : performanceReportData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', background: '#1e293b', color: '#fff', border: 'none' }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
