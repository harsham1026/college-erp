'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import api from '@/lib/api';
import { Building2, X } from 'lucide-react';

interface College {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export default function CollegesPage() {
  const [data, setData] = useState<College[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<College | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', address: '', city: '', state: '', country: 'India', phone: '', email: '', website: '' });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/colleges', { page, limit, search, sortBy, sortOrder });
      setData(response.data || []);
      setTotal(response.pagination?.total || 0);
    } catch {
      // Fallback demo data
      setData([
        { id: '1', name: 'Modern Institute of Technology', code: 'MIT', city: 'Bangalore', state: 'Karnataka', phone: '080-12345678', email: 'info@mit.edu.in', isActive: true, createdAt: '2024-01-01' },
        { id: '2', name: 'National Engineering College', code: 'NEC', city: 'Chennai', state: 'Tamil Nadu', phone: '044-98765432', email: 'info@nec.edu.in', isActive: true, createdAt: '2024-02-15' },
        { id: '3', name: 'Global Business School', code: 'GBS', city: 'Mumbai', state: 'Maharashtra', phone: '022-55667788', email: 'info@gbs.edu.in', isActive: true, createdAt: '2024-03-20' },
      ]);
      setTotal(3);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, sortBy, sortOrder]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = () => {
    setEditItem(null);
    setFormData({ name: '', code: '', address: '', city: '', state: '', country: 'India', phone: '', email: '', website: '' });
    setShowModal(true);
  };

  const handleEdit = (item: College) => {
    setEditItem(item);
    setFormData({ name: item.name, code: item.code, address: '', city: item.city, state: item.state, country: 'India', phone: item.phone, email: item.email, website: '' });
    setShowModal(true);
  };

  const handleDelete = async (item: College) => {
    if (!confirm(`Are you sure you want to delete ${item.name}?`)) return;
    try {
      await api.delete(`/colleges/${item.id}`);
      fetchData();
    } catch {
      alert('Failed to delete');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editItem) {
        await api.put(`/colleges/${editItem.id}`, formData);
      } else {
        await api.post('/colleges', formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to save');
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'College',
      sortable: true,
      render: (value: string, row: College) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
            {row.code?.[0]}
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">{value}</p>
            <p className="text-xs text-slate-500">{row.code}</p>
          </div>
        </div>
      ),
    },
    { key: 'city', title: 'City', sortable: true },
    { key: 'state', title: 'State', sortable: true },
    { key: 'phone', title: 'Phone' },
    { key: 'email', title: 'Email' },
    {
      key: 'isActive',
      title: 'Status',
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
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Colleges</h1>
          <p className="text-sm text-slate-500">Manage all colleges and campuses</p>
        </div>
      </div>

      <DataTable
        title="All Colleges"
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
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add College"
        searchPlaceholder="Search colleges..."
      />

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {editItem ? 'Edit College' : 'Add College'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name *</label>
                  <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Code *</label>
                  <input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address *</label>
                <input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City *</label>
                  <input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">State *</label>
                  <input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Country</label>
                  <input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone *</label>
                  <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Website</label>
                <input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="https://" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  {editItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
