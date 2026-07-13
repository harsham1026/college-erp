'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import api from '@/lib/api';
import { Layers, X } from 'lucide-react';

export default function DepartmentsPage() {
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
      const response: any = await api.get('/departments', { page, limit, search, sortBy, sortOrder });
      setData(response.data || []);
      setTotal(response.pagination?.total || 0);
    } catch {
      setData([
        { id: '1', name: 'Computer Science & Engineering', code: 'CSE', college: { name: 'MIT' }, hod: { user: { firstName: 'Priya', lastName: 'Sharma' } }, isActive: true, description: 'Department of CS' },
        { id: '2', name: 'Electronics & Communication', code: 'ECE', college: { name: 'MIT' }, hod: null, isActive: true, description: 'Department of ECE' },
        { id: '3', name: 'Mechanical Engineering', code: 'ME', college: { name: 'MIT' }, hod: null, isActive: true, description: 'Department of ME' },
        { id: '4', name: 'Business Administration', code: 'MBA', college: { name: 'MIT' }, hod: null, isActive: true, description: 'Department of MBA' },
      ]);
      setTotal(4);
    } finally { setIsLoading(false); }
  }, [page, limit, search, sortBy, sortOrder]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns = [
    {
      key: 'name', title: 'Department', sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
            {row.code?.[0]}{row.code?.[1]}
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">{value}</p>
            <p className="text-xs text-slate-500">{row.code}</p>
          </div>
        </div>
      ),
    },
    { key: 'college', title: 'College', render: (_: any, row: any) => row.college?.name },
    { key: 'hod', title: 'HOD', render: (_: any, row: any) => row.hod ? `${row.hod.user?.firstName} ${row.hod.user?.lastName}` : <span className="text-slate-400 text-xs">Not assigned</span> },
    {
      key: 'isActive', title: 'Status',
      render: (value: boolean) => <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${value ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{value ? 'Active' : 'Inactive'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Departments</h1>
          <p className="text-sm text-slate-500">Manage academic departments</p>
        </div>
      </div>
      <DataTable title="All Departments" columns={columns} data={data} totalItems={total} page={page} limit={limit} isLoading={isLoading}
        onPageChange={setPage} onLimitChange={(l) => { setLimit(l); setPage(1); }} onSearch={(s) => { setSearch(s); setPage(1); }}
        onSort={(by, order) => { setSortBy(by); setSortOrder(order); }} onAdd={() => {}} onEdit={() => {}} onDelete={() => {}}
        addLabel="Add Department" searchPlaceholder="Search departments..."
      />
    </div>
  );
}
