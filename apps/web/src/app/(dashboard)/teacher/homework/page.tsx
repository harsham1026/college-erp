'use client';

import React, { useState, useEffect } from 'react';
import {
  PenTool, Plus, Search, Filter, Calendar, Clock, Download,
  CheckCircle2, Trash2, Edit, FileText, Upload, Paperclip, Eye, ChevronLeft, ChevronRight
} from 'lucide-react';
import { INITIAL_TEACHER_HOMEWORK, TeacherHomeworkItem } from '@/lib/teacherMockData';

export default function TeacherHomeworkPage() {
  const [homeworkList, setHomeworkList] = useState<TeacherHomeworkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState<string>('ALL');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<TeacherHomeworkItem | null>(null);
  const [submissionsItem, setSubmissionsItem] = useState<TeacherHomeworkItem | null>(null);

  // Form states
  const [titleInput, setTitleInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('CS301');
  const [sectionInput, setSectionInput] = useState('CSE-A');
  const [dueDateInput, setDueDateInput] = useState('2026-08-10');
  const [descInput, setDescInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setHomeworkList(INITIAL_TEACHER_HOMEWORK);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;

    if (editItem) {
      setHomeworkList(prev => prev.map(hw => hw.id === editItem.id ? {
        ...hw,
        title: titleInput,
        subjectCode: subjectInput,
        section: sectionInput,
        dueDate: dueDateInput,
        description: descInput,
      } : hw));
      setEditItem(null);
    } else {
      const newHw: TeacherHomeworkItem = {
        id: 'thw-' + Date.now(),
        title: titleInput,
        subjectCode: subjectInput,
        subjectName: subjectInput === 'CS301' ? 'Data Structures & Algorithms' : 'DBMS',
        course: 'B.Tech',
        branch: 'CSE',
        semester: 'Semester 5',
        section: sectionInput,
        assignedDate: new Date().toISOString().substring(0, 10),
        dueDate: dueDateInput,
        description: descInput,
        attachments: [{ name: 'Homework_Prompt.pdf', size: '1.0 MB', url: '#' }],
        totalSubmissions: 0,
        totalStudents: 30,
        gradedSubmissions: 0,
        submissions: [],
      };
      setHomeworkList([newHw, ...homeworkList]);
    }

    setIsCreateOpen(false);
    setTitleInput('');
    setDescInput('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this homework?')) {
      setHomeworkList(prev => prev.filter(h => h.id !== id));
    }
  };

  const handleGradeStudent = (hwId: string, studentId: string, score: number, remarks: string) => {
    setHomeworkList(prev => prev.map(hw => {
      if (hw.id === hwId) {
        const updatedSubmissions = hw.submissions.map(sub => {
          if (sub.studentId === studentId) {
            return { ...sub, score, remarks, status: 'GRADED' as const };
          }
          return sub;
        });
        const gradedCount = updatedSubmissions.filter(s => s.status === 'GRADED').length;
        return { ...hw, submissions: updatedSubmissions, gradedSubmissions: gradedCount };
      }
      return hw;
    }));
  };

  const filteredList = homeworkList.filter(hw => {
    const matchesSearch = hw.title.toLowerCase().includes(search.toLowerCase()) ||
                          hw.subjectCode.toLowerCase().includes(search.toLowerCase());
    const matchesSection = sectionFilter === 'ALL' || hw.section === sectionFilter;
    return matchesSearch && matchesSection;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-100 text-xs font-semibold uppercase tracking-wider mb-1">
            <PenTool className="w-4 h-4" /> Faculty Homework Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Homework & Evaluation</h1>
          <p className="text-amber-100 text-sm mt-1">Assign course homework, review student attachments, grade submissions, and give remarks</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setTitleInput(''); setDescInput(''); setIsCreateOpen(true); }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-amber-950 font-bold text-sm hover:bg-amber-50 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 text-amber-700" /> Create Homework
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search homework by title or subject..."
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

      {/* Homework Cards */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
            Loading assigned homework...
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
            No homework assignments found.
          </div>
        ) : (
          filteredList.map(hw => (
            <div key={hw.id} className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    {hw.subjectCode} • {hw.section}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">Assigned: {hw.assignedDate}</span>
                  <span className="text-xs text-amber-600 font-bold">Due: {hw.dueDate}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{hw.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{hw.description}</p>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
                  <span>Submissions: <strong className="text-slate-900 dark:text-white">{hw.totalSubmissions} / {hw.totalStudents}</strong></span>
                  <span>Graded: <strong className="text-emerald-600">{hw.gradedSubmissions}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => setSubmissionsItem(hw)}
                  className="px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs hover:bg-amber-100 flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" /> View Submissions ({hw.totalSubmissions})
                </button>
                <button
                  onClick={() => {
                    setEditItem(hw);
                    setTitleInput(hw.title);
                    setSubjectInput(hw.subjectCode);
                    setSectionInput(hw.section);
                    setDueDateInput(hw.dueDate);
                    setDescInput(hw.description);
                    setIsCreateOpen(true);
                  }}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-indigo-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(hw.id)}
                  className="p-2 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleCreateSubmit} className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editItem ? 'Edit Homework' : 'Create & Assign Homework'}
              </h3>
              <button type="button" onClick={() => setIsCreateOpen(false)} className="p-2 text-slate-400 text-lg">✕</button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Homework Title</label>
              <input
                type="text"
                required
                value={titleInput}
                onChange={e => setTitleInput(e.target.value)}
                placeholder="e.g. Tree Rotations Problem Set"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Subject</label>
                <select value={subjectInput} onChange={e => setSubjectInput(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-xs font-bold text-slate-900 dark:text-white">
                  <option value="CS301">CS301</option>
                  <option value="CS302">CS302</option>
                  <option value="CS303">CS303</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Section</label>
                <select value={sectionInput} onChange={e => setSectionInput(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-xs font-bold text-slate-900 dark:text-white">
                  <option value="CSE-A">CSE-A</option>
                  <option value="CSE-B">CSE-B</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDateInput}
                  onChange={e => setDueDateInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Description / Guidelines</label>
              <textarea
                rows={3}
                value={descInput}
                onChange={e => setDescInput(e.target.value)}
                placeholder="Instructions for students..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-sm shadow-md hover:bg-amber-700">
                {editItem ? 'Save Changes' : 'Assign Homework'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Submissions & Grading Drawer */}
      {submissionsItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-600">{submissionsItem.subjectCode} • {submissionsItem.section}</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{submissionsItem.title} Submissions</h3>
              </div>
              <button onClick={() => setSubmissionsItem(null)} className="p-2 text-slate-400 text-lg">✕</button>
            </div>

            <div className="space-y-3">
              {submissionsItem.submissions.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center italic">No student submissions recorded yet.</p>
              ) : (
                submissionsItem.submissions.map(sub => (
                  <div key={sub.studentId} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-3 border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{sub.studentName}</h4>
                        <p className="text-xs text-slate-400">{sub.usn} • Submitted on {sub.submittedAt}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        sub.status === 'GRADED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {sub.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-white dark:bg-slate-900">
                      <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{sub.file}</span>
                      <button onClick={() => alert(`Downloading ${sub.file}...`)} className="text-amber-600 font-bold flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" /> Download File
                      </button>
                    </div>

                    {/* Inline Grading Form */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Score (/{sub.maxScore}):</span>
                        <input
                          type="number"
                          max={sub.maxScore}
                          defaultValue={sub.score || ''}
                          onBlur={e => handleGradeStudent(submissionsItem.id, sub.studentId, Number(e.target.value), sub.remarks || '')}
                          className="w-16 p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          defaultValue={sub.remarks || ''}
                          placeholder="Faculty remarks..."
                          onBlur={e => handleGradeStudent(submissionsItem.id, sub.studentId, sub.score || 0, e.target.value)}
                          className="w-full p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-700">
              <button onClick={() => setSubmissionsItem(null)} className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
