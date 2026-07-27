'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import { getMockCollection, saveMockItem, deleteMockItem, getStorageData, DEFAULT_TEACHERS, DEFAULT_DEPARTMENTS } from '@/lib/mockDb';
import { Users, X, Eye } from 'lucide-react';

interface Teacher {
  id: string;
  employeeId: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  departmentId: string;
  designation: string;
  qualification: string;
  experience: string;
  isActive: boolean;
  department?: { name: string };
}

export default function TeachersPage() {
  const [data, setData] = useState<Teacher[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  // Dropdown Metadata State
  const [departments, setDepartments] = useState<any[]>([]);

  // Modal and Toast Notification state
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState<Teacher | null>(null);
  const [editItem, setEditItem] = useState<Teacher | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employeeId: '',
    departmentId: '',
    designation: '',
    qualification: '',
    experience: '',
    isActive: true,
  });

  const fetchMetadata = async () => {
    try {
      const deptRes: any = await api.get('/departments');
      setDepartments(deptRes.data || deptRes || []);
    } catch {
      setDepartments(getStorageData('mock_departments', DEFAULT_DEPARTMENTS));
    }
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/teachers', { page, limit, search, sortBy, sortOrder });
      setData(response.data || []);
      setTotal(response.pagination?.total || 0);
    } catch {
      // Fallback local storage mock DB
      const result = getMockCollection<any>('mock_teachers', DEFAULT_TEACHERS, {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        searchFields: ['employeeId', 'designation', 'qualification'],
      });

      // Search matching first/last name
      let filtered = result.data;
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.user?.firstName?.toLowerCase().includes(searchLower) ||
            t.user?.lastName?.toLowerCase().includes(searchLower) ||
            t.user?.email?.toLowerCase().includes(searchLower)
        );
      }

      // Hydrate relations manually
      const storedDepts = getStorageData('mock_departments', DEFAULT_DEPARTMENTS);
      const hydrated = filtered.map((teacher) => {
        const dept = storedDepts.find((d) => d.id === teacher.departmentId);
        return {
          ...teacher,
          department: dept ? { name: dept.name } : undefined,
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
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      employeeId: '',
      departmentId: departments[0]?.id || '',
      designation: '',
      qualification: '',
      experience: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (item: Teacher) => {
    setEditItem(item);
    setViewItem(null);
    setFormData({
      firstName: item.user?.firstName || '',
      lastName: item.user?.lastName || '',
      email: item.user?.email || '',
      phone: item.user?.phone || '',
      employeeId: item.employeeId,
      departmentId: item.departmentId,
      designation: item.designation,
      qualification: item.qualification,
      experience: item.experience || '',
      isActive: item.isActive,
    });
    setShowModal(true);
  };

  const handleView = (item: Teacher) => {
    const storedDepts = getStorageData('mock_departments', DEFAULT_DEPARTMENTS);
    const dept = storedDepts.find((d) => d.id === item.departmentId);
    setViewItem({
      ...item,
      department: dept ? { name: dept.name } : item.department,
    });
  };

  const handleDelete = async (item: Teacher) => {
    if (!confirm(`Are you sure you want to delete ${item.user?.firstName} ${item.user?.lastName}?`)) return;
    try {
      await api.delete(`/teachers/${item.id}`);
      setToast({ message: 'Teacher record deleted successfully!', type: 'success' });
      fetchData();
    } catch {
      deleteMockItem('mock_teachers', DEFAULT_TEACHERS, item.id);
      setToast({ message: 'Teacher record deleted from mock storage!', type: 'success' });
      fetchData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      employeeId: formData.employeeId,
      departmentId: formData.departmentId,
      designation: formData.designation,
      qualification: formData.qualification,
      experience: formData.experience,
      isActive: formData.isActive,
      user: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      },
    };

    try {
      if (editItem) {
        await api.put(`/teachers/${editItem.id}`, payload);
        setToast({ message: 'Teacher record updated successfully!', type: 'success' });
      } else {
        await api.post('/teachers', payload);
        setToast({ message: 'Teacher record created successfully!', type: 'success' });
      }
      setShowModal(false);
      fetchData();
    } catch {
      saveMockItem('mock_teachers', DEFAULT_TEACHERS, {
        ...(editItem ? { id: editItem.id } : {}),
        ...payload,
      });
      setToast({
        message: editItem ? 'Teacher updated in mock storage!' : 'Teacher created in mock storage!',
        type: 'success',
      });
      setShowModal(false);
      fetchData();
    }
  };

  const columns = [
    {
      key: 'user',
      title: 'Teacher',
      sortable: true,
      render: (_: any, row: Teacher) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0">
            {row.user?.firstName?.[0]}{row.user?.lastName?.[0]}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white leading-tight">{row.user?.firstName} {row.user?.lastName}</p>
            <p className="text-xs text-slate-500">{row.user?.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'employeeId', title: 'Employee ID', sortable: true },
    {
      key: 'department',
      title: 'Department',
      render: (_: any, row: Teacher) => (
        <span className="px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 text-xs font-semibold dark:bg-violet-950/50 dark:text-violet-300 border border-violet-100 dark:border-violet-900/50">
          {row.department?.name || 'N/A'}
        </span>
      ),
    },
    { key: 'designation', title: 'Designation', sortable: true },
    { key: 'experience', title: 'Experience' },
    {
      key: 'isActive',
      title: 'Status',
      render: (value: boolean) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${value ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400'}`}>
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
        <Breadcrumbs items={[{ label: 'People', href: '#' }, { label: 'Teachers' }]} />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md flex-shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Teachers</h1>
            <p className="text-sm text-slate-500">Manage faculty members and profiles</p>
          </div>
        </div>
      </div>

      <DataTable
        title="Teachers List"
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
        addLabel="Add Teacher"
        searchPlaceholder="Search teachers..."
      />

      {/* View Details Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Teacher Faculty Details</h3>
              <button onClick={() => setViewItem(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {viewItem.user?.firstName?.[0]}{viewItem.user?.lastName?.[0]}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{viewItem.user?.firstName} {viewItem.user?.lastName}</h4>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-1">Employee ID: {viewItem.employeeId}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Designation</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.designation}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Department</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.department?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Qualification</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.qualification}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Experience</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.experience || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.user?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <p className="mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${viewItem.isActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30' : 'bg-red-50 text-red-700 dark:bg-red-950/30'}`}>
                      {viewItem.isActive ? 'Active' : 'Inactive'}
                    </span>
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
                {editItem ? 'Edit Teacher Record' : 'Add New Teacher'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">First Name *</label>
                  <input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-violet-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Last Name *</label>
                  <input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-violet-500/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-violet-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Phone</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-violet-500/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Employee ID *</label>
                  <input value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-violet-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Associated Department *</label>
                  <select value={formData.departmentId} onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-violet-500/20">
                    <option value="" disabled>Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Designation *</label>
                  <input value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} required placeholder="e.g. Assistant Professor" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-violet-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Experience *</label>
                  <input value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} required placeholder="e.g. 5 Years" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-violet-500/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Qualification *</label>
                  <input value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} required placeholder="e.g. Ph.D." className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-violet-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Status</label>
                  <select value={formData.isActive ? 'true' : 'false'} onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-violet-500/20">
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  {editItem ? 'Update Faculty' : 'Register Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
