'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import { getMockCollection, saveMockItem, deleteMockItem, getStorageData, DEFAULT_EXAMS, DEFAULT_SUBJECTS, DEFAULT_TEACHERS } from '@/lib/mockDb';
import { FileText, X, Eye } from 'lucide-react';

interface Exam {
  id: string;
  name: string;
  subjectId: string;
  invigilatorId: string;
  date: string;
  time: string;
  room: string;
  isPublished: boolean;
  subject?: { name: string; code: string };
  invigilator?: { user: { firstName: string; lastName: string } };
  createdAt?: string;
}

export default function ExamsPage() {
  const [data, setData] = useState<Exam[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);

  // Dropdown Metadata State
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  // Modal and Notification State
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState<Exam | null>(null);
  const [editItem, setEditItem] = useState<Exam | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    subjectId: '',
    invigilatorId: '',
    date: '',
    time: '10:00 AM - 01:00 PM',
    room: '',
    isPublished: false,
  });

  const fetchMetadata = async () => {
    try {
      const [subRes, teachRes]: any = await Promise.all([
        api.get('/subjects'),
        api.get('/teachers'),
      ]);
      setSubjects(subRes.data || subRes || []);
      setTeachers(teachRes.data || teachRes || []);
    } catch {
      setSubjects(getStorageData('mock_subjects', DEFAULT_SUBJECTS));
      setTeachers(getStorageData('mock_teachers', DEFAULT_TEACHERS));
    }
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/exams', { page, limit, search, sortBy, sortOrder });
      setData(response.data || []);
      setTotal(response.pagination?.total || 0);
    } catch {
      // Fallback local storage mock DB
      const result = getMockCollection<Exam>('mock_exams', DEFAULT_EXAMS, {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        searchFields: ['name', 'room', 'time'],
      });

      // Hydrate relations manually
      const storedSubjects = getStorageData('mock_subjects', DEFAULT_SUBJECTS);
      const storedTeachers = getStorageData('mock_teachers', DEFAULT_TEACHERS);
      const hydrated = result.data.map((exam) => {
        const sub = storedSubjects.find((s) => s.id === exam.subjectId);
        const teach = storedTeachers.find((t) => t.id === exam.invigilatorId);
        return {
          ...exam,
          subject: sub ? { name: sub.name, code: sub.code } : undefined,
          invigilator: teach ? { user: { firstName: teach.user.firstName, lastName: teach.user.lastName } } : undefined,
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
      name: '',
      subjectId: subjects[0]?.id || '',
      invigilatorId: teachers[0]?.id || '',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '10:00 AM - 01:00 PM',
      room: 'Room 101',
      isPublished: false,
    });
    setShowModal(true);
  };

  const handleEdit = (item: Exam) => {
    setEditItem(item);
    setViewItem(null);
    setFormData({
      name: item.name,
      subjectId: item.subjectId,
      invigilatorId: item.invigilatorId,
      date: item.date,
      time: item.time,
      room: item.room,
      isPublished: item.isPublished,
    });
    setShowModal(true);
  };

  const handleView = (item: Exam) => {
    const storedSubjects = getStorageData('mock_subjects', DEFAULT_SUBJECTS);
    const storedTeachers = getStorageData('mock_teachers', DEFAULT_TEACHERS);
    const sub = storedSubjects.find((s) => s.id === item.subjectId);
    const teach = storedTeachers.find((t) => t.id === item.invigilatorId);

    setViewItem({
      ...item,
      subject: sub ? { name: sub.name, code: sub.code } : item.subject,
      invigilator: teach ? { user: { firstName: teach.user.firstName, lastName: teach.user.lastName } } : item.invigilator,
    });
  };

  const handleDelete = async (item: Exam) => {
    if (!confirm(`Are you sure you want to delete ${item.name}?`)) return;
    try {
      await api.delete(`/exams/${item.id}`);
      setToast({ message: 'Exam deleted successfully!', type: 'success' });
      fetchData();
    } catch {
      deleteMockItem('mock_exams', DEFAULT_EXAMS, item.id);
      setToast({ message: 'Exam deleted from mock storage!', type: 'success' });
      fetchData();
    }
  };

  const handlePublish = (item: Exam) => {
    try {
      const stored = getStorageData<Exam>('mock_exams', DEFAULT_EXAMS);
      const idx = stored.findIndex((x) => x.id === item.id);
      if (idx !== -1) {
        stored[idx].isPublished = !stored[idx].isPublished;
        saveMockItem('mock_exams', DEFAULT_EXAMS, stored[idx]);
        setToast({
          message: stored[idx].isPublished ? 'Exam published successfully!' : 'Exam status set to draft.',
          type: 'success',
        });
        fetchData();
      }
    } catch {
      setToast({ message: 'Failed to update publication status.', type: 'error' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editItem) {
        await api.put(`/exams/${editItem.id}`, formData);
        setToast({ message: 'Exam updated successfully!', type: 'success' });
      } else {
        await api.post('/exams', formData);
        setToast({ message: 'Exam scheduled successfully!', type: 'success' });
      }
      setShowModal(false);
      fetchData();
    } catch {
      saveMockItem('mock_exams', DEFAULT_EXAMS, {
        ...(editItem ? { id: editItem.id } : {}),
        ...formData,
      });
      setToast({
        message: editItem ? 'Exam updated in mock storage!' : 'Exam scheduled in mock storage!',
        type: 'success',
      });
      setShowModal(false);
      fetchData();
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'Exam',
      sortable: true,
      render: (value: string, row: Exam) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-white leading-tight">{value}</p>
          <p className="text-xs text-slate-500">{row.subject ? `${row.subject.name} (${row.subject.code})` : 'N/A'}</p>
        </div>
      ),
    },
    { key: 'date', title: 'Schedule Date', sortable: true },
    { key: 'time', title: 'Timing' },
    { key: 'room', title: 'Hall / Room', sortable: true },
    {
      key: 'invigilator',
      title: 'Invigilator',
      render: (_: any, row: Exam) =>
        row.invigilator ? `${row.invigilator.user.firstName} ${row.invigilator.user.lastName}` : <span className="text-slate-400 text-xs">Unassigned</span>,
    },
    {
      key: 'isPublished',
      title: 'Publication',
      render: (value: boolean, row: Exam) => (
        <button
          onClick={() => handlePublish(row)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            value
              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
          }`}
        >
          {value ? 'Published' : 'Draft / Publish'}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div>
        <Breadcrumbs items={[{ label: 'Academics', href: '#' }, { label: 'Exams' }]} />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md flex-shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Exams</h1>
            <p className="text-sm text-slate-500">Manage and schedule student evaluations and examinations</p>
          </div>
        </div>
      </div>

      <DataTable
        title="Exams Schedule List"
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
        addLabel="Add Exam"
        searchPlaceholder="Search exams..."
      />

      {/* View Details Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Exam Details</h3>
              <button onClick={() => setViewItem(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{viewItem.name}</h4>
                <p className="text-sm text-indigo-650 dark:text-indigo-400 font-semibold mt-1">
                  Subject: {viewItem.subject ? `${viewItem.subject.name} (${viewItem.subject.code})` : 'N/A'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Exam Hall / Room</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.room}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Date</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.date}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Time</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.time}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <p className="mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${viewItem.isPublished ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30' : 'bg-slate-100 text-slate-650 dark:bg-slate-800'}`}>
                      {viewItem.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Assigned Invigilator</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {viewItem.invigilator ? `${viewItem.invigilator.user.firstName} ${viewItem.invigilator.user.lastName}` : 'Unassigned'}
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
                {editItem ? 'Edit Scheduled Exam' : 'Schedule Evaluation Exam'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Exam Title *</label>
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g. End Semester Theory Exam" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Subject *</label>
                  <select value={formData.subjectId} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="" disabled>Select Subject</option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Invigilator *</label>
                  <select value={formData.invigilatorId} onChange={(e) => setFormData({ ...formData, invigilatorId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="" disabled>Select Invigilator</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.user?.firstName} {t.user?.lastName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Date *</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Time Slot *</label>
                  <input value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required placeholder="e.g. 10:00 AM - 01:00 PM" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Classroom / Hall *</label>
                  <input value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} required placeholder="e.g. Room 302" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Publish Immediately?</label>
                  <select value={formData.isPublished ? 'true' : 'false'} onChange={(e) => setFormData({ ...formData, isPublished: e.target.value === 'true' })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="false">Save as Draft</option>
                    <option value="true">Publish Schedule</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  {editItem ? 'Update Exam' : 'Schedule Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
