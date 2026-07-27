'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import { getMockCollection, saveMockItem, deleteMockItem, getStorageData, DEFAULT_TIMETABLES, DEFAULT_SECTIONS, DEFAULT_SUBJECTS, DEFAULT_TEACHERS } from '@/lib/mockDb';
import { Calendar, X, Eye } from 'lucide-react';

interface TimetableSlot {
  id: string;
  sectionId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: number; // 0=Monday
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  room: string;
  isActive: boolean;
  section?: { name: string };
  subject?: { name: string; code: string };
  teacher?: { user: { firstName: string; lastName: string } };
  createdAt?: string;
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function TimetablePage() {
  const [data, setData] = useState<TimetableSlot[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('dayOfWeek');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);

  // Dropdown Metadata State
  const [sections, setSections] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  // Modal and Notification State
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState<TimetableSlot | null>(null);
  const [editItem, setEditItem] = useState<TimetableSlot | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    sectionId: '',
    subjectId: '',
    teacherId: '',
    dayOfWeek: 0,
    startTime: '09:00',
    endTime: '10:00',
    room: '',
    isActive: true,
  });

  // Fetch metadata dropdowns
  const fetchMetadata = async () => {
    try {
      const secRes: any = await api.get('/sections');
      setSections(secRes.data || secRes || []);
    } catch {
      setSections(getStorageData('mock_sections', DEFAULT_SECTIONS));
    }

    try {
      const subRes: any = await api.get('/subjects');
      setSubjects(subRes.data || subRes || []);
    } catch {
      setSubjects(getStorageData('mock_subjects', DEFAULT_SUBJECTS));
    }

    try {
      const teachRes: any = await api.get('/teachers');
      setTeachers(teachRes.data || teachRes || []);
    } catch {
      setTeachers(getStorageData('mock_teachers', DEFAULT_TEACHERS));
    }
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/timetable', { page, limit, search, sortBy, sortOrder });
      setData(response.data || []);
      setTotal(response.pagination?.total || 0);
    } catch {
      // Fallback local storage mock DB
      const result = getMockCollection<TimetableSlot>('mock_timetable', DEFAULT_TIMETABLES, {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        searchFields: ['room', 'startTime', 'endTime'],
      });

      // Hydrate relations manually for display
      const storedSections = getStorageData('mock_sections', DEFAULT_SECTIONS);
      const storedSubjects = getStorageData('mock_subjects', DEFAULT_SUBJECTS);
      const storedTeachers = getStorageData('mock_teachers', DEFAULT_TEACHERS);

      const hydrated = result.data.map((slot) => {
        const sec = storedSections.find((s) => s.id === slot.sectionId);
        const sub = storedSubjects.find((s) => s.id === slot.subjectId);
        const teach = storedTeachers.find((t) => t.id === slot.teacherId);
        return {
          ...slot,
          section: sec ? { name: sec.name } : undefined,
          subject: sub ? { name: sub.name, code: sub.code } : undefined,
          teacher: teach ? { user: { firstName: teach.user.firstName, lastName: teach.user.lastName } } : undefined,
        };
      });

      setData(hydrated);
      setTotal(result.pagination.total);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchMetadata();
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setEditItem(null);
    setViewItem(null);
    setFormData({
      sectionId: sections[0]?.id || '',
      subjectId: subjects[0]?.id || '',
      teacherId: teachers[0]?.id || '',
      dayOfWeek: 0,
      startTime: '09:00',
      endTime: '10:00',
      room: 'Room 101',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (item: TimetableSlot) => {
    setEditItem(item);
    setViewItem(null);
    setFormData({
      sectionId: item.sectionId,
      subjectId: item.subjectId,
      teacherId: item.teacherId,
      dayOfWeek: item.dayOfWeek,
      startTime: item.startTime,
      endTime: item.endTime,
      room: item.room,
      isActive: item.isActive,
    });
    setShowModal(true);
  };

  const handleView = (item: TimetableSlot) => {
    const storedSections = getStorageData('mock_sections', DEFAULT_SECTIONS);
    const storedSubjects = getStorageData('mock_subjects', DEFAULT_SUBJECTS);
    const storedTeachers = getStorageData('mock_teachers', DEFAULT_TEACHERS);

    const sec = storedSections.find((s) => s.id === item.sectionId);
    const sub = storedSubjects.find((s) => s.id === item.subjectId);
    const teach = storedTeachers.find((t) => t.id === item.teacherId);

    setViewItem({
      ...item,
      section: sec ? { name: sec.name } : item.section,
      subject: sub ? { name: sub.name, code: sub.code } : item.subject,
      teacher: teach ? { user: { firstName: teach.user.firstName, lastName: teach.user.lastName } } : item.teacher,
    });
  };

  const handleDelete = async (item: TimetableSlot) => {
    if (!confirm(`Are you sure you want to delete this timetable slot?`)) return;
    try {
      await api.delete(`/timetable/${item.id}`);
      setToast({ message: 'Timetable slot deleted successfully!', type: 'success' });
      fetchData();
    } catch {
      deleteMockItem('mock_timetable', DEFAULT_TIMETABLES, item.id);
      setToast({ message: 'Timetable slot deleted from mock storage!', type: 'success' });
      fetchData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      dayOfWeek: Number(formData.dayOfWeek),
    };
    try {
      if (editItem) {
        await api.put(`/timetable/${editItem.id}`, payload);
        setToast({ message: 'Timetable slot updated successfully!', type: 'success' });
      } else {
        await api.post('/timetable', payload);
        setToast({ message: 'Timetable slot created successfully!', type: 'success' });
      }
      setShowModal(false);
      fetchData();
    } catch {
      saveMockItem('mock_timetable', DEFAULT_TIMETABLES, {
        ...(editItem ? { id: editItem.id } : {}),
        ...payload,
      });
      setToast({
        message: editItem ? 'Timetable updated in mock storage!' : 'Timetable created in mock storage!',
        type: 'success',
      });
      setShowModal(false);
      fetchData();
    }
  };

  const columns = [
    {
      key: 'dayOfWeek',
      title: 'Day',
      sortable: true,
      render: (value: number) => (
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {DAYS_OF_WEEK[value] || 'Monday'}
        </span>
      ),
    },
    {
      key: 'startTime',
      title: 'Timing',
      render: (_: string, row: TimetableSlot) => (
        <span className="font-mono text-xs bg-indigo-50/80 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 px-2 py-1 rounded-lg">
          {row.startTime} - {row.endTime}
        </span>
      ),
    },
    {
      key: 'subject',
      title: 'Subject',
      render: (_: any, row: TimetableSlot) => row.subject ? (
        <div>
          <p className="font-medium text-slate-900 dark:text-white leading-tight">{row.subject.name}</p>
          <p className="text-[11px] text-slate-500">{row.subject.code}</p>
        </div>
      ) : <span className="text-slate-400 text-xs">Unknown Subject</span>,
    },
    {
      key: 'teacher',
      title: 'Faculty',
      render: (_: any, row: TimetableSlot) => row.teacher ? `${row.teacher.user?.firstName} ${row.teacher.user?.lastName}` : <span className="text-slate-400 text-xs">Unknown Teacher</span>,
    },
    { key: 'room', title: 'Classroom', sortable: true },
    {
      key: 'section',
      title: 'Section',
      render: (_: any, row: TimetableSlot) => row.section?.name || <span className="text-slate-400 text-xs">Unknown Section</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div>
        <Breadcrumbs items={[{ label: 'Academic', href: '#' }, { label: 'Timetable' }]} />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Timetable</h1>
            <p className="text-sm text-slate-500">Configure and view section lecture slots</p>
          </div>
        </div>
      </div>

      <DataTable
        title="Timetable Slots"
        columns={columns}
        data={data}
        totalItems={total}
        page={page}
        limit={limit}
        isLoading={isLoading}
        onPageChange={setPage}
        onLimitChange={(l) => { setPage(1); setLimit(l); }}
        onSearch={(s) => { setSearch(s); setPage(1); }}
        onSort={(by, order) => { setSortBy(by); setSortOrder(order); }}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        addLabel="Add Slot"
        searchPlaceholder="Search slots..."
      />

      {/* View Details Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Timetable Slot Details</h3>
              <button onClick={() => setViewItem(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold">
                  {viewItem.room?.[0]}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{viewItem.subject?.name || 'Class slot'}</h4>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-1">Classroom: {viewItem.room}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Day of Week</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{DAYS_OF_WEEK[viewItem.dayOfWeek] || 'Monday'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Timing</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.startTime} to {viewItem.endTime}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Subject Code</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.subject?.code || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Class Section</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.section?.name || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Assigned Faculty / Teacher</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {viewItem.teacher ? `${viewItem.teacher.user?.firstName} ${viewItem.teacher.user?.lastName}` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {editItem ? 'Edit Timetable Slot' : 'Add Timetable Slot'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Day of Week *</label>
                  <select value={formData.dayOfWeek} onChange={(e) => setFormData({ ...formData, dayOfWeek: Number(e.target.value) })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                    {DAYS_OF_WEEK.map((day, idx) => (
                      <option key={idx} value={idx}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Classroom / Room *</label>
                  <input value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Start Time *</label>
                  <input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">End Time *</label>
                  <input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Section *</label>
                  <select value={formData.sectionId} onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="" disabled>Select Section</option>
                    {sections.map((sec) => (
                      <option key={sec.id} value={sec.id}>{sec.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Subject *</label>
                  <select value={formData.subjectId} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="" disabled>Select Subject</option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Assigned Faculty *</label>
                <select value={formData.teacherId} onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                  <option value="" disabled>Select Teacher</option>
                  {teachers.map((teach) => (
                    <option key={teach.id} value={teach.id}>{teach.user?.firstName} {teach.user?.lastName} ({teach.employeeId})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  {editItem ? 'Update Slot' : 'Create Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
