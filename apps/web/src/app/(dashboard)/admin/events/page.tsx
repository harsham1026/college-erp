'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import {
  getMockCollection, saveMockItem, deleteMockItem,
  DEFAULT_EVENTS, DEFAULT_CLUBS, DEFAULT_EVENT_REGISTRATIONS, DEFAULT_ANNOUNCEMENTS,
} from '@/lib/mockDb';
import { Calendar, Users, Bell, Award, X, Sparkles } from 'lucide-react';

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<'events' | 'clubs' | 'registrations' | 'announcements'>('events');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // --- EVENTS ---
  const [events, setEvents] = useState<any[]>([]);
  const [evtTotal, setEvtTotal] = useState(0);
  const [evtPage, setEvtPage] = useState(1);
  const [evtLimit, setEvtLimit] = useState(10);
  const [evtSearch, setEvtSearch] = useState('');
  const [evtLoading, setEvtLoading] = useState(true);
  const [showEvtModal, setShowEvtModal] = useState(false);
  const [editEvt, setEditEvt] = useState<any>(null);
  const [evtForm, setEvtForm] = useState({ title: '', category: 'Technical', organizer: '', venue: '', startDate: '', endDate: '', budget: 50000 });

  // --- CLUBS ---
  const [clubs, setClubs] = useState<any[]>([]);
  const [clubTotal, setClubTotal] = useState(0);
  const [clubPage, setClubPage] = useState(1);
  const [clubLimit, setClubLimit] = useState(10);
  const [clubSearch, setClubSearch] = useState('');
  const [clubLoading, setClubLoading] = useState(true);
  const [showClubModal, setShowClubModal] = useState(false);
  const [editClub, setEditClub] = useState<any>(null);
  const [clubForm, setClubForm] = useState({ name: '', code: '', leadStudent: '', facultyAdvisor: '', category: 'Technical', memberCount: 50 });

  // --- REGISTRATIONS & ANNOUNCEMENTS ---
  const [regs, setRegs] = useState<any[]>([]);
  const [anns, setAnns] = useState<any[]>([]);

  const fetchEvents = useCallback(async () => {
    setEvtLoading(true);
    try {
      const res: any = await api.get('/events', { page: evtPage, limit: evtLimit, search: evtSearch });
      setEvents(res.data || []);
      setEvtTotal(res.pagination?.total || 0);
    } catch {
      const res = getMockCollection('mock_events', DEFAULT_EVENTS, {
        page: evtPage, limit: evtLimit, search: evtSearch, searchFields: ['title', 'category', 'organizer', 'venue'],
      });
      setEvents(res.data);
      setEvtTotal(res.pagination.total);
    } finally { setEvtLoading(false); }
  }, [evtPage, evtLimit, evtSearch]);

  const fetchClubs = useCallback(async () => {
    setClubLoading(true);
    try {
      const res: any = await api.get('/clubs', { page: clubPage, limit: clubLimit, search: clubSearch });
      setClubs(res.data || []);
      setClubTotal(res.pagination?.total || 0);
    } catch {
      const res = getMockCollection('mock_clubs', DEFAULT_CLUBS, {
        page: clubPage, limit: clubLimit, search: clubSearch, searchFields: ['name', 'code', 'leadStudent', 'facultyAdvisor'],
      });
      setClubs(res.data);
      setClubTotal(res.pagination.total);
    } finally { setClubLoading(false); }
  }, [clubPage, clubLimit, clubSearch]);

  useEffect(() => {
    if (activeTab === 'events') fetchEvents();
    else if (activeTab === 'clubs') fetchClubs();
    else if (activeTab === 'registrations') setRegs(DEFAULT_EVENT_REGISTRATIONS);
    else if (activeTab === 'announcements') setAnns(DEFAULT_ANNOUNCEMENTS);
  }, [activeTab, fetchEvents, fetchClubs]);

  const handleEvtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMockItem('mock_events', DEFAULT_EVENTS, { ...(editEvt ? { id: editEvt.id } : {}), ...evtForm, status: 'Upcoming', registrationsCount: editEvt ? editEvt.registrationsCount : 0 });
    setToast({ message: editEvt ? 'Event updated!' : 'Event scheduled!', type: 'success' });
    setShowEvtModal(false);
    fetchEvents();
  };

  const handleClubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMockItem('mock_clubs', DEFAULT_CLUBS, { ...(editClub ? { id: editClub.id } : {}), ...clubForm, status: 'Active' });
    setToast({ message: editClub ? 'Club details updated!' : 'Student club registered!', type: 'success' });
    setShowClubModal(false);
    fetchClubs();
  };

  const evtColumns = [
    { key: 'title', title: 'Event Name & Venue', sortable: true, render: (v: string, r: any) => (
      <div>
        <p className="font-bold text-slate-900 dark:text-white">{v}</p>
        <p className="text-xs text-slate-500">Venue: {r.venue} | By: {r.organizer}</p>
      </div>
    )},
    { key: 'category', title: 'Category', render: (v: string) => <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">{v}</span> },
    { key: 'startDate', title: 'Dates', render: (_: any, r: any) => `${r.startDate}${r.endDate && r.endDate !== r.startDate ? ` - ${r.endDate}` : ''}` },
    { key: 'budget', title: 'Budget Allocated', render: (v: number) => `₹${v.toLocaleString()}` },
    { key: 'registrationsCount', title: 'Registrations', render: (v: number) => <strong className="text-indigo-600 dark:text-indigo-400">{v} Attending</strong> },
  ];

  const clubColumns = [
    { key: 'name', title: 'Club Title & Code', sortable: true, render: (v: string, r: any) => (
      <div>
        <p className="font-bold text-slate-900 dark:text-white">{v}</p>
        <p className="text-xs text-slate-500 font-mono">Code: {r.code}</p>
      </div>
    )},
    { key: 'leadStudent', title: 'Student Lead', render: (v: string) => <span className="font-semibold text-slate-800 dark:text-slate-200">{v}</span> },
    { key: 'facultyAdvisor', title: 'Faculty Advisor' },
    { key: 'memberCount', title: 'Active Members', render: (v: number) => `${v} Members` },
    { key: 'status', title: 'Status', render: (v: string) => <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950">{v}</span> },
  ];

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <Breadcrumbs items={[{ label: 'Events & Clubs' }]} />
        <div className="flex items-center gap-3 mt-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md flex-shrink-0">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Events & Student Clubs</h1>
            <p className="text-sm text-slate-500">Manage campus fests, technical hackathons, student organizations, circulars & registrations</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button onClick={() => setActiveTab('events')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'events' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Calendar className="w-4 h-4" /> Campus Events
        </button>
        <button onClick={() => setActiveTab('clubs')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'clubs' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Users className="w-4 h-4" /> Student Clubs
        </button>
        <button onClick={() => setActiveTab('registrations')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'registrations' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Award className="w-4 h-4" /> Registrations
        </button>
        <button onClick={() => setActiveTab('announcements')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'announcements' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Bell className="w-4 h-4" /> Announcements
        </button>
      </div>

      {activeTab === 'events' && (
        <DataTable
          title="Scheduled Campus Events"
          columns={evtColumns}
          data={events}
          totalItems={evtTotal}
          page={evtPage}
          limit={evtLimit}
          isLoading={evtLoading}
          onPageChange={setEvtPage}
          onLimitChange={(l) => { setEvtPage(1); setEvtLimit(l); }}
          onSearch={(s) => { setEvtSearch(s); setEvtPage(1); }}
          onSort={() => {}}
          onAdd={() => { setEditEvt(null); setEvtForm({ title: '', category: 'Technical', organizer: '', venue: '', startDate: '', endDate: '', budget: 50000 }); setShowEvtModal(true); }}
          onEdit={(r) => { setEditEvt(r); setEvtForm({ title: r.title, category: r.category, organizer: r.organizer, venue: r.venue, startDate: r.startDate, endDate: r.endDate, budget: r.budget }); setShowEvtModal(true); }}
          onDelete={(r) => { deleteMockItem('mock_events', DEFAULT_EVENTS, r.id); setToast({ message: 'Event cancelled!', type: 'success' }); fetchEvents(); }}
          addLabel="Add Event"
          searchPlaceholder="Search event title, venue or organizer..."
        />
      )}

      {activeTab === 'clubs' && (
        <DataTable
          title="Student Clubs Registry"
          columns={clubColumns}
          data={clubs}
          totalItems={clubTotal}
          page={clubPage}
          limit={clubLimit}
          isLoading={clubLoading}
          onPageChange={setClubPage}
          onLimitChange={(l) => { setClubPage(1); setClubLimit(l); }}
          onSearch={(s) => { setClubSearch(s); setClubPage(1); }}
          onSort={() => {}}
          onAdd={() => { setEditClub(null); setClubForm({ name: '', code: '', leadStudent: '', facultyAdvisor: '', category: 'Technical', memberCount: 50 }); setShowClubModal(true); }}
          onEdit={(r) => { setEditClub(r); setClubForm({ name: r.name, code: r.code, leadStudent: r.leadStudent, facultyAdvisor: r.facultyAdvisor, category: r.category, memberCount: r.memberCount }); setShowClubModal(true); }}
          onDelete={(r) => { deleteMockItem('mock_clubs', DEFAULT_CLUBS, r.id); setToast({ message: 'Club deregistered!', type: 'success' }); fetchClubs(); }}
          addLabel="Create Club"
          searchPlaceholder="Search club title, lead or code..."
        />
      )}

      {activeTab === 'registrations' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Event Participants</h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {regs.map((r) => (
              <div key={r.id} className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{r.studentName} ({r.USN})</h4>
                  <p className="text-xs text-slate-500">Event: {r.eventTitle} | Dept: {r.department}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-medium">{r.attendanceStatus}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Campus Circulars & Broadcasts</h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {anns.map((a) => (
              <div key={a.id} className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{a.title}</h4>
                  <p className="text-xs text-slate-500">Audience: {a.targetAudience} | Author: {a.author} | Date: {a.date}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-emerald-100 text-emerald-700 font-semibold">{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEvtModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEvtModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editEvt ? 'Edit Event' : 'Schedule Event'}</h3>
              <button onClick={() => setShowEvtModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleEvtSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Event Title *</label>
                <input value={evtForm.title} onChange={(e) => setEvtForm({ ...evtForm, title: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Organizer Dept/Club</label>
                  <input value={evtForm.organizer} onChange={(e) => setEvtForm({ ...evtForm, organizer: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Venue Location</label>
                  <input value={evtForm.venue} onChange={(e) => setEvtForm({ ...evtForm, venue: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Start Date</label>
                  <input type="date" value={evtForm.startDate} onChange={(e) => setEvtForm({ ...evtForm, startDate: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">End Date</label>
                  <input type="date" value={evtForm.endDate} onChange={(e) => setEvtForm({ ...evtForm, endDate: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowEvtModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Club Modal */}
      {showClubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowClubModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editClub ? 'Edit Club' : 'Register Student Club'}</h3>
              <button onClick={() => setShowClubModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleClubSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Club Full Name *</label>
                <input value={clubForm.name} onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Club Code Tag *</label>
                  <input value={clubForm.code} onChange={(e) => setClubForm({ ...clubForm, code: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Student Lead Name</label>
                  <input value={clubForm.leadStudent} onChange={(e) => setClubForm({ ...clubForm, leadStudent: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowClubModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Save Club</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
