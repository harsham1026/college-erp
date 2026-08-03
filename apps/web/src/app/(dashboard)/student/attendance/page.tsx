'use client';

import React, { useState, useEffect } from 'react';
import {
  ClipboardList, Calendar, CheckCircle2, XCircle, Clock,
  Download, Search, Filter, AlertTriangle, TrendingUp,
  FileSpreadsheet, ArrowUpRight, Check, Sparkles, ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, LineChart, Line, Cell
} from 'recharts';
import { INITIAL_ATTENDANCE, AttendanceRecord } from '@/lib/studentMockData';

export default function StudentAttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>('August 2026');
  const [selectedLog, setSelectedLog] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAttendance(INITIAL_ATTENDANCE);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Calculation Metrics
  const totalClassesAll = attendance.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const attendedClassesAll = attendance.reduce((acc, curr) => acc + curr.attendedClasses, 0);
  const overallPercentage = totalClassesAll > 0 ? Number(((attendedClassesAll / totalClassesAll) * 100).toFixed(1)) : 0;

  const filteredAttendance = attendance.filter((item) => {
    const matchesSearch = item.subjectName.toLowerCase().includes(search.toLowerCase()) ||
                          item.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
                          item.facultyName.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = selectedSubject === 'ALL' || item.subjectCode === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const monthlyTrendData = [
    { month: 'Apr', percentage: 94 },
    { month: 'May', percentage: 91 },
    { month: 'Jun', percentage: 89 },
    { month: 'Jul', percentage: 86 },
    { month: 'Aug', percentage: overallPercentage },
  ];

  const handleDownloadReport = (format: 'CSV' | 'PDF') => {
    const headers = ['Subject Code', 'Subject Name', 'Faculty', 'Total Classes', 'Attended', 'Percentage'];
    const rows = attendance.map(a => [a.subjectCode, a.subjectName, a.facultyName, a.totalClasses, a.attendedClasses, `${a.percentage}%`]);
    
    if (format === 'CSV') {
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Attendance_Report_August_2026.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <ClipboardList className="w-4 h-4" /> Academic Records
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Attendance Analytics</h1>
          <p className="text-indigo-200 text-sm mt-1">Track daily logs, subject thresholds, and monthly trends</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => handleDownloadReport('CSV')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-sm font-medium transition-all"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={() => handleDownloadReport('PDF')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-semibold text-sm hover:bg-indigo-50 shadow-md transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" /> Printable PDF
          </button>
        </div>
      </div>

      {/* Today's Quick Status & Overall Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Percentage Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Overall Attendance</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{overallPercentage}%</h3>
            </div>
            <div className={`p-3 rounded-2xl ${overallPercentage >= 75 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${overallPercentage >= 75 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'}`}>
              {overallPercentage >= 75 ? 'Eligibility Satisfied' : 'Low Attendance Alert'}
            </span>
            <span className="text-xs text-slate-500">Threshold: 75%</span>
          </div>
        </div>

        {/* Classes Attended */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Attended</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{attendedClassesAll} <span className="text-sm font-normal text-slate-400">/ {totalClassesAll}</span></h3>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">Across all 6 enrolled subjects this semester</p>
        </div>

        {/* Today's Classes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Today&apos;s Status</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">4 Classes</h3>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-4">✓ 4 Marked Present Today</p>
        </div>

        {/* Minimum Margin */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bunk Buffer</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">12 Classes</h3>
            </div>
            <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">Classes you can skip without dropping below 75%</p>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject wise comparison */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Subject-wise Percentage Comparison</h3>
            <span className="text-xs text-slate-500">Min Threshold 75%</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="subjectCode" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', background: '#1e293b', color: '#fff', border: 'none' }} />
                <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
                  {attendance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.percentage >= 85 ? '#6366f1' : entry.percentage >= 75 ? '#8b5cf6' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Monthly Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', background: '#1e293b', color: '#fff', border: 'none' }} />
                <Line type="monotone" dataKey="percentage" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top.1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by subject code, name or faculty..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none border-0"
          >
            <option value="ALL">All Subjects</option>
            {attendance.map((a) => (
              <option key={a.id} value={a.subjectCode}>{a.subjectCode} - {a.subjectName}</option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none border-0"
          >
            <option value="August 2026">August 2026</option>
            <option value="July 2026">July 2026</option>
            <option value="June 2026">June 2026</option>
          </select>
        </div>
      </div>

      {/* Attendance Subject List Table */}
      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading attendance data...</div>
        ) : filteredAttendance.length === 0 ? (
          <div className="p-12 text-center">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-slate-600 dark:text-slate-400 font-medium">No attendance records found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-[#334155]">
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Faculty</th>
                  <th className="px-6 py-4">Attended / Total</th>
                  <th className="px-6 py-4">Percentage</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAttendance.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md mr-2">
                          {item.subjectCode}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white text-sm">{item.subjectName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.facultyName}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {item.attendedClasses} / {item.totalClasses}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.percentage >= 85 ? 'bg-indigo-600' : item.percentage >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{item.percentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.percentage >= 75 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Satisfactory
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                          <XCircle className="w-3.5 h-3.5" /> Shortage
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedLog(item)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-semibold transition-colors"
                      >
                        View Logs
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Logs Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{selectedLog.subjectCode}</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedLog.subjectName}</h3>
              </div>
              <button onClick={() => setSelectedLog(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl">✕</button>
            </div>
            <div className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-1">
              {selectedLog.recentLogs.map((log, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{log.date}</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">{log.topic}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${log.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'}`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button onClick={() => setSelectedLog(null)} className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-medium text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
