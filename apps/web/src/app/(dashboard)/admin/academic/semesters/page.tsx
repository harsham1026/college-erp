'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import { getMockCollection, saveMockItem, deleteMockItem, getStorageData, DEFAULT_SEMESTERS, DEFAULT_COURSES } from '@/lib/mockDb';
import { Clock, X, Eye } from 'lucide-react';

interface Semester {
  id: string;
  name: string;
  number: number;
  courseId: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  course?: { name: string };
  createdAt?: string;
}

export default function SemestersPage() {
  const [data, setData] = useState<Semester[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('number');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);

  // Dropdown Metadata State
  const [courses, setCourses] = useState<any[]>([]);

  // Modal and Notification State
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState<Semester | null>(null);
  const [editItem, setEditItem] = useState<Semester | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    number: 1,
    courseId: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });

  // Fetch courses for dropdown
  const fetchMetadata = async () => {
    try {
      const courseRes: any = await api.get('/courses');
      setCourses(courseRes.data || courseRes || []);
    } catch {
      setCourses(getStorageData('mock_courses', DEFAULT_COURSES));
    }
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/semesters', { page, limit, search, sortBy, sortOrder });
      setData(response.data || []);
      setTotal(response.pagination?.total || 0);
    } catch {
      // Fallback local storage mock DB
      const result = getMockCollection<Semester>('mock_semesters', DEFAULT_SEMESTERS, {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        searchFields: ['name'],
      });

      // Hydrate relations manually for display
      const storedCourses = getStorageData('mock_courses', DEFAULT_COURSES);
      const hydrated = result.data.map((semester) => {
        const course = storedCourses.find((c) => c.id === semester.courseId);
        return {
          ...semester,
          course: course ? { name: course.name } : undefined,
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
      number: 1,
      courseId: courses[0]?.id || '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (item: Semester) => {
    setEditItem(item);
    setViewItem(null);
    setFormData({
      name: item.name,
      number: item.number,
      courseId: item.courseId,
      startDate: item.startDate || '',
      endDate: item.endDate || '',
      isActive: item.isActive,
    });
    setShowModal(true);
  };

  const handleView = (item: Semester) => {
    const storedCourses = getStorageData('mock_courses', DEFAULT_COURSES);
    const course = storedCourses.find((c) => c.id === item.courseId);

    setViewItem({
      ...item,
      course: course ? { name: course.name } : item.course,
    });
  };

  const handleDelete = async (item: Semester) => {
    if (!confirm(`Are you sure you want to delete ${item.name}?`)) return;
    try {
      await api.delete(`/semesters/${item.id}`);
      setToast({ message: 'Semester deleted successfully!', type: 'success' });
      fetchData();
    } catch {
      deleteMockItem('mock_semesters', DEFAULT_SEMESTERS, item.id);
      setToast({ message: 'Semester deleted from mock storage!', type: 'success' });
      fetchData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      number: Number(formData.number),
    };
    try {
      if (editItem) {
        await api.put(`/semesters/${editItem.id}`, payload);
        setToast({ message: 'Semester updated successfully!', type: 'success' });
      } else {
        await api.post('/semesters', payload);
        setToast({ message: 'Semester created successfully!', type: 'success' });
      }
      setShowModal(false);
      fetchData();
    } catch {
      saveMockItem('mock_semesters', DEFAULT_SEMESTERS, {
        ...(editItem ? { id: editItem.id } : {}),
        ...payload,
      });
      setToast({
        message: editItem ? 'Semester updated in mock storage!' : 'Semester created in mock storage!',
        type: 'success',
      });
      setShowModal(false);
      fetchData();
    }
  };

  const columns = [
    {
      key: 'number',
      title: 'Semester No.',
      sortable: true,
      render: (value: number) => (
        <span className="font-bold text-slate-900 dark:text-white bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-xl text-xs">
          Semester {value}
        </span>
      ),
    },
    { key: 'name', title: 'Academic Year / Term', sortable: true },
    {
      key: 'course',
      title: 'Course',
      render: (_: any, row: Semester) => row.course?.name || <span className="text-slate-400 text-xs">Unknown Course</span>,
    },
    {
      key: 'startDate',
      title: 'Duration',
      render: (_: string, row: Semester) => (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {row.startDate || 'N/A'} to {row.endDate || 'N/A'}
        </span>
      ),
    },
    {
      key: 'isActive',
      title: 'Status',
      render: (value: boolean) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${value ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'}`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div>
        <Breadcrumbs items={[{ label: 'Academic', href: '#' }, { label: 'Semesters' }]} />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Semesters</h1>
            <p className="text-sm text-slate-500">Manage academic semesters and terms</p>
          </div>
        </div>
      </div>

      <DataTable
        title="Semesters List"
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
        addLabel="Add Semester"
        searchPlaceholder="Search semesters..."
      />

      {/* View Details Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Semester Details</h3>
              <button onClick={() => setViewItem(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold">
                  {viewItem.number}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Semester {viewItem.number}</h4>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-1">{viewItem.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Associated Course</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.course?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <p className="mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${viewItem.isActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30' : 'bg-red-50 text-red-700 dark:bg-red-950/30'}`}>
                      {viewItem.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Start Date</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.startDate || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">End Date</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.endDate || 'N/A'}</p>
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
                {editItem ? 'Edit Semester' : 'Add Semester'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Semester Number *</label>
                  <input type="number" min={1} max={12} value={formData.number} onChange={(e) => setFormData({ ...formData, number: Number(e.target.value) })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Academic Year / Name *</label>
                  <input value={formData.name} placeholder="e.g. 2026-27 or Fall 2026" onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Degree Course *</label>
                <select value={formData.courseId} onChange={(e) => setFormData({ ...formData, courseId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                  <option value="" disabled>Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>{course.name} ({course.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Start Date</label>
                  <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">End Date</label>
                  <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Status</label>
                <select value={formData.isActive ? 'true' : 'false'} onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  {editItem ? 'Update Semester' : 'Create Semester'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
