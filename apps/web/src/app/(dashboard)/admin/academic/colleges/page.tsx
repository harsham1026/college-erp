'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import { getMockCollection, saveMockItem, deleteMockItem, DEFAULT_COLLEGES } from '@/lib/mockDb';
import { Building2, X, Eye } from 'lucide-react';

interface College {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  principal: string;
  isActive: boolean;
  createdAt?: string;
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

  // Modal and Notification State
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState<College | null>(null);
  const [editItem, setEditItem] = useState<College | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    phone: '',
    email: '',
    website: '',
    principal: '',
    isActive: true,
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/colleges', { page, limit, search, sortBy, sortOrder });
      setData(response.data || []);
      setTotal(response.pagination?.total || 0);
    } catch {
      // Fallback local storage mock DB
      const result = getMockCollection<College>('mock_colleges', DEFAULT_COLLEGES, {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        searchFields: ['name', 'code', 'city', 'state', 'principal'],
      });
      setData(result.data);
      setTotal(result.pagination.total);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setEditItem(null);
    setViewItem(null);
    setFormData({
      name: '',
      code: '',
      address: '',
      city: '',
      state: '',
      country: 'India',
      phone: '',
      email: '',
      website: '',
      principal: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (item: College) => {
    setEditItem(item);
    setViewItem(null);
    setFormData({
      name: item.name,
      code: item.code,
      address: item.address,
      city: item.city,
      state: item.state,
      country: item.country || 'India',
      phone: item.phone,
      email: item.email,
      website: item.website || '',
      principal: item.principal || '',
      isActive: item.isActive,
    });
    setShowModal(true);
  };

  const handleView = (item: College) => {
    setViewItem(item);
  };

  const handleDelete = async (item: College) => {
    if (!confirm(`Are you sure you want to delete ${item.name}?`)) return;
    try {
      await api.delete(`/colleges/${item.id}`);
      setToast({ message: 'College deleted successfully!', type: 'success' });
      fetchData();
    } catch {
      // Mock delete
      deleteMockItem('mock_colleges', DEFAULT_COLLEGES, item.id);
      setToast({ message: 'College deleted from mock storage!', type: 'success' });
      fetchData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editItem) {
        await api.put(`/colleges/${editItem.id}`, formData);
        setToast({ message: 'College updated successfully!', type: 'success' });
      } else {
        await api.post('/colleges', formData);
        setToast({ message: 'College created successfully!', type: 'success' });
      }
      setShowModal(false);
      fetchData();
    } catch {
      // Mock save
      saveMockItem('mock_colleges', DEFAULT_COLLEGES, {
        ...(editItem ? { id: editItem.id } : {}),
        ...formData,
      });
      setToast({
        message: editItem ? 'College updated in mock storage!' : 'College created in mock storage!',
        type: 'success',
      });
      setShowModal(false);
      fetchData();
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'College',
      sortable: true,
      render: (value: string, row: College) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {row.code?.[0]}
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white leading-tight">{value}</p>
            <p className="text-xs text-slate-500">{row.code}</p>
          </div>
        </div>
      ),
    },
    { key: 'principal', title: 'Principal', sortable: true },
    { key: 'city', title: 'City', sortable: true },
    {
      key: 'phone',
      title: 'Contact',
      render: (_: string, row: College) => (
        <div>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{row.phone}</p>
          <p className="text-[11px] text-slate-400">{row.email}</p>
        </div>
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
        <Breadcrumbs items={[{ label: 'Academic', href: '#' }, { label: 'Colleges' }]} />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Colleges</h1>
            <p className="text-sm text-slate-500">Manage all colleges and campus details</p>
          </div>
        </div>
      </div>

      <DataTable
        title="Colleges List"
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
        addLabel="Add College"
        searchPlaceholder="Search colleges..."
      />

      {/* View Details Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">College Details</h3>
              <button onClick={() => setViewItem(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold">
                  {viewItem.code?.[0]}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{viewItem.name}</h4>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-1">Code: {viewItem.code}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Principal</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.principal || 'N/A'}</p>
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
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Website</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {viewItem.website ? (
                      <a href={viewItem.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                        {viewItem.website}
                      </a>
                    ) : 'N/A'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Address</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {viewItem.address}, {viewItem.city}, {viewItem.state}, {viewItem.country}
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
                {editItem ? 'Edit College' : 'Add College'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">College Name *</label>
                  <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Code *</label>
                  <input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Principal / Director Name *</label>
                <input value={formData.principal} onChange={(e) => setFormData({ ...formData, principal: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Address *</label>
                <input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">City *</label>
                  <input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">State *</label>
                  <input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Country</label>
                  <input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Phone *</label>
                  <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Website URL</label>
                  <input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" placeholder="https://" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Status</label>
                  <select value={formData.isActive ? 'true' : 'false'} onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
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
                  {editItem ? 'Update College' : 'Create College'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
