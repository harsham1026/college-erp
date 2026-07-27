'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import { getMockCollection, saveMockItem, deleteMockItem, getStorageData, DEFAULT_BRANCHES, DEFAULT_COURSES } from '@/lib/mockDb';
import { GitBranch, X, Eye } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  code: string;
  courseId: string;
  description?: string;
  isActive: boolean;
  course?: { name: string };
  createdAt?: string;
}

export default function BranchesPage() {
  const [data, setData] = useState<Branch[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  // Dropdown Metadata State
  const [courses, setCourses] = useState<any[]>([]);

  // Modal and Notification State
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState<Branch | null>(null);
  const [editItem, setEditItem] = useState<Branch | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    courseId: '',
    description: '',
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
      const response: any = await api.get('/branches', { page, limit, search, sortBy, sortOrder });
      setData(response.data || []);
      setTotal(response.pagination?.total || 0);
    } catch {
      // Fallback local storage mock DB
      const result = getMockCollection<Branch>('mock_branches', DEFAULT_BRANCHES, {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        searchFields: ['name', 'code', 'description'],
      });

      // Hydrate relations manually for display
      const storedCourses = getStorageData('mock_courses', DEFAULT_COURSES);
      const hydrated = result.data.map((branch) => {
        const course = storedCourses.find((c) => c.id === branch.courseId);
        return {
          ...branch,
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
      code: '',
      courseId: courses[0]?.id || '',
      description: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (item: Branch) => {
    setEditItem(item);
    setViewItem(null);
    setFormData({
      name: item.name,
      code: item.code,
      courseId: item.courseId,
      description: item.description || '',
      isActive: item.isActive,
    });
    setShowModal(true);
  };

  const handleView = (item: Branch) => {
    const storedCourses = getStorageData('mock_courses', DEFAULT_COURSES);
    const course = storedCourses.find((c) => c.id === item.courseId);

    setViewItem({
      ...item,
      course: course ? { name: course.name } : item.course,
    });
  };

  const handleDelete = async (item: Branch) => {
    if (!confirm(`Are you sure you want to delete ${item.name}?`)) return;
    try {
      await api.delete(`/branches/${item.id}`);
      setToast({ message: 'Branch deleted successfully!', type: 'success' });
      fetchData();
    } catch {
      deleteMockItem('mock_branches', DEFAULT_BRANCHES, item.id);
      setToast({ message: 'Branch deleted from mock storage!', type: 'success' });
      fetchData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editItem) {
        await api.put(`/branches/${editItem.id}`, formData);
        setToast({ message: 'Branch updated successfully!', type: 'success' });
      } else {
        await api.post('/branches', formData);
        setToast({ message: 'Branch created successfully!', type: 'success' });
      }
      setShowModal(false);
      fetchData();
    } catch {
      saveMockItem('mock_branches', DEFAULT_BRANCHES, {
        ...(editItem ? { id: editItem.id } : {}),
        ...formData,
      });
      setToast({
        message: editItem ? 'Branch updated in mock storage!' : 'Branch created in mock storage!',
        type: 'success',
      });
      setShowModal(false);
      fetchData();
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'Branch',
      sortable: true,
      render: (value: string, row: Branch) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {row.code?.[0]}
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white leading-tight">{value}</p>
            <p className="text-xs text-slate-500">{row.code}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'course',
      title: 'Course',
      render: (_: any, row: Branch) => row.course?.name || <span className="text-slate-400 text-xs">Unknown Course</span>,
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
        <Breadcrumbs items={[{ label: 'Academic', href: '#' }, { label: 'Branches' }]} />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <GitBranch className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Branches</h1>
            <p className="text-sm text-slate-500">Manage academic branches and specializations</p>
          </div>
        </div>
      </div>

      <DataTable
        title="Branches List"
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
        addLabel="Add Branch"
        searchPlaceholder="Search branches..."
      />

      {/* View Details Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Branch Details</h3>
              <button onClick={() => setViewItem(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                  {viewItem.code?.[0]}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{viewItem.name}</h4>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-1">Branch Code: {viewItem.code}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Degree Course</p>
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
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Description</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-1 whitespace-pre-line leading-relaxed">
                    {viewItem.description || 'No description available for this branch.'}
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
                {editItem ? 'Edit Branch' : 'Add Branch'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Branch Name *</label>
                  <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Branch Code *</label>
                  <input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
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
                  {editItem ? 'Update Branch' : 'Create Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
