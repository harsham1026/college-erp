'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, MapPin, User, Download, Search,
  Filter, Sparkles, Printer, Layers, Eye
} from 'lucide-react';
import { INITIAL_TIMETABLE, TimetableSlot } from '@/lib/studentMockData';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export default function StudentTimetablePage() {
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimetableSlot | null>(null);

  const currentDayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon...
  const todayName = DAYS[currentDayIndex - 1] || 'Monday';

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimetable(INITIAL_TIMETABLE);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const filteredSlots = timetable.filter(slot => {
    const matchesDay = selectedDayFilter === 'ALL' || slot.day === selectedDayFilter;
    const matchesSearch = slot.subject.toLowerCase().includes(search.toLowerCase()) ||
                          slot.faculty.toLowerCase().includes(search.toLowerCase()) ||
                          slot.room.toLowerCase().includes(search.toLowerCase());
    return matchesDay && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" /> Academic Schedule
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Weekly Class Timetable</h1>
          <p className="text-blue-200 text-sm mt-1">Semester 5 Computer Science & Engineering • Section A</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-semibold text-sm hover:bg-blue-50 shadow-md transition-all"
          >
            <Printer className="w-4 h-4" /> Export Timetable PDF
          </button>
        </div>
      </div>

      {/* Filter and Day Selector */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search class by subject, room or faculty..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none border-0"
          />
        </div>

        {/* Day Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
          <button
            onClick={() => setSelectedDayFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedDayFilter === 'ALL'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All Days
          </button>
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDayFilter(day)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                selectedDayFilter === day
                  ? 'bg-indigo-600 text-white shadow-md'
                  : day === todayName
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {day}
              {day === todayName && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or List View */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          Loading timetable grid...
        </div>
      ) : selectedDayFilter === 'ALL' ? (
        /* Full Weekly Matrix Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DAYS.map((day) => {
            const daySlots = filteredSlots.filter(s => s.day === day);
            const isToday = day === todayName;
            return (
              <div
                key={day}
                className={`rounded-2xl border p-5 transition-all ${
                  isToday
                    ? 'bg-gradient-to-b from-indigo-50/50 to-white dark:from-indigo-950/30 dark:to-[#1e293b] border-indigo-300 dark:border-indigo-700 shadow-md'
                    : 'bg-white dark:bg-[#1e293b] border-slate-200 dark:border-[#334155]'
                }`}
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {day}
                    {isToday && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white">
                        Today
                      </span>
                    )}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">{daySlots.length} Classes</span>
                </div>

                <div className="space-y-3">
                  {daySlots.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center italic">No scheduled lectures</p>
                  ) : (
                    daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer transition-all space-y-1.5 group"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {slot.timeSlot}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            slot.type === 'Lab' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                            slot.type === 'Tutorial' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          }`}>
                            {slot.type}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                          {slot.subject}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                          <span className="flex items-center gap-1"><User className="w-3 h-3 text-slate-400" /> {slot.faculty}</span>
                          <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300"><MapPin className="w-3 h-3 text-rose-500" /> {slot.room}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Single Day Detailed View */
        <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Schedule for {selectedDayFilter}
          </h3>
          {filteredSlots.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-10">No classes scheduled on {selectedDayFilter}.</p>
          ) : (
            <div className="space-y-3">
              {filteredSlots.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex flex-col items-center">
                      <Clock className="w-4 h-4 mb-1" />
                      {slot.timeSlot}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{slot.subjectCode}</span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">{slot.subject}</h4>
                      <p className="text-xs text-slate-500">Faculty: {slot.faculty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" /> {slot.room}
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-indigo-100 text-indigo-800 text-xs font-bold">
                      {slot.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Class Modal Details */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{selectedSlot.subjectCode}</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedSlot.subject}</h3>
              </div>
              <button onClick={() => setSelectedSlot(null)} className="p-2 text-slate-400 text-lg">✕</button>
            </div>
            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Day & Time</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedSlot.day}, {selectedSlot.timeSlot}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Faculty</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedSlot.faculty}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Classroom / Hall</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedSlot.room}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Session Type</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedSlot.type}</span>
              </div>
            </div>
            <div className="flex justify-end pt-3">
              <button onClick={() => setSelectedSlot(null)} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
