'use client';

import React, { useState, useEffect } from 'react';
import {
  ClipboardList, CheckCircle2, XCircle, Clock, Save, Download,
  FileSpreadsheet, Printer, Search, Filter, RefreshCw, Calendar, Users
} from 'lucide-react';
import { INITIAL_STUDENT_ATTENDANCE, TeacherStudentAttendance } from '@/lib/teacherMockData';

export default function TeacherAttendancePage() {
  const [course, setCourse] = useState('B.Tech');
  const [branch, setBranch] = useState('CSE');
  const [semester, setSemester] = useState('Semester 5');
  const [section, setSection] = useState('CSE-A');
  const [subject, setSubject] = useState('CS301 - Data Structures & Algorithms');
  const [date, setDate] = useState('2026-08-04');

  const [students, setStudents] = useState<TeacherStudentAttendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'DAILY' | 'MONTHLY' | 'REPORTS'>('DAILY');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStudents(INITIAL_STUDENT_ATTENDANCE);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleStatusChange = (id: string, newStatus: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const handleMarkAll = (status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
  };

  const handleSaveAttendance = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert(`Attendance for ${section} (${subject}) on ${date} saved successfully!`);
    }, 600);
  };

  const handleExportCSV = () => {
    const headers = ['Roll No', 'USN', 'Student Name', 'Section', 'Status', 'Remarks'];
    const rows = students.map(s => [s.rollNo, s.usn, s.studentName, s.section, s.status, s.remarks || '']);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_${section}_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredStudents = students.filter(s =>
    s.studentName.toLowerCase().includes(search.toLowerCase()) ||
    s.usn.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.includes(search)
  );

  const presentCount = students.filter(s => s.status === 'PRESENT').length;
  const absentCount = students.filter(s => s.status === 'ABSENT').length;
  const lateCount = students.filter(s => s.status === 'LATE').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-violet-900 to-indigo-950 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <ClipboardList className="w-4 h-4" /> Faculty Attendance Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Mark & Manage Attendance</h1>
          <p className="text-indigo-200 text-sm mt-1">Select class, mark daily presence, and export attendance logs</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all"
          >
            <Download className="w-4 h-4" /> Export Excel
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 shadow-md transition-all"
          >
            <Printer className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Cascading Selection Filters */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Class & Session Parameters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Course</label>
            <select value={course} onChange={e => setCourse(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white border-0">
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="BCA">BCA</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Branch</label>
            <select value={branch} onChange={e => setBranch(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white border-0">
              <option value="CSE">CSE</option>
              <option value="ISE">ISE</option>
              <option value="ECE">ECE</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Semester</label>
            <select value={semester} onChange={e => setSemester(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white border-0">
              <option value="Semester 5">Semester 5</option>
              <option value="Semester 3">Semester 3</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Section</label>
            <select value={section} onChange={e => setSection(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white border-0">
              <option value="CSE-A">CSE-A</option>
              <option value="CSE-B">CSE-B</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Subject</label>
            <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white border-0">
              <option value="CS301 - Data Structures & Algorithms">CS301 - Data Structures & Algorithms</option>
              <option value="CS302 - Database Management Systems">CS302 - Database Management Systems</option>
              <option value="CS303 - Operating Systems">CS303 - Operating Systems</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Metrics & Bulk Action Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{students.length}</h3>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Present</p>
            <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{presentCount}</h3>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Absent</p>
            <h3 className="text-3xl font-extrabold text-red-600 dark:text-red-400 mt-1">{absentCount}</h3>
          </div>
          <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400">
            <XCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Late</p>
            <h3 className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{lateCount}</h3>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Table & Quick Mark Actions */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search student by name or USN..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white border-0"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-1">Bulk Actions:</span>
          <button onClick={() => handleMarkAll('PRESENT')} className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-200">
            Mark All Present
          </button>
          <button onClick={() => handleMarkAll('ABSENT')} className="px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 text-xs font-bold hover:bg-red-200">
            Mark All Absent
          </button>
          <button
            onClick={handleSaveAttendance}
            disabled={isSaving}
            className="px-5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5 ml-2"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? 'Saving...' : 'Save & Submit'}
          </button>
        </div>
      </div>

      {/* Student List Table */}
      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading student roster...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-[#334155]">
                  <th className="px-6 py-4">Roll No</th>
                  <th className="px-6 py-4">USN & Student Name</th>
                  <th className="px-6 py-4">Section</th>
                  <th className="px-6 py-4 text-center">Attendance Status</th>
                  <th className="px-6 py-4">Remarks / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-700 dark:text-slate-300 text-sm">{s.rollNo}</td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mr-2">{s.usn}</span>
                        <span className="font-semibold text-slate-900 dark:text-white text-sm">{s.studentName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">{s.section}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleStatusChange(s.id, 'PRESENT')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            s.status === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-md'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-100'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleStatusChange(s.id, 'ABSENT')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            s.status === 'ABSENT'
                              ? 'bg-red-600 text-white shadow-md'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-red-100'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => handleStatusChange(s.id, 'LATE')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            s.status === 'LATE'
                              ? 'bg-amber-600 text-white shadow-md'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-100'
                          }`}
                        >
                          Late
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={s.remarks || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setStudents(prev => prev.map(item => item.id === s.id ? { ...item, remarks: val } : item));
                        }}
                        placeholder="Add remark..."
                        className="w-full p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
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
