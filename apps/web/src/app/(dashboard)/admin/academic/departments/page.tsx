'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import { getMockCollection, saveMockItem, deleteMockItem, getStorageData, DEFAULT_DEPARTMENTS, DEFAULT_COLLEGES, DEFAULT_TEACHERS } from '@/lib/mockDb';
import { Layers, X, Eye } from 'lucide-react';

interface Department {
  id: string;
  name: string;
  code: string;
  collegeId: string;
  hodId?: string | null;
  description?: string;
  isActive: boolean;
  college?: { name: string };
  hod?: { user: { firstName: string; lastName: string } };
  createdAt?: string;
}

export default function DepartmentsPage() {
  const [data, setData] = useState<Department[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  // Dropdown Metadata State
  const [colleges, setColleges] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  // Modal and Notification State
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState<Department | null>(null);
  const [editItem, setEditItem] = useState<Department | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    collegeId: '',
    hodId: '',
    description: '',
    isActive: true,
  });

  // Fetch colleges & teachers for dropdowns
  const fetchMetadata = async () => {
    try {
      const colRes: any = await api.get('/colleges');
      setColleges(colRes.data || colRes || []);
    } catch {
      setColleges(getStorageData('mock_colleges', DEFAULT_COLLEGES));
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
      const response: any = await api.get('/departments', { page, limit, search, sortBy, sortOrder });
      setData(response.data || []);
      setTotal(response.pagination?.total || 0);
    } catch {
      // Fallback local storage mock DB
      const result = getMockCollection<Department>('mock_departments', DEFAULT_DEPARTMENTS, {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        searchFields: ['name', 'code', 'description'],
      });

      // Hydrate relations manually for display
      const storedColleges = getStorageData('mock_colleges', DEFAULT_COLLEGES);
      const storedTeachers = getStorageData('mock_teachers', DEFAULT_TEACHERS);
      const hydrated = result.data.map((dept) => {
        const college = storedColleges.find((c) => c.id === dept.collegeId);
        const teacher = storedTeachers.find((t) => t.id === dept.hodId);
        return {
          ...dept,
          college: college ? { name: college.name } : undefined,
          hod: teacher ? { user: { firstName: teacher.user.firstName, lastName: teacher.user.lastName } } : undefined,
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
      collegeId: colleges[0]?.id || '',
      hodId: '',
      description: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (item: Department) => {
    setEditItem(item);
    setViewItem(null);
    setFormData({
      name: item.name,
      code: item.code,
      collegeId: item.collegeId,
      hodId: item.hodId || '',
      description: item.description || '',
      isActive: item.isActive,
    });
    setShowModal(true);
  };

  const handleView = (item: Department) => {
    // Make sure relations are resolved for viewing
    const storedColleges = getStorageData('mock_colleges', DEFAULT_COLLEGES);
    const storedTeachers = getStorageData('mock_teachers', DEFAULT_TEACHERS);
    const college = storedColleges.find((c) => c.id === item.collegeId);
    const teacher = storedTeachers.find((t) => t.id === item.hodId);

    setViewItem({
      ...item,
      college: college ? { name: college.name } : item.college,
      hod: teacher ? { user: { firstName: teacher.user.firstName, lastName: teacher.user.lastName } } : item.hod,
    });
  };

  const handleDelete = async (item: Department) => {
    if (!confirm(`Are you sure you want to delete ${item.name}?`)) return;
    try {
      await api.delete(`/departments/${item.id}`);
      setToast({ message: 'Department deleted successfully!', type: 'success' });
      fetchData();
    } catch {
      deleteMockItem('mock_departments', DEFAULT_DEPARTMENTS, item.id);
      setToast({ message: 'Department deleted from mock storage!', type: 'success' });
      fetchData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      hodId: formData.hodId === '' ? null : formData.hodId,
    };
    try {
      if (editItem) {
        await api.put(`/departments/${editItem.id}`, payload);
        setToast({ message: 'Department updated successfully!', type: 'success' });
      } else {
        await api.post('/departments', payload);
        setToast({ message: 'Department created successfully!', type: 'success' });
      }
      setShowModal(false);
      fetchData();
    } catch {
      saveMockItem('mock_departments', DEFAULT_DEPARTMENTS, {
        ...(editItem ? { id: editItem.id } : {}),
        ...payload,
      });
      setToast({
        message: editItem ? 'Department updated in mock storage!' : 'Department created in mock storage!',
        type: 'success',
      });
      setShowModal(false);
      fetchData();
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'Department',
      sortable: true,
      render: (value: string, row: Department) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {row.code?.[0]}{row.code?.[1]}
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white leading-tight">{value}</p>
            <p className="text-xs text-slate-500">{row.code}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'college',
      title: 'College',
      render: (_: any, row: Department) => row.college?.name || <span className="text-slate-400 text-xs">Unknown College</span>,
    },
    {
      key: 'hod',
      title: 'HOD',
      render: (_: any, row: Department) => row.hod ? `${row.hod.user?.firstName} ${row.hod.user?.lastName}` : <span className="text-slate-400 text-xs">Not Assigned</span>,
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
        <Breadcrumbs items={[{ label: 'Academic', href: '#' }, { label: 'Departments' }]} />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Departments</h1>
            <p className="text-sm text-slate-500">Manage academic departments</p>
          </div>
        </div>
      </div>

      <DataTable
        title="Departments List"
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
        addLabel="Add Department"
        searchPlaceholder="Search departments..."
      />

      {/* View Details Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Department Details</h3>
              <button onClick={() => setViewItem(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold">
                  {viewItem.code?.[0]}{viewItem.code?.[1]}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{viewItem.name}</h4>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-1">Code: {viewItem.code}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Associated College</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.college?.name || 'N/A'}</p>
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
                  <p className="text-xs text-slate-500">Head of Department (HOD)</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {viewItem.hod ? `${viewItem.hod.user?.firstName} ${viewItem.hod.user?.lastName}` : 'Not Assigned'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Description</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-1 whitespace-pre-line leading-relaxed">
                    {viewItem.description || 'No description available for this department.'}
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
                {editItem ? 'Edit Department' : 'Add Department'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Department Name *</label>
                  <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Code *</label>
                  <input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">College *</label>
                  <select value={formData.collegeId} onChange={(e) => setFormData({ ...formData, collegeId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="" disabled>Select College</option>
                    {colleges.map((col) => (
                      <option key={col.id} value={col.id}>{col.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Head of Department (HOD)</label>
                  <select value={formData.hodId} onChange={(e) => setFormData({ ...formData, hodId: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="">Not Assigned / Select HOD</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.user?.firstName} {t.user?.lastName} ({t.employeeId})</option>
                    ))}
                  </select>
                </div>
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
                  {editItem ? 'Update Department' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
