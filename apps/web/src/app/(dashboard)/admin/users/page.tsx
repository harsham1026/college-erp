'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import {
  getMockCollection, saveMockItem, deleteMockItem, DEFAULT_USERS,
} from '@/lib/mockDb';
import { Users, UserPlus, KeyRound, Shield, CheckCircle, X, Search } from 'lucide-react';

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [resetUser, setResetUser] = useState<any>(null);
  const [tempPass, setTempPass] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'STUDENT',
    department: 'Computer Science',
    status: 'Active',
  });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res: any = await api.get('/users', { page, limit, search, role: roleFilter !== 'ALL' ? roleFilter : undefined });
      setUsers(res.data || []);
      setTotal(res.pagination?.total || 0);
    } catch {
      const res = getMockCollection('mock_users', DEFAULT_USERS, {
        page,
        limit,
        search,
        searchFields: ['firstName', 'lastName', 'email', 'department'],
        filter: (item) => (roleFilter === 'ALL' ? true : item.role === roleFilter),
      });
      setUsers(res.data);
      setTotal(res.pagination.total);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, lastLogin: 'Never' };
    saveMockItem('mock_users', DEFAULT_USERS, { ...(editUser ? { id: editUser.id } : {}), ...payload });
    setToast({ message: editUser ? 'User profile updated!' : 'New user created successfully!', type: 'success' });
    setShowModal(false);
    fetchUsers();
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setToast({ message: `Password reset successfully for ${resetUser.email}. New Temp Pass: ${tempPass}`, type: 'success' });
    setResetUser(null);
  };

  const generateRandomPass = () => {
    const pass = Math.random().toString(36).slice(-8) + '@2026';
    setTempPass(pass);
  };

  const columns = [
    {
      key: 'firstName',
      title: 'User Name & Email',
      sortable: true,
      render: (_: any, r: any) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {r.firstName?.[0]}{r.lastName?.[0]}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white leading-tight">{r.firstName} {r.lastName}</p>
            <p className="text-xs text-slate-500">{r.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Role',
      sortable: true,
      render: (v: string) => (
        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
          {v.replace(/_/g, ' ')}
        </span>
      ),
    },
    { key: 'department', title: 'Department' },
    { key: 'phone', title: 'Phone Number' },
    {
      key: 'status',
      title: 'Status',
      render: (v: string) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${v === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30' : 'bg-red-50 text-red-700 dark:bg-red-950/30'}`}>
          {v || 'Active'}
        </span>
      ),
    },
    {
      key: 'reset',
      title: 'Security',
      render: (_: any, r: any) => (
        <button
          onClick={() => { setResetUser(r); generateRandomPass(); }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs text-slate-600 dark:text-slate-300"
        >
          <KeyRound className="w-3.5 h-3.5" /> Reset Pass
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <Breadcrumbs items={[{ label: 'System' }, { label: 'Users Management' }]} />
        <div className="flex items-center gap-3 mt-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">System Users</h1>
            <p className="text-sm text-slate-500">Manage user accounts across Admins, Teachers, Students, Parents and Principals</p>
          </div>
        </div>
      </div>

      {/* Role Filters */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {['ALL', 'SUPER_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT'].map((r) => (
          <button
            key={r}
            onClick={() => { setRoleFilter(r); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${roleFilter === r ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            {r === 'ALL' ? 'All Roles' : r.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <DataTable
        title="User Accounts"
        columns={columns}
        data={users}
        totalItems={total}
        page={page}
        limit={limit}
        isLoading={isLoading}
        onPageChange={setPage}
        onLimitChange={(l) => { setPage(1); setLimit(l); }}
        onSearch={(s) => { setSearch(s); setPage(1); }}
        onSort={() => {}}
        onAdd={() => {
          setEditUser(null);
          setFormData({ firstName: '', lastName: '', email: '', phone: '', role: 'STUDENT', department: 'Computer Science', status: 'Active' });
          setShowModal(true);
        }}
        onEdit={(r) => {
          setEditUser(r);
          setFormData({ firstName: r.firstName, lastName: r.lastName, email: r.email, phone: r.phone || '', role: r.role, department: r.department || 'Computer Science', status: r.status || 'Active' });
          setShowModal(true);
        }}
        onDelete={(r) => {
          deleteMockItem('mock_users', DEFAULT_USERS, r.id);
          setToast({ message: 'User deleted successfully!', type: 'success' });
          fetchUsers();
        }}
        addLabel="Create User"
        searchPlaceholder="Search users by name, email, department..."
      />

      {/* Create / Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editUser ? 'Edit User Profile' : 'Create User Account'}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">First Name *</label>
                  <input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Last Name *</label>
                  <input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Phone</label>
                  <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Assigned Role *</label>
                  <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0">
                    <option value="SUPER_ADMIN">Super Administrator</option>
                    <option value="PRINCIPAL">Principal</option>
                    <option value="TEACHER">Teacher / Faculty</option>
                    <option value="STUDENT">Student</option>
                    <option value="PARENT">Parent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Department</label>
                  <input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Save Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setResetUser(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reset User Password</h3>
              <button onClick={() => setResetUser(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Resetting password for <strong className="text-slate-900 dark:text-white">{resetUser.firstName} {resetUser.lastName}</strong> ({resetUser.email}).
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Temporary Password</label>
                <div className="flex gap-2">
                  <input value={tempPass} onChange={(e) => setTempPass(e.target.value)} required className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-mono" />
                  <button type="button" onClick={generateRandomPass} className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-medium">Generate</button>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setResetUser(null)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Confirm Reset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
