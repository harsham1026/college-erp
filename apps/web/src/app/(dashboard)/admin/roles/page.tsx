'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import {
  getMockCollection, saveMockItem, deleteMockItem, DEFAULT_ROLES,
} from '@/lib/mockDb';
import { Shield, Lock, Check, X, Sliders, Layers } from 'lucide-react';

export default function RolesPage() {
  const [activeTab, setActiveTab] = useState<'roles' | 'matrix'>('roles');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [roles, setRoles] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editRole, setEditRole] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });

  // Matrix state
  const modulesList = ['Academic', 'People', 'Academics', 'Finance', 'Library', 'Hostel', 'Transport', 'Placement', 'Events', 'System'];
  const [matrixState, setMatrixState] = useState<Record<string, Record<string, boolean>>>({
    SUPER_ADMIN: { Academic: true, People: true, Finance: true, Library: true, Hostel: true, Transport: true, Placement: true, Events: true, System: true },
    TEACHER: { Academic: true, People: true, Academics: true, Finance: false, Library: true, Hostel: false, Transport: false, Placement: false, Events: true, System: false },
    STUDENT: { Academic: true, People: false, Academics: true, Finance: true, Library: true, Hostel: true, Transport: true, Placement: true, Events: true, System: false },
  });

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const res: any = await api.get('/roles', { page, limit, search });
      setRoles(res.data || []);
      setTotal(res.pagination?.total || 0);
    } catch {
      const res = getMockCollection('mock_roles', DEFAULT_ROLES, {
        page, limit, search, searchFields: ['name', 'code', 'description'],
      });
      setRoles(res.data);
      setTotal(res.pagination.total);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMockItem('mock_roles', DEFAULT_ROLES, { ...(editRole ? { id: editRole.id } : {}), ...formData, userCount: editRole ? editRole.userCount : 0, isSystem: false });
    setToast({ message: editRole ? 'Role updated!' : 'Custom role created successfully!', type: 'success' });
    setShowModal(false);
    fetchRoles();
  };

  const toggleMatrix = (roleCode: string, mod: string) => {
    setMatrixState((prev) => ({
      ...prev,
      [roleCode]: {
        ...prev[roleCode],
        [mod]: !prev[roleCode]?.[mod],
      },
    }));
    setToast({ message: 'Permission matrix updated!', type: 'success' });
  };

  const columns = [
    {
      key: 'name',
      title: 'Role Name & Code',
      sortable: true,
      render: (v: string, r: any) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{v}</p>
          <p className="text-xs text-slate-500 font-mono">CODE: {r.code}</p>
        </div>
      ),
    },
    { key: 'description', title: 'Role Scope & Description' },
    { key: 'userCount', title: 'Users Assigned', render: (v: number) => <strong className="text-indigo-600 dark:text-indigo-400">{v} Users</strong> },
    {
      key: 'isSystem',
      title: 'System Locked',
      render: (v: boolean) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${v ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'bg-slate-100 text-slate-700'}`}>
          {v ? 'System Built-In' : 'Custom Role'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <Breadcrumbs items={[{ label: 'System' }, { label: 'Roles & Permissions' }]} />
        <div className="flex items-center gap-3 mt-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Roles & Permissions Matrix</h1>
            <p className="text-sm text-slate-500">Manage system roles, module accessibility, and granular authorization controls</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button onClick={() => setActiveTab('roles')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'roles' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Shield className="w-4 h-4" /> System Roles
        </button>
        <button onClick={() => setActiveTab('matrix')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'matrix' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Sliders className="w-4 h-4" /> Access Matrix
        </button>
      </div>

      {activeTab === 'roles' && (
        <DataTable
          title="Role Profiles"
          columns={columns}
          data={roles}
          totalItems={total}
          page={page}
          limit={limit}
          isLoading={isLoading}
          onPageChange={setPage}
          onLimitChange={(l) => { setPage(1); setLimit(l); }}
          onSearch={(s) => { setSearch(s); setPage(1); }}
          onSort={() => {}}
          onAdd={() => { setEditRole(null); setFormData({ name: '', code: '', description: '' }); setShowModal(true); }}
          onEdit={(r) => { setEditRole(r); setFormData({ name: r.name, code: r.code, description: r.description }); setShowModal(true); }}
          onDelete={(r) => {
            if (r.isSystem) { setToast({ message: 'System built-in roles cannot be deleted!', type: 'error' }); return; }
            deleteMockItem('mock_roles', DEFAULT_ROLES, r.id);
            setToast({ message: 'Role deleted!', type: 'success' });
            fetchRoles();
          }}
          addLabel="Create Role"
          searchPlaceholder="Search role title or code..."
        />
      )}

      {activeTab === 'matrix' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto p-6">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Module Permission Matrix</h3>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="py-3 px-4 uppercase text-xs">Module</th>
                <th className="py-3 px-4 uppercase text-xs">Super Admin</th>
                <th className="py-3 px-4 uppercase text-xs">Teacher</th>
                <th className="py-3 px-4 uppercase text-xs">Student</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {modulesList.map((mod) => (
                <tr key={mod} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{mod} Module</td>
                  <td className="py-3 px-4">
                    <button onClick={() => toggleMatrix('SUPER_ADMIN', mod)} className={`px-2.5 py-1 rounded text-xs font-bold ${matrixState.SUPER_ADMIN?.[mod] !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {matrixState.SUPER_ADMIN?.[mod] !== false ? 'Full Access' : 'No Access'}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => toggleMatrix('TEACHER', mod)} className={`px-2.5 py-1 rounded text-xs font-bold ${matrixState.TEACHER?.[mod] ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {matrixState.TEACHER?.[mod] ? 'Allowed' : 'Disabled'}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => toggleMatrix('STUDENT', mod)} className={`px-2.5 py-1 rounded text-xs font-bold ${matrixState.STUDENT?.[mod] ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {matrixState.STUDENT?.[mod] ? 'Allowed' : 'Disabled'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Role Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editRole ? 'Edit Role' : 'Create Custom Role'}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Role Title *</label>
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Role Code Tag *</label>
                <input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. DEAN_ACADEMICS" required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Save Role</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
