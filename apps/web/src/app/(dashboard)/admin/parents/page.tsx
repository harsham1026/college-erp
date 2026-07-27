'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import { getMockCollection, saveMockItem, deleteMockItem, getStorageData, DEFAULT_PARENTS, DEFAULT_STUDENTS } from '@/lib/mockDb';
import { Users, X, Eye } from 'lucide-react';

interface Parent {
  id: string;
  parentName: string;
  relation: string; // Father / Mother / Guardian
  studentId: string;
  phone: string;
  email: string;
  address: string;
  occupation: string;
  isActive: boolean;
  student?: { user: { firstName: string; lastName: string }; enrollmentNo: string };
  createdAt?: string;
}

export default function ParentsPage() {
  const [data, setData] = useState<Parent[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  // Dropdown Metadata State
  const [students, setStudents] = useState<any[]>([]);

  // Modal and Notification State
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState<Parent | null>(null);
  const [editItem, setEditItem] = useState<Parent | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    parentName: '',
    relation: 'Father',
    studentId: '',
    phone: '',
    email: '',
    address: '',
    occupation: '',
    isActive: true,
  });

  const fetchMetadata = async () => {
    try {
      const studentRes: any = await api.get('/students');
      setStudents(studentRes.data || studentRes || []);
    } catch {
      setStudents(getStorageData('mock_students', DEFAULT_STUDENTS));
    }
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/parents', { page, limit, search, sortBy, sortOrder });
      setData(response.data || []);
      setTotal(response.pagination?.total || 0);
    } catch {
      // Fallback local storage mock DB
      const result = getMockCollection<Parent>('mock_parents', DEFAULT_PARENTS, {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        searchFields: ['parentName', 'phone', 'email', 'occupation'],
      });

      // Hydrate relations manually
      const storedStudents = getStorageData('mock_students', DEFAULT_STUDENTS);
      const hydrated = result.data.map((parent) => {
        const student = storedStudents.find((s) => s.id === parent.studentId);
        return {
          ...parent,
          student: student
            ? {
                user: { firstName: student.user.firstName, lastName: student.user.lastName },
                enrollmentNo: student.enrollmentNo,
              }
            : undefined,
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
      parentName: '',
      relation: 'Father',
      studentId: students[0]?.id || '',
      phone: '',
      email: '',
      address: '',
      occupation: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (item: Parent) => {
    setEditItem(item);
    setViewItem(null);
    setFormData({
      parentName: item.parentName,
      relation: item.relation,
      studentId: item.studentId,
      phone: item.phone,
      email: item.email,
      address: item.address,
      occupation: item.occupation,
      isActive: item.isActive,
    });
    setShowModal(true);
  };

  const handleView = (item: Parent) => {
    const storedStudents = getStorageData('mock_students', DEFAULT_STUDENTS);
    const student = storedStudents.find((s) => s.id === item.studentId);
    setViewItem({
      ...item,
      student: student
        ? {
            user: { firstName: student.user.firstName, lastName: student.user.lastName },
            enrollmentNo: student.enrollmentNo,
          }
        : item.student,
    });
  };

  const handleDelete = async (item: Parent) => {
    if (!confirm(`Are you sure you want to delete parent ${item.parentName}?`)) return;
    try {
      await api.delete(`/parents/${item.id}`);
      setToast({ message: 'Parent record deleted successfully!', type: 'success' });
      fetchData();
    } catch {
      deleteMockItem('mock_parents', DEFAULT_PARENTS, item.id);
      setToast({ message: 'Parent record deleted from mock storage!', type: 'success' });
      fetchData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editItem) {
        await api.put(`/parents/${editItem.id}`, formData);
        setToast({ message: 'Parent record updated successfully!', type: 'success' });
      } else {
        await api.post('/parents', formData);
        setToast({ message: 'Parent record created successfully!', type: 'success' });
      }
      setShowModal(false);
      fetchData();
    } catch {
      saveMockItem('mock_parents', DEFAULT_PARENTS, {
        ...(editItem ? { id: editItem.id } : {}),
        ...formData,
      });
      setToast({
        message: editItem ? 'Parent updated in mock storage!' : 'Parent created in mock storage!',
        type: 'success',
      });
      setShowModal(false);
      fetchData();
    }
  };

  const columns = [
    {
      key: 'parentName',
      title: 'Parent',
      sortable: true,
      render: (value: string, row: Parent) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0">
            {value?.[0]}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white leading-tight">{value}</p>
            <p className="text-xs text-slate-500">{row.relation}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'student',
      title: 'Student & USN',
      render: (_: any, row: Parent) =>
        row.student ? (
          <div>
            <p className="font-medium text-slate-800 dark:text-slate-200 leading-tight">
              {row.student.user.firstName} {row.student.user.lastName}
            </p>
            <p className="text-[11px] text-indigo-500 dark:text-indigo-400 font-semibold">{row.student.enrollmentNo}</p>
          </div>
        ) : (
          <span className="text-slate-400 text-xs">Unknown Student</span>
        ),
    },
    { key: 'phone', title: 'Phone' },
    { key: 'email', title: 'Email' },
    { key: 'occupation', title: 'Occupation', sortable: true },
  ];

  return (
    <div className="space-y-6">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div>
        <Breadcrumbs items={[{ label: 'People', href: '#' }, { label: 'Parents' }]} />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md flex-shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Parents</h1>
            <p className="text-sm text-slate-500">Manage student parent and guardian details</p>
          </div>
        </div>
      </div>

      <DataTable
        title="Parents List"
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
        addLabel="Add Parent"
        searchPlaceholder="Search parents..."
      />

      {/* View Details Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Parent Details</h3>
              <button onClick={() => setViewItem(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {viewItem.parentName?.[0]}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{viewItem.parentName}</h4>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-1">Relation: {viewItem.relation}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Student Name</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {viewItem.student ? `${viewItem.student.user.firstName} ${viewItem.student.user.lastName}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Student USN</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.student?.enrollmentNo || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Occupation</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.occupation}</p>
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
                  <p className="text-xs text-slate-500">Address</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 whitespace-pre-line leading-relaxed">
                    {viewItem.address || 'No address registered.'}
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
                {editItem ? 'Edit Parent Record' : 'Register Parent Details'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Parent Name *</label>
                  <input value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Relation *</label>
                  <select value={formData.relation} onChange={(e) => setFormData({ ...formData, relation: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Child / Student *</label>
                  <select value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="" disabled>Select Student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.user?.firstName} {student.user?.lastName} ({student.enrollmentNo})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Occupation</label>
                  <input value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Phone *</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Address *</label>
                <textarea rows={2} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
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
                  {editItem ? 'Update Parent' : 'Create Parent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
