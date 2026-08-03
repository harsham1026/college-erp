'use client';

import React, { useState, useEffect } from 'react';
import {
  Award, Save, Lock, LockKeyholeOpen, Share2, Download,
  Printer, Search, Filter, CheckCircle2, BarChart3
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { INITIAL_STUDENT_MARKS, StudentMarksEntry } from '@/lib/teacherMockData';

export default function TeacherMarksPage() {
  const [marks, setMarks] = useState<StudentMarksEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('CS301');
  const [isLocked, setIsLocked] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMarks(INITIAL_STUDENT_MARKS);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleMarkChange = (studentId: string, field: keyof StudentMarksEntry, val: number) => {
    if (isLocked) return;
    setMarks(prev => prev.map(m => {
      if (m.studentId === studentId) {
        const updated = { ...m, [field]: val };
        const total = updated.internalMarks + updated.labMarks + updated.assignmentMarks + updated.quizMarks;
        const grade = total >= 75 ? 'S' : total >= 65 ? 'A' : total >= 55 ? 'B' : total >= 45 ? 'C' : 'F';
        return { ...updated, totalMarks: total, grade };
      }
      return m;
    }));
  };

  const handleSaveMarks = () => {
    alert('Internal marks records saved to database successfully!');
  };

  const gradeDistribution = [
    { grade: 'S Grade (≥75)', count: marks.filter(m => m.grade === 'S').length },
    { grade: 'A Grade (65-74)', count: marks.filter(m => m.grade === 'A').length },
    { grade: 'B Grade (55-64)', count: marks.filter(m => m.grade === 'B').length },
    { grade: 'C Grade (45-54)', count: marks.filter(m => m.grade === 'C').length },
    { grade: 'F Grade (<45)', count: marks.filter(m => m.grade === 'F').length },
  ];

  const handleExportCSV = () => {
    const headers = ['USN', 'Student Name', 'Subject', 'Internal (30)', 'Lab (20)', 'Assignment (20)', 'Quiz (10)', 'Total (80)', 'Grade'];
    const rows = marks.map(m => [m.usn, m.studentName, m.subjectCode, m.internalMarks, m.labMarks, m.assignmentMarks, m.quizMarks, m.totalMarks, m.grade]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Marks_${subject}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = marks.filter(m =>
    m.studentName.toLowerCase().includes(search.toLowerCase()) ||
    m.usn.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" /> Internal Assessment Grading
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Marks Entry & Publishing</h1>
          <p className="text-emerald-200 text-sm mt-1">Enter internal test, lab, quiz, and assignment marks for student grade distribution</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              isLocked ? 'bg-red-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <LockKeyholeOpen className="w-4 h-4" />}
            {isLocked ? 'Marks Locked' : 'Lock Marks'}
          </button>
          <button
            onClick={handleSaveMarks}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs shadow-md transition-all"
          >
            <Save className="w-4 h-4 text-emerald-700" /> Save Changes
          </button>
        </div>
      </div>

      {/* Grade Distribution Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Class Grade Distribution Summary</h3>
          <button onClick={handleExportCSV} className="text-xs font-bold text-indigo-600 flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> Export Excel
          </button>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gradeDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', background: '#1e293b', color: '#fff', border: 'none' }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search Bar */}
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
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Status:</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            {isPublished ? 'PUBLISHED TO STUDENTS' : 'DRAFT MODE'}
          </span>
        </div>
      </div>

      {/* Marks Table */}
      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading student marks...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-[#334155]">
                  <th className="px-6 py-4">USN & Student Name</th>
                  <th className="px-4 py-4 text-center">Internal Test (30)</th>
                  <th className="px-4 py-4 text-center">Lab Exam (20)</th>
                  <th className="px-4 py-4 text-center">Assignment (20)</th>
                  <th className="px-4 py-4 text-center">Quiz (10)</th>
                  <th className="px-4 py-4 text-center">Total (80)</th>
                  <th className="px-4 py-4 text-center">Calculated Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map(m => (
                  <tr key={m.studentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mr-2">{m.usn}</span>
                        <span className="font-semibold text-slate-900 dark:text-white text-sm">{m.studentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        type="number"
                        disabled={isLocked}
                        max={30}
                        value={m.internalMarks}
                        onChange={e => handleMarkChange(m.studentId, 'internalMarks', Number(e.target.value))}
                        className="w-16 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-center font-bold text-xs text-slate-900 dark:text-white border-0"
                      />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        type="number"
                        disabled={isLocked}
                        max={20}
                        value={m.labMarks}
                        onChange={e => handleMarkChange(m.studentId, 'labMarks', Number(e.target.value))}
                        className="w-16 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-center font-bold text-xs text-slate-900 dark:text-white border-0"
                      />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        type="number"
                        disabled={isLocked}
                        max={20}
                        value={m.assignmentMarks}
                        onChange={e => handleMarkChange(m.studentId, 'assignmentMarks', Number(e.target.value))}
                        className="w-16 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-center font-bold text-xs text-slate-900 dark:text-white border-0"
                      />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        type="number"
                        disabled={isLocked}
                        max={10}
                        value={m.quizMarks}
                        onChange={e => handleMarkChange(m.studentId, 'quizMarks', Number(e.target.value))}
                        className="w-16 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-center font-bold text-xs text-slate-900 dark:text-white border-0"
                      />
                    </td>
                    <td className="px-4 py-4 text-center font-extrabold text-slate-900 dark:text-white text-base">
                      {m.totalMarks}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
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
