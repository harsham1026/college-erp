'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText, Plus, Search, Filter, Calendar, Award, Download,
  Trash2, Edit, Upload, Eye, CheckCircle2, MessageSquare
} from 'lucide-react';
import { INITIAL_TEACHER_ASSIGNMENTS, TeacherAssignmentItem } from '@/lib/teacherMockData';

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<TeacherAssignmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<TeacherAssignmentItem | null>(null);
  const [submissionsItem, setSubmissionsItem] = useState<TeacherAssignmentItem | null>(null);

  // Form inputs
  const [titleInput, setTitleInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('CS301');
  const [sectionsInput, setSectionsInput] = useState<string[]>(['CSE-A', 'CSE-B']);
  const [deadlineInput, setDeadlineInput] = useState('2026-08-20');
  const [totalMarksInput, setTotalMarksInput] = useState(25);
  const [descInput, setDescInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAssignments(INITIAL_TEACHER_ASSIGNMENTS);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;

    if (editItem) {
      setAssignments(prev => prev.map(a => a.id === editItem.id ? {
        ...a,
        title: titleInput,
        subjectCode: subjectInput,
        sections: sectionsInput,
        deadline: deadlineInput,
        totalMarks: totalMarksInput,
        description: descInput,
      } : a));
      setEditItem(null);
    } else {
      const newAsg: TeacherAssignmentItem = {
        id: 'tasg-' + Date.now(),
        title: titleInput,
        subjectCode: subjectInput,
        subjectName: subjectInput === 'CS301' ? 'Data Structures & Algorithms' : 'DBMS',
        sections: sectionsInput,
        deadline: deadlineInput,
        totalMarks: totalMarksInput,
        description: descInput,
        attachments: [{ name: 'Assignment_Guidelines.pdf', size: '2.1 MB', url: '#' }],
        submissions: [],
      };
      setAssignments([newAsg, ...assignments]);
    }

    setIsCreateOpen(false);
    setTitleInput('');
    setDescInput('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete assignment?')) {
      setAssignments(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleGradeStudent = (asgId: string, studentId: string, score: number, feedback: string) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === asgId) {
        const updatedSubs = a.submissions.map(sub => {
          if (sub.studentId === studentId) {
            return { ...sub, score, feedback, status: 'GRADED' as const };
          }
          return sub;
        });
        return { ...a, submissions: updatedSubs };
      }
      return a;
    }));
  };

  const filtered = assignments.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.subjectCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 via-cyan-700 to-indigo-800 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" /> Academic Course Assignments
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Assignment Management</h1>
          <p className="text-cyan-100 text-sm mt-1">Create term assignments across multiple sections, download student submissions, and grade work</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setTitleInput(''); setDescInput(''); setIsCreateOpen(true); }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-cyan-950 font-bold text-sm hover:bg-cyan-50 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 text-cyan-700" /> Create Assignment
        </button>
      </div>

      {/* Filter */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search assignments..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white border-0"
          />
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
            Loading assignments...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
            No assignments created.
          </div>
        ) : (
          filtered.map(asg => (
            <div key={asg.id} className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                    {asg.subjectCode} • {asg.sections.join(', ')}
                  </span>
                  <span className="text-xs text-red-500 font-bold">Deadline: {asg.deadline}</span>
                  <span className="text-xs text-indigo-600 font-bold">{asg.totalMarks} Marks</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{asg.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{asg.description}</p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => setSubmissionsItem(asg)}
                  className="px-4 py-2 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold text-xs hover:bg-cyan-100 flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" /> View Submissions ({asg.submissions.length})
                </button>
                <button
                  onClick={() => {
                    setEditItem(asg);
                    setTitleInput(asg.title);
                    setSubjectInput(asg.subjectCode);
                    setDeadlineInput(asg.deadline);
                    setTotalMarksInput(asg.totalMarks);
                    setDescInput(asg.description);
                    setIsCreateOpen(true);
                  }}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-indigo-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(asg.id)} className="p-2 rounded-xl bg-red-50 dark:bg-red-950 text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleCreateSubmit} className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editItem ? 'Edit Assignment' : 'Create Course Assignment'}
              </h3>
              <button type="button" onClick={() => setIsCreateOpen(false)} className="p-2 text-slate-400 text-lg">✕</button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Assignment Title</label>
              <input
                type="text"
                required
                value={titleInput}
                onChange={e => setTitleInput(e.target.value)}
                placeholder="e.g. Multi-threaded Bank Processor"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Subject</label>
                <select value={subjectInput} onChange={e => setSubjectInput(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-xs font-bold text-slate-900 dark:text-white">
                  <option value="CS301">CS301</option>
                  <option value="CS302">CS302</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Deadline</label>
                <input type="date" value={deadlineInput} onChange={e => setDeadlineInput(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-xs font-bold text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Total Marks</label>
                <input type="number" value={totalMarksInput} onChange={e => setTotalMarksInput(Number(e.target.value))} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-xs font-bold text-slate-900 dark:text-white" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Detailed Description & Criteria</label>
              <textarea rows={3} value={descInput} onChange={e => setDescInput(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-sm text-slate-900 dark:text-white focus:outline-none" />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 text-sm">Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-sm shadow-md hover:bg-cyan-700">Save Assignment</button>
            </div>
          </form>
        </div>
      )}

      {/* Submissions Drawer */}
      {submissionsItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-3">
              <div>
                <span className="text-xs font-bold text-cyan-600">{submissionsItem.subjectCode}</span>
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
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{sub.studentName} ({sub.section})</h4>
                        <p className="text-xs text-slate-400">{sub.usn} • {sub.submittedAt}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800">{sub.status}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-white dark:bg-slate-900">
                      <span className="font-mono text-cyan-600 font-semibold">{sub.fileName}</span>
                      <button onClick={() => alert(`Downloading ${sub.fileName}...`)} className="text-cyan-600 font-bold flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <input
                        type="number"
                        max={submissionsItem.totalMarks}
                        defaultValue={sub.score || ''}
                        placeholder="Marks"
                        onBlur={e => handleGradeStudent(submissionsItem.id, sub.studentId, Number(e.target.value), sub.feedback || '')}
                        className="w-20 p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 text-xs font-bold text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        defaultValue={sub.feedback || ''}
                        placeholder="Feedback..."
                        onBlur={e => handleGradeStudent(submissionsItem.id, sub.studentId, sub.score || 0, e.target.value)}
                        className="flex-1 p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-700">
              <button onClick={() => setSubmissionsItem(null)} className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
