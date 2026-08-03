'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText, Calendar, Award, Upload, RefreshCw, CheckCircle2,
  Search, Filter, Clock, Eye, AlertCircle, ChevronLeft, ChevronRight, MessageSquare
} from 'lucide-react';
import { INITIAL_ASSIGNMENTS, AssignmentItem } from '@/lib/studentMockData';

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const limit = 5;

  // Modals
  const [uploadModal, setUploadModal] = useState<{ hw: AssignmentItem; isReplace: boolean } | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [feedbackModal, setFeedbackModal] = useState<AssignmentItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAssignments(INITIAL_ASSIGNMENTS);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const filtered = assignments.filter((asg) => {
    const matchesSearch = asg.title.toLowerCase().includes(search.toLowerCase()) ||
                          asg.subject.toLowerCase().includes(search.toLowerCase()) ||
                          asg.faculty.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || asg.status === statusFilter;
    const matchesSubject = selectedSubject === 'ALL' || asg.subjectCode === selectedSubject;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const totalPages = Math.ceil(filtered.length / limit) || 1;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadModal) return;

    const updated = assignments.map((a) => {
      if (a.id === uploadModal.hw.id) {
        return {
          ...a,
          status: 'SUBMITTED' as const,
          submission: {
            submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            fileName: uploadedFileName || 'Assignment_Final_Submission.pdf',
            fileUrl: '#',
            feedback: a.submission?.feedback,
          },
        };
      }
      return a;
    });

    setAssignments(updated);
    setUploadModal(null);
    setUploadedFileName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-700 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-100 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" /> Course Evaluations
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Assignments Portal</h1>
          <p className="text-cyan-100 text-sm mt-1">Upload term assignments, re-submit prior to deadlines, and read faculty evaluations</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl text-center">
          <span className="text-xs text-cyan-100 block">Total Marks Weightage</span>
          <span className="text-2xl font-bold">75 Marks</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assignment title or subject..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none border-0"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none border-0"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="EVALUATED">Evaluated</option>
          </select>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none border-0"
          >
            <option value="ALL">All Subjects</option>
            <option value="CS301">CS301 - Data Structures</option>
            <option value="CS302">CS302 - DBMS</option>
            <option value="CS303">CS303 - Operating Systems</option>
          </select>
        </div>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] text-center text-slate-500">
            Loading assignments...
          </div>
        ) : paginated.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] text-center">
            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-700 dark:text-slate-300 font-semibold">No assignments found</p>
          </div>
        ) : (
          paginated.map((asg) => (
            <div key={asg.id} className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                    {asg.subjectCode} - {asg.subject}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    asg.status === 'PENDING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    asg.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                    'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {asg.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{asg.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{asg.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span>Faculty: <strong className="text-slate-700 dark:text-slate-200">{asg.faculty}</strong></span>
                  <span className="text-red-500 font-semibold">Due: {asg.dueDate}</span>
                  <span>Max Score: <strong className="text-indigo-600 dark:text-indigo-400">{asg.totalMarks} Marks</strong></span>
                  {asg.obtainedMarks !== undefined && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                      Score: {asg.obtainedMarks} / {asg.totalMarks}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2.5 self-end md:self-center">
                {asg.status === 'PENDING' && (
                  <button
                    onClick={() => setUploadModal({ hw: asg, isReplace: false })}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white text-xs font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" /> Upload Solution
                  </button>
                )}
                {asg.status === 'SUBMITTED' && (
                  <button
                    onClick={() => setUploadModal({ hw: asg, isReplace: true })}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" /> Replace Submission
                  </button>
                )}
                {asg.submission && (
                  <button
                    onClick={() => setFeedbackModal(asg)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" /> View Feedback
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload/Replace Modal */}
      {uploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleUploadSubmit} className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {uploadModal.isReplace ? 'Replace Submission' : 'Upload Assignment'}
              </h3>
              <button type="button" onClick={() => setUploadModal(null)} className="p-2 text-slate-400 text-lg">✕</button>
            </div>
            <div>
              <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400">{uploadModal.hw.subjectCode} - {uploadModal.hw.subject}</p>
              <h4 className="text-base font-semibold text-slate-900 dark:text-white">{uploadModal.hw.title}</h4>
            </div>

            <div className="border-2 border-dashed border-cyan-300 dark:border-cyan-800 bg-cyan-50/50 dark:bg-cyan-950/30 rounded-2xl p-6 text-center">
              <Upload className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Choose Assignment Document</p>
              <p className="text-xs text-slate-400 mt-1">PDF, ZIP file up to 50MB</p>
              <input
                type="file"
                className="hidden"
                id="asg-file-upload"
                onChange={(e) => setUploadedFileName(e.target.files?.[0]?.name || '')}
              />
              <label
                htmlFor="asg-file-upload"
                className="mt-3 inline-block px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold cursor-pointer hover:bg-cyan-700"
              >
                {uploadedFileName ? `File: ${uploadedFileName}` : 'Select File'}
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button type="button" onClick={() => setUploadModal(null)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-cyan-600 text-white font-bold text-sm hover:bg-cyan-700 shadow-md">
                Submit File
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModal && feedbackModal.submission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submission & Evaluation</h3>
              <button onClick={() => setFeedbackModal(null)} className="p-2 text-slate-400 text-lg">✕</button>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">Evaluation Score</span>
                <span className="text-xs text-slate-500">Evaluated on {feedbackModal.submission.submittedAt}</span>
              </div>
              <p className="text-3xl font-extrabold text-indigo-900 dark:text-indigo-200 mt-2">
                {feedbackModal.obtainedMarks ?? '--'} / {feedbackModal.totalMarks}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Faculty Feedback Comments</p>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300">
                {feedbackModal.submission.feedback || 'No comments provided by reviewer yet.'}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Uploaded Document</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{feedbackModal.submission.fileName}</p>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-700">
              <button onClick={() => setFeedbackModal(null)} className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
