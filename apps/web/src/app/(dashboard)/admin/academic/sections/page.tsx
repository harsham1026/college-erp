'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import { getMockCollection, saveMockItem, deleteMockItem, getStorageData, DEFAULT_SECTIONS, DEFAULT_BRANCHES } from '@/lib/mockDb';
import { CircleDot, X, Eye } from 'lucide-react';

interface Section {
  id: string;
  name: string;
  branchId: string;
  capacity: number; // Intake
  isActive: boolean;
  branch?: { name: string };
  createdAt?: string;
}

export default function SectionsPage() {
  const [data, setData] = useState<Section[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  // Dropdown Metadata State
  const [branches, setBranches] = useState<any[]>([]);

  // Modal and Notification State
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState<Section | null>(null);
  const [editItem, setEditItem] = useState<Section | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    branchId: '',
    capacity: 60,
    isActive: true,
  });

  // Fetch branches for dropdown
  const fetchMetadata = async () => {
    try {
      const branchRes: any = await api.get('/branches');
      setBranches(branchRes.data || branchRes || []);
    } catch {
      setBranches(getStorageData('mock_branches', DEFAULT_BRANCHES));
    }
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/sections', { page, limit, search, sortBy, sortOrder });
      setData(response.data || []);
      setTotal(response.pagination?.total || 0);
    } catch {
      // Fallback local storage mock DB
      const result = getMockCollection<Section>('mock_sections', DEFAULT_SECTIONS, {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        searchFields: ['name'],
      });

      // Hydrate relations manually for display
      const storedBranches = getStorageData('mock_branches', DEFAULT_BRANCHES);
      const hydrated = result.data.map((section) => {
        const branch = storedBranches.find((b) => b.id === section.branchId);
        return {
          ...section,
          branch: branch ? { name: branch.name } : undefined,
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
      branchId: branches[0]?.id || '',
      capacity: 60,
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (item: Section) => {
    setEditItem(item);
    setViewItem(null);
    setFormData({
      name: item.name,
      branchId: item.branchId || '',
      capacity: item.capacity || 60,
      isActive: item.isActive,
    });
    setShowModal(true);
  };

  const handleView = (item: Section) => {
    const storedBranches = getStorageData('mock_branches', DEFAULT_BRANCHES);
    const branch = storedBranches.find((b) => b.id === item.branchId);

    setViewItem({
      ...item,
      branch: branch ? { name: branch.name } : item.branch,
    });
  };

  const handleDelete = async (item: Section) => {
    if (!confirm(`Are you sure you want to delete ${item.name}?`)) return;
    try {
      await api.delete(`/sections/${item.id}`);
      setToast({ message: 'Section deleted successfully!', type: 'success' });
      fetchData();
    } catch {
      deleteMockItem('mock_sections', DEFAULT_SECTIONS, item.id);
      setToast({ message: 'Section deleted from mock storage!', type: 'success' });
      fetchData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      capacity: Number(formData.capacity),
    };
    try {
      if (editItem) {
        await api.put(`/sections/${editItem.id}`, payload);
        setToast({ message: 'Section updated successfully!', type: 'success' });
      } else {
        await api.post('/sections', payload);
        setToast({ message: 'Section created successfully!', type: 'success' });
      }
      setShowModal(false);
      fetchData();
    } catch {
      saveMockItem('mock_sections', DEFAULT_SECTIONS, {
        ...(editItem ? { id: editItem.id } : {}),
        ...payload,
      });
      setToast({
        message: editItem ? 'Section updated in mock storage!' : 'Section created in mock storage!',
        type: 'success',
      });
      setShowModal(false);
      fetchData();
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'Section Name',
      sortable: true,
      render: (value: string) => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {value}
        </span>
      ),
    },
    {
      key: 'branch',
      title: 'Branch',
      render: (_: any, row: Section) => row.branch?.name || <span className="text-slate-400 text-xs">Unknown Branch</span>,
    },
    {
      key: 'capacity',
      title: 'Intake / Capacity',
      sortable: true,
      render: (value: number) => (
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {value} Students
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
        <Breadcrumbs items={[{ label: 'Academic', href: '#' }, { label: 'Sections' }]} />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
            <CircleDot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Sections</h1>
            <p className="text-sm text-slate-500">Manage classroom sections and capacity intake</p>
          </div>
        </div>
      </div>

      <DataTable
        title="Sections List"
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
        addLabel="Add Section"
        searchPlaceholder="Search sections..."
      />

      {/* View Details Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Section Details</h3>
              <button onClick={() => setViewItem(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold">
                  {viewItem.name?.[0]}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{viewItem.name}</h4>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-1">Section Profile</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Intake / Capacity</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.capacity} Students</p>
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
                  <p className="text-xs text-slate-500">Associated Branch</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.branch?.name || 'N/A'}</p>
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
                {editItem ? 'Edit Section' : 'Add Section'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Section Name *</label>
                  <input value={formData.name} placeholder="e.g. Section A" onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Intake Capacity *</label>
                  <input type="number" min={1} max={200} value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Associated Branch *</label>
                <select value={formData.branchId} onChange={(e) => setFormData({ ...formData, branchId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                  <option value="" disabled>Select Branch</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                  ))}
                </select>
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
                  {editItem ? 'Update Section' : 'Create Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
