'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell, Plus, Search, Filter, Trash2, Edit, Calendar,
  Paperclip, Send, Clock, Users, CheckCircle2
} from 'lucide-react';
import { INITIAL_ANNOUNCEMENTS, AnnouncementItem } from '@/lib/teacherMockData';

export default function TeacherAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [targetInput, setTargetInput] = useState('CSE-A');
  const [contentInput, setContentInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;

    const newAnc: AnnouncementItem = {
      id: 'anc-' + Date.now(),
      title: titleInput,
      content: contentInput,
      targetSection: targetInput,
      createdDate: new Date().toISOString().substring(0, 10),
      author: 'Dr. Ramesh Kumar',
      attachments: [],
    };

    setAnnouncements([newAnc, ...announcements]);
    setIsCreateOpen(false);
    setTitleInput('');
    setContentInput('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete announcement?')) {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    }
  };

  const filtered = announcements.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-100 text-xs font-semibold uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" /> Broadcast Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Class Announcements</h1>
          <p className="text-amber-100 text-sm mt-1">Broadcast circulars, timetable updates, and exam notices to your assigned sections</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-amber-950 font-bold text-sm hover:bg-amber-50 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 text-amber-700" /> New Announcement
        </button>
      </div>

      {/* Filter */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search announcements..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white border-0"
          />
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
            Loading announcements...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
            No announcements found.
          </div>
        ) : (
          filtered.map(anc => (
            <div key={anc.id} className="p-6 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    Target: {anc.targetSection}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{anc.createdDate}</span>
                </div>
                <button onClick={() => handleDelete(anc.id)} className="p-1 text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{anc.title}</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{anc.content}</p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span>By {anc.author}</span>
                {anc.attachments.length > 0 && (
                  <span className="flex items-center gap-1 font-semibold text-indigo-600">
                    <Paperclip className="w-3.5 h-3.5" /> {anc.attachments.length} Attachment
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleCreateSubmit} className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Broadcast Announcement</h3>
              <button type="button" onClick={() => setIsCreateOpen(false)} className="p-2 text-slate-400 text-lg">✕</button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Title</label>
              <input type="text" required value={titleInput} onChange={e => setTitleInput(e.target.value)} placeholder="e.g. Rescheduled Lab Session" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm text-slate-900 dark:text-white" />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Target Section</label>
              <select value={targetInput} onChange={e => setTargetInput(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 border text-xs font-bold text-slate-900 dark:text-white">
                <option value="CSE-A">CSE-A</option>
                <option value="CSE-B">CSE-B</option>
                <option value="ALL SECTIONS">All Sections</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Content</label>
              <textarea rows={4} required value={contentInput} onChange={e => setContentInput(e.target.value)} placeholder="Write message for students..." className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm text-slate-900 dark:text-white" />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm">Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-sm hover:bg-amber-700">Send Announcement</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
