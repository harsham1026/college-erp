'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon, Plus, Clock, MapPin, Search, Filter,
  BookOpen, Users, Award, AlertCircle, FileText
} from 'lucide-react';
import { INITIAL_CALENDAR_EVENTS, CalendarEventItem } from '@/lib/teacherMockData';

export default function TeacherCalendarPage() {
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [catInput, setCatInput] = useState<CalendarEventItem['category']>('Meeting');
  const [dateInput, setDateInput] = useState('2026-08-10');
  const [timeInput, setTimeInput] = useState('02:00 PM - 03:00 PM');
  const [locationInput, setLocationInput] = useState('CS Boardroom');

  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents(INITIAL_CALENDAR_EVENTS);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;

    const newEv: CalendarEventItem = {
      id: 'cal-' + Date.now(),
      title: titleInput,
      category: catInput,
      date: dateInput,
      timeSlot: timeInput,
      location: locationInput,
    };

    setEvents([...events, newEv]);
    setIsAddOpen(false);
    setTitleInput('');
  };

  const filteredEvents = events.filter(e => categoryFilter === 'ALL' || e.category === categoryFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-violet-950 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <CalendarIcon className="w-4 h-4" /> Academic Schedule
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Faculty Calendar & Events</h1>
          <p className="text-indigo-200 text-sm mt-1">Track classes, exam dates, staff meetings, holidays, and personal notes</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-950 font-bold text-sm hover:bg-indigo-50 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 text-indigo-700" /> Add Personal Note / Event
        </button>
      </div>

      {/* Categories Filter */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex flex-wrap items-center gap-2">
        {['ALL', 'Class', 'Exam', 'Meeting', 'Holiday', 'Personal Note'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              categoryFilter === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
            Loading calendar...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-slate-500 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
            No calendar events scheduled in this category.
          </div>
        ) : (
          filteredEvents.map(ev => (
            <div key={ev.id} className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] hover:shadow-lg transition-all flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    ev.category === 'Class' ? 'bg-blue-100 text-blue-800' :
                    ev.category === 'Exam' ? 'bg-purple-100 text-purple-800' :
                    ev.category === 'Meeting' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {ev.category}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{ev.date}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{ev.title}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-indigo-500" /> {ev.timeSlot}</span>
                  {ev.location && <span className="flex items-center gap-1 font-semibold"><MapPin className="w-3.5 h-3.5 text-rose-500" /> {ev.location}</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleAddSubmit} className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Calendar Event / Note</h3>
              <button type="button" onClick={() => setIsAddOpen(false)} className="p-2 text-slate-400 text-lg">✕</button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Title</label>
              <input type="text" required value={titleInput} onChange={e => setTitleInput(e.target.value)} placeholder="e.g. Department Meeting" className="w-full p-3 rounded-xl bg-slate-50 border text-sm text-slate-900 dark:text-white" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Category</label>
                <select value={catInput} onChange={e => setCatInput(e.target.value as any)} className="w-full p-3 rounded-xl bg-slate-50 border text-xs font-bold text-slate-900 dark:text-white">
                  <option value="Meeting">Meeting</option>
                  <option value="Personal Note">Personal Note</option>
                  <option value="Exam">Exam</option>
                  <option value="Event">Event</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Date</label>
                <input type="date" value={dateInput} onChange={e => setDateInput(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 border text-xs font-bold text-slate-900 dark:text-white" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Location / Venue</label>
              <input type="text" value={locationInput} onChange={e => setLocationInput(e.target.value)} placeholder="Location..." className="w-full p-3 rounded-xl bg-slate-50 border text-sm text-slate-900 dark:text-white" />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm">Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700">Save Event</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
