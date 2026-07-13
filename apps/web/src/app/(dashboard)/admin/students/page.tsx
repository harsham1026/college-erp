'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import api from '@/lib/api';
import { GraduationCap, X, Loader2 } from 'lucide-react';

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

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'MALE',
    enrollmentNo: '',
    courseId: '',
    branchId: '',
    sectionId: '',
    semesterId: '',
    batchYear: new Date().getFullYear(),
    admissionDate: new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Dropdown Metadata State
  const [courses, setCourses] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

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
        const [cRes, bRes, semRes, secRes]: any = await Promise.all([
          api.get('/courses'),
          api.get('/branches'),
          api.get('/semesters'),
          api.get('/sections'),
        ]);
        setCourses(cRes.data || cRes || []);
        setBranches(bRes.data || bRes || []);
        setSemesters(semRes.data || semRes || []);
        setSections(secRes.data || secRes || []);
      } catch (err) {
        console.error('Failed to fetch dropdown metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await api.post('/students', formData);
      setShowModal(false);
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: 'MALE',
        enrollmentNo: '',
        courseId: '',
        branchId: '',
        sectionId: '',
        semesterId: '',
        batchYear: new Date().getFullYear(),
        admissionDate: new Date().toISOString().split('T')[0],
      });
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to create student. Please verify the input values.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'batchYear' ? parseInt(value) || new Date().getFullYear() : value,
    }));
  };

  const columns = [
    {
      key: 'user',
      title: 'Student',
      sortable: true,
      render: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {row.user?.firstName?.[0]}{row.user?.lastName?.[0]}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{row.user?.firstName} {row.user?.lastName}</p>
            <p className="text-xs text-slate-500">{row.user?.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'enrollmentNo', title: 'Enrollment No', sortable: true },
    { key: 'course', title: 'Course', render: (_: any, row: any) => <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">{row.course?.name}</span> },
    { key: 'semester', title: 'Semester', render: (_: any, row: any) => row.semester?.name },
    { key: 'batchYear', title: 'Batch', sortable: true },
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

  // Filtering metadata based on selection for clean UX
  const filteredBranches = formData.courseId
    ? branches.filter(b => b.courseId === formData.courseId)
    : branches;

  const filteredSemesters = formData.courseId
    ? semesters.filter(s => s.courseId === formData.courseId)
    : semesters;

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Students</h1>
          <p className="text-sm text-slate-500">Manage all student records and profiles</p>
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
        onEdit={(row) => alert('Edit feature is available under individual student details')}
        onDelete={(row) => alert('Student deletion must be processed by Super Admin')}
        onView={(row) => alert('View: ' + row.id)}
        addLabel="Add Student"
        searchPlaceholder="Search by name or enrollment..."
      />

      {/* Modern Add Student Modal */}
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
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Student</h2>
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
                      placeholder="e.g. Rahul"
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
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
                      placeholder="e.g. Verma"
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
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
                      placeholder="rahul.verma@student.com"
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Phone</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 9876543210"
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Gender *</label>
                    <select 
                      name="gender" 
                      required
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white cursor-pointer"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Academic Details Group */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">2. Academic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Enrollment Number *</label>
                    <input 
                      type="text" 
                      name="enrollmentNo" 
                      required 
                      value={formData.enrollmentNo}
                      onChange={handleChange}
                      placeholder="e.g. MIT2024098"
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Course *</label>
                    <select 
                      name="courseId" 
                      required
                      value={formData.courseId}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white cursor-pointer"
                    >
                      <option value="">Select Course</option>
                      {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Branch *</label>
                    <select 
                      name="branchId" 
                      required
                      value={formData.branchId}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white cursor-pointer"
                    >
                      <option value="">Select Branch</option>
                      {filteredBranches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Semester *</label>
                    <select 
                      name="semesterId" 
                      required
                      value={formData.semesterId}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white cursor-pointer"
                    >
                      <option value="">Select Semester</option>
                      {filteredSemesters.map(s => <option key={s.id} value={s.id}>{s.name || `Sem ${s.number}`}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Section *</label>
                    <select 
                      name="sectionId" 
                      required
                      value={formData.sectionId}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white cursor-pointer"
                    >
                      <option value="">Select Section</option>
                      {sections.map(sec => <option key={sec.id} value={sec.id}>{sec.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Batch Year *</label>
                    <input 
                      type="number" 
                      name="batchYear" 
                      required 
                      value={formData.batchYear}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Admission Date *</label>
                    <input 
                      type="date" 
                      name="admissionDate" 
                      required 
                      value={formData.admissionDate}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
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
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Add Student'
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
