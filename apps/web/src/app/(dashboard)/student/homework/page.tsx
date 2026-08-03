'use client';

import React, { useState, useEffect } from 'react';
import {
  PenTool, Calendar, Clock, Download, Search, Filter,
  FileText, Upload, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight,
  Send, Paperclip, ExternalLink, Eye, ArrowUpRight
} from 'lucide-react';
import { INITIAL_HOMEWORK, HomeworkItem } from '@/lib/studentMockData';

export default function StudentHomeworkPage() {
  const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const limit = 5;

  // Modals
  const [selectedHW, setSelectedHW] = useState<HomeworkItem | null>(null);
  const [submitModalHW, setSubmitModalHW] = useState<HomeworkItem | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [historyHW, setHistoryHW] = useState<HomeworkItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHomeworkList(INITIAL_HOMEWORK);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredHomework = homeworkList.filter((hw) => {
    const matchesSearch = hw.title.toLowerCase().includes(search.toLowerCase()) ||
                          hw.subject.toLowerCase().includes(search.toLowerCase()) ||
                          hw.faculty.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || hw.status === statusFilter;
    const matchesSubject = selectedSubject === 'ALL' || hw.subjectCode === selectedSubject;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const totalPages = Math.ceil(filteredHomework.length / limit) || 1;
  const paginatedHomework = filteredHomework.slice((page - 1) * limit, page * limit);

  const handleSubmitHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitModalHW) return;

    const updated = homeworkList.map((hw) => {
      if (hw.id === submitModalHW.id) {
        return {
          ...hw,
          status: 'SUBMITTED' as const,
          submission: {
            submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            file: uploadedFileName || 'Student_Homework_Submission.pdf',
            notes: submissionNotes || 'Submitted online via student portal.',
          },
        };
      }
      return hw;
    });

    setHomeworkList(updated);
    setSubmitModalHW(null);
    setSubmissionNotes('');
    setUploadedFileName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-100 text-xs font-semibold uppercase tracking-wider mb-1">
            <PenTool className="w-4 h-4" /> Academic Tasks
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Homework Management</h1>
          <p className="text-amber-100 text-sm mt-1">Review assigned homework, download resources, and submit work before deadlines</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-center">
            <span className="text-xs text-amber-100 block">Pending</span>
            <span className="text-xl font-bold">{homeworkList.filter(h => h.status === 'PENDING').length} Tasks</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search homework by title, subject or faculty..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 border-0"
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
            <option value="GRADED">Graded</option>
            <option value="OVERDUE">Overdue</option>
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
            <option value="CS304">CS304 - Computer Networks</option>
          </select>
        </div>
      </div>

      {/* Homework List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] text-center text-slate-500">
            Loading homework list...
          </div>
        ) : paginatedHomework.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] text-center">
            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-700 dark:text-slate-300 font-semibold">No homework found</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          paginatedHomework.map((hw) => (
            <div
              key={hw.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    {hw.subjectCode} - {hw.subject}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    hw.status === 'PENDING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    hw.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                    hw.status === 'GRADED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                  }`}>
                    {hw.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{hw.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{hw.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span>Faculty: <strong className="text-slate-700 dark:text-slate-200">{hw.faculty}</strong></span>
                  <span>Assigned: {hw.assignedDate}</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">Due: {hw.dueDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 self-end md:self-center">
                <button
                  onClick={() => setSelectedHW(hw)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" /> View Details
                </button>
                {hw.status === 'PENDING' && (
                  <button
                    onClick={() => setSubmitModalHW(hw)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" /> Submit Homework
                  </button>
                )}
                {hw.submission && (
                  <button
                    onClick={() => setHistoryHW(hw)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Submission Info
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredHomework.length > limit && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-xs text-slate-500">Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, filteredHomework.length)} of {filteredHomework.length} entries</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Homework Detail Modal */}
      {selectedHW && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2.5 py-0.5 rounded-md">
                  {selectedHW.subjectCode} • {selectedHW.subject}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{selectedHW.title}</h3>
              </div>
              <button onClick={() => setSelectedHW(null)} className="p-2 text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{selectedHW.description}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Attachments</p>
              {selectedHW.attachments.length > 0 ? (
                <div className="space-y-2">
                  {selectedHW.attachments.map((att, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                      <div className="flex items-center gap-3">
                        <Paperclip className="w-4 h-4 text-amber-500" />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{att.name}</p>
                          <p className="text-xs text-slate-400">{att.size}</p>
                        </div>
                      </div>
                      <a
                        href={att.url}
                        download
                        onClick={(e) => { e.preventDefault(); alert(`Downloading ${att.name}...`); }}
                        className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 hover:bg-amber-100 text-xs font-semibold flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" /> Download
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No attachments provided.</p>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button onClick={() => setSelectedHW(null)} className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Homework Modal */}
      {submitModalHW && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleSubmitHomework} className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submit Homework</h3>
              <button type="button" onClick={() => setSubmitModalHW(null)} className="p-2 text-slate-400 text-lg">✕</button>
            </div>
            <div>
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400">{submitModalHW.subjectCode} - {submitModalHW.subject}</p>
              <h4 className="text-base font-semibold text-slate-900 dark:text-white">{submitModalHW.title}</h4>
            </div>

            {/* File Upload Box */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-amber-500 transition-colors">
              <Upload className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Click or drag file to upload solution</p>
              <p className="text-xs text-slate-400 mt-1">PDF, ZIP, DOCX up to 25MB</p>
              <input
                type="file"
                className="hidden"
                id="hw-upload-input"
                onChange={(e) => setUploadedFileName(e.target.files?.[0]?.name || '')}
              />
              <label
                htmlFor="hw-upload-input"
                className="mt-3 inline-block px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold cursor-pointer"
              >
                {uploadedFileName ? `Selected: ${uploadedFileName}` : 'Choose File'}
              </label>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Submission Notes / Explanation
              </label>
              <textarea
                rows={3}
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                placeholder="Write any additional notes for the faculty..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button type="button" onClick={() => setSubmitModalHW(null)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold text-sm shadow-md hover:bg-amber-700">
                Confirm & Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Submission History Modal */}
      {historyHW && historyHW.submission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submission Details</h3>
              <button onClick={() => setHistoryHW(null)} className="p-2 text-slate-400 text-lg">✕</button>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Submitted Successfully</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">Timestamp: {historyHW.submission.submittedAt}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Submitted File</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">{historyHW.submission.file}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Student Notes</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                  {historyHW.submission.notes || 'No notes attached.'}
                </p>
              </div>
              {historyHW.submission.grade && (
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">Faculty Evaluation</p>
                  <p className="text-2xl font-extrabold text-indigo-900 dark:text-indigo-200 mt-1">{historyHW.submission.grade}</p>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">{historyHW.submission.feedback}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-700">
              <button onClick={() => setHistoryHW(null)} className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
