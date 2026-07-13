'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import api from '@/lib/api';
import { Users } from 'lucide-react';

export default function TeachersPage() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/teachers', { page, limit, search, sortBy, sortOrder });
      setData(response.data || []);
      setTotal(response.pagination?.total || 0);
    } catch {
      setData([
        { id: '1', employeeId: 'TCH001', user: { firstName: 'Priya', lastName: 'Sharma', email: 'priya@erp.com' }, department: { name: 'CSE' }, designation: 'Associate Professor', qualification: 'Ph.D. CS', specialization: 'AI', isActive: true },
        { id: '2', employeeId: 'TCH002', user: { firstName: 'Arun', lastName: 'Patel', email: 'arun@erp.com' }, department: { name: 'CSE' }, designation: 'Assistant Professor', qualification: 'M.Tech CS', specialization: 'Data Structures', isActive: true },
        { id: '3', employeeId: 'TCH003', user: { firstName: 'Sneha', lastName: 'Reddy', email: 'sneha@erp.com' }, department: { name: 'ECE' }, designation: 'Professor', qualification: 'Ph.D. Electronics', specialization: 'VLSI', isActive: true },
      ]);
      setTotal(3);
    } finally { setIsLoading(false); }
  }, [page, limit, search, sortBy, sortOrder]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns = [
    {
      key: 'user', title: 'Teacher', sortable: true,
      render: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            {row.user?.firstName?.[0]}{row.user?.lastName?.[0]}
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">{row.user?.firstName} {row.user?.lastName}</p>
            <p className="text-xs text-slate-500">{row.user?.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'employeeId', title: 'Employee ID', sortable: true },
    { key: 'department', title: 'Department', render: (_: any, row: any) => <span className="px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 text-xs font-medium">{row.department?.name}</span> },
    { key: 'designation', title: 'Designation', sortable: true },
    { key: 'specialization', title: 'Specialization' },
    {
      key: 'isActive', title: 'Status',
      render: (value: boolean) => <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${value ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{value ? 'Active' : 'Inactive'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Teachers</h1>
          <p className="text-sm text-slate-500">Manage faculty members</p>
        </div>
      </div>
      <DataTable title="All Teachers" columns={columns} data={data} totalItems={total} page={page} limit={limit} isLoading={isLoading}
        onPageChange={setPage} onLimitChange={(l) => { setLimit(l); setPage(1); }} onSearch={(s) => { setSearch(s); setPage(1); }}
        onSort={(by, order) => { setSortBy(by); setSortOrder(order); }} onAdd={() => {}} onEdit={() => {}} onDelete={() => {}} onView={() => {}}
        addLabel="Add Teacher" searchPlaceholder="Search teachers..."
      />
    </div>
  );
}
