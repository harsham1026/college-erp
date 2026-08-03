'use client';

import React, { useState, useEffect } from 'react';
import {
  GraduationCap, Search, Filter, Phone, Mail, User, BookOpen,
  Award, Calendar, CheckCircle2, ChevronRight, Eye, ShieldCheck
} from 'lucide-react';
import { INITIAL_STUDENT_PROFILES, StudentProfileItem } from '@/lib/teacherMockData';

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<StudentProfileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState<string>('ALL');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfileItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStudents(INITIAL_STUDENT_PROFILES);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const filtered = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(search.toLowerCase()) ||
                          s.usn.toLowerCase().includes(search.toLowerCase());
    const matchesSection = sectionFilter === 'ALL' || s.section === sectionFilter;
    return matchesSearch && matchesSection;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-violet-900 to-indigo-950 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" /> Class Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Enrolled Student Profiles</h1>
          <p className="text-indigo-200 text-sm mt-1">Review student academic records, attendance history, and parent contact information</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl text-center">
          <span className="text-xs text-indigo-200 block">Total Students</span>
          <span className="text-2xl font-bold">{students.length} Enrolled</span>
        </div>
      </div>

      {/* Filter */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student name or USN..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white border-0"
          />
        </div>
        <select
          value={sectionFilter}
          onChange={e => setSectionFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 border-0"
        >
          <option value="ALL">All Sections</option>
          <option value="CSE-A">CSE-A</option>
          <option value="CSE-B">CSE-B</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading student directory...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-[#334155]">
                  <th className="px-6 py-4">USN & Student Name</th>
                  <th className="px-6 py-4">Course & Section</th>
                  <th className="px-6 py-4">Attendance %</th>
                  <th className="px-6 py-4">CGPA</th>
                  <th className="px-6 py-4">Contact Phone</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mr-2">{s.usn}</span>
                        <span className="font-semibold text-slate-900 dark:text-white text-sm">{s.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{s.branch} • {s.section}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        s.attendancePercentage >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {s.attendancePercentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white text-sm">{s.cgpa}</td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500">{s.phone}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedStudent(s)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-semibold text-xs hover:bg-indigo-100 flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> Full Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg">
                  {selectedStudent.fullName[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedStudent.fullName}</h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{selectedStudent.usn} • {selectedStudent.section}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-2 text-slate-400 text-lg">✕</button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block">Overall Attendance</span>
                <span className="text-xl font-bold text-emerald-600">{selectedStudent.attendancePercentage}%</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block">Cumulative GPA</span>
                <span className="text-xl font-bold text-indigo-600">{selectedStudent.cgpa} CGPA</span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Student & Parent Contact Info</h4>
              <div className="flex justify-between">
                <span className="text-slate-500">Student Email:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedStudent.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student Phone:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedStudent.phone}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Parent / Guardian:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedStudent.parentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Parent Phone:</span>
                <span className="font-semibold text-indigo-600">{selectedStudent.parentPhone}</span>
              </div>
            </div>

            {/* Academic History */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">Past Academic History</h4>
              <div className="space-y-1.5">
                {selectedStudent.academicHistory.map((h, i) => (
                  <div key={i} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{h.semester}</span>
                    <span className="font-extrabold text-indigo-600">{h.sgpa} SGPA</span>
                    <span className="text-emerald-600 font-bold">{h.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-700">
              <button onClick={() => setSelectedStudent(null)} className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 font-medium text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
