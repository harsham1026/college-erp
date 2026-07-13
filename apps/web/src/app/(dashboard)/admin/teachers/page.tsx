'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import api from '@/lib/api';
import { Users, X, Loader2 } from 'lucide-react';

export default function TeachersPage() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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
    specialization: '',
    joiningDate: new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Dropdown Metadata State
  const [departments, setDepartments] = useState<any[]>([]);

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
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch dropdown metadata once on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response: any = await api.get('/departments');
        setDepartments(response.data || response || []);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      }
    };
    fetchMetadata();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await api.post('/teachers', formData);
      setShowModal(false);
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        employeeId: '',
        departmentId: '',
        designation: '',
        qualification: '',
        specialization: '',
        joiningDate: new Date().toISOString().split('T')[0],
      });
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to create teacher. Please verify all fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const columns = [
    {
      key: 'user',
      title: 'Teacher',
      sortable: true,
      render: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {row.user?.firstName?.[0]}{row.user?.lastName?.[0]}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{row.user?.firstName} {row.user?.lastName}</p>
            <p className="text-xs text-slate-500">{row.user?.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'employeeId', title: 'Employee ID', sortable: true },
    { key: 'department', title: 'Department', render: (_: any, row: any) => <span className="px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 text-xs font-semibold dark:bg-violet-950/50 dark:text-violet-300 border border-violet-100 dark:border-violet-900/50">{row.department?.name}</span> },
    { key: 'designation', title: 'Designation', sortable: true },
    { key: 'specialization', title: 'Specialization' },
    {
      key: 'isActive',
      title: 'Status',
      render: (value: boolean) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${value ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50'}`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Teachers</h1>
          <p className="text-sm text-slate-500">Manage faculty members and profiles</p>
        </div>
      </div>

      <DataTable
        title="All Teachers"
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
        onEdit={(row) => alert('Edit feature is available under individual teacher details')}
        onDelete={(row) => alert('Teacher deletion must be processed by Super Admin')}
        onView={(row) => alert('View: ' + row.id)}
        addLabel="Add Teacher"
        searchPlaceholder="Search teachers..."
      />

      {/* Modern Add Teacher Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Glassmorphic Background Overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Container */}
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform scale-100 transition-all duration-300 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center">
                  <Users className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Teacher</h2>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium rounded-xl dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30 animate-in slide-in-from-top-2 duration-200">
                ⚠️ {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
              
              {/* Personal Information Group */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">1. Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">First Name *</label>
                    <input 
                      type="text" 
                      name="firstName" 
                      required 
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="e.g. Priya"
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Last Name *</label>
                    <input 
                      type="text" 
                      name="lastName" 
                      required 
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="e.g. Sharma"
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Email *</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="priya.sharma@collegeerp.com"
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Phone</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Academic/Professional Details Group */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">2. Professional Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Employee ID *</label>
                    <input 
                      type="text" 
                      name="employeeId" 
                      required 
                      value={formData.employeeId}
                      onChange={handleChange}
                      placeholder="e.g. TCH098"
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Department *</label>
                    <select 
                      name="departmentId" 
                      required
                      value={formData.departmentId}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white cursor-pointer"
                    >
                      <option value="">Select Department</option>
                      {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Designation *</label>
                    <input 
                      type="text" 
                      name="designation" 
                      required 
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="e.g. Assistant Professor"
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Qualification *</label>
                    <input 
                      type="text" 
                      name="qualification" 
                      required 
                      value={formData.qualification}
                      onChange={handleChange}
                      placeholder="e.g. Ph.D. in CS"
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Specialization</label>
                    <input 
                      type="text" 
                      name="specialization" 
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="e.g. Machine Learning"
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Joining Date *</label>
                    <input 
                      type="date" 
                      name="joiningDate" 
                      required 
                      value={formData.joiningDate}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 sticky bottom-0 bg-white dark:bg-slate-900 z-10">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-violet-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Add Teacher'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
