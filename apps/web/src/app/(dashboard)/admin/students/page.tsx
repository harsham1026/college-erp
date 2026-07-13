'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import api from '@/lib/api';
import { GraduationCap, X } from 'lucide-react';

export default function StudentsPage() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', enrollmentNo: '', courseId: '', semesterId: '', batchYear: 2024, admissionDate: '' });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/students', { page, limit, search, sortBy, sortOrder });
      setData(response.data || []);
      setTotal(response.pagination?.total || 0);
    } catch {
      setData([
        { id: '1', enrollmentNo: 'MIT2024001', user: { firstName: 'Rahul', lastName: 'Verma', email: 'rahul@student.erp.com', avatar: null, gender: 'MALE' }, course: { name: 'B.Tech CSE' }, semester: { name: 'Sem 3' }, batchYear: 2024, isActive: true },
        { id: '2', enrollmentNo: 'MIT2024002', user: { firstName: 'Meera', lastName: 'Nair', email: 'meera@student.erp.com', avatar: null, gender: 'FEMALE' }, course: { name: 'B.Tech CSE' }, semester: { name: 'Sem 3' }, batchYear: 2024, isActive: true },
        { id: '3', enrollmentNo: 'MIT2024003', user: { firstName: 'Arjun', lastName: 'Menon', email: 'arjun@student.erp.com', avatar: null, gender: 'MALE' }, course: { name: 'B.Tech ECE' }, semester: { name: 'Sem 3' }, batchYear: 2024, isActive: true },
        { id: '4', enrollmentNo: 'MIT2024004', user: { firstName: 'Divya', lastName: 'Gupta', email: 'divya@student.erp.com', avatar: null, gender: 'FEMALE' }, course: { name: 'B.Tech CSE' }, semester: { name: 'Sem 5' }, batchYear: 2023, isActive: true },
        { id: '5', enrollmentNo: 'MIT2024005', user: { firstName: 'Karan', lastName: 'Malhotra', email: 'karan@student.erp.com', avatar: null, gender: 'MALE' }, course: { name: 'MBA' }, semester: { name: 'Sem 1' }, batchYear: 2024, isActive: true },
      ]);
      setTotal(5);
    } finally { setIsLoading(false); }
  }, [page, limit, search, sortBy, sortOrder]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns = [
    {
      key: 'user', title: 'Student', sortable: true,
      render: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
            {row.user?.firstName?.[0]}{row.user?.lastName?.[0]}
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">{row.user?.firstName} {row.user?.lastName}</p>
            <p className="text-xs text-slate-500">{row.user?.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'enrollmentNo', title: 'Enrollment No', sortable: true },
    { key: 'course', title: 'Course', render: (_: any, row: any) => <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium">{row.course?.name}</span> },
    { key: 'semester', title: 'Semester', render: (_: any, row: any) => row.semester?.name },
    { key: 'batchYear', title: 'Batch', sortable: true },
    {
      key: 'isActive', title: 'Status',
      render: (value: boolean) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${value ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Students</h1>
          <p className="text-sm text-slate-500">Manage all student records</p>
        </div>
      </div>

      <DataTable
        title="All Students"
        columns={columns}
        data={data}
        totalItems={total}
        page={page}
        limit={limit}
        isLoading={isLoading}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        onSearch={(s) => { setSearch(s); setPage(1); }}
        onSort={(by, order) => { setSortBy(by); setSortOrder(order); }}
        onAdd={() => setShowModal(true)}
        onEdit={(row) => alert('Edit: ' + row.id)}
        onDelete={(row) => alert('Delete: ' + row.id)}
        onView={(row) => alert('View: ' + row.id)}
        addLabel="Add Student"
        searchPlaceholder="Search by name or enrollment..."
      />
    </div>
  );
}
