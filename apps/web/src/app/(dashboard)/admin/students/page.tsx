'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import { getMockCollection, saveMockItem, deleteMockItem, getStorageData, DEFAULT_STUDENTS, DEFAULT_COURSES, DEFAULT_BRANCHES, DEFAULT_SEMESTERS, DEFAULT_SECTIONS } from '@/lib/mockDb';
import { GraduationCap, X, Eye } from 'lucide-react';

interface Student {
  id: string;
  enrollmentNo: string; // USN
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  courseId: string;
  branchId?: string;
  semesterId: string;
  sectionId?: string;
  batchYear: number; // Admission Year
  isActive: boolean;
  course?: { name: string };
  branch?: { name: string };
  semester?: { name: string; number: number };
  section?: { name: string };
}

export default function StudentsPage() {
  const [data, setData] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  // Dropdown Metadata State
  const [courses, setCourses] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  // Modal and Notification State
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState<Student | null>(null);
  const [editItem, setEditItem] = useState<Student | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    enrollmentNo: '',
    courseId: '',
    branchId: '',
    semesterId: '',
    sectionId: '',
    batchYear: new Date().getFullYear(),
    isActive: true,
  });

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
    } catch {
      setCourses(getStorageData('mock_courses', DEFAULT_COURSES));
      setBranches(getStorageData('mock_branches', DEFAULT_BRANCHES));
      setSemesters(getStorageData('mock_semesters', DEFAULT_SEMESTERS));
      setSections(getStorageData('mock_sections', DEFAULT_SECTIONS));
    }
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/students', { page, limit, search, sortBy, sortOrder });
      setData(response.data || []);
      setTotal(response.pagination?.total || 0);
    } catch {
      // Fallback local storage mock DB
      const result = getMockCollection<any>('mock_students', DEFAULT_STUDENTS, {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        searchFields: ['enrollmentNo'],
      });

      // Name / Email filtering
      let filtered = result.data;
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.user?.firstName?.toLowerCase().includes(searchLower) ||
            s.user?.lastName?.toLowerCase().includes(searchLower) ||
            s.user?.email?.toLowerCase().includes(searchLower)
        );
      }

      // Hydrate relations manually
      const storedCourses = getStorageData('mock_courses', DEFAULT_COURSES);
      const storedBranches = getStorageData('mock_branches', DEFAULT_BRANCHES);
      const storedSemesters = getStorageData('mock_semesters', DEFAULT_SEMESTERS);
      const storedSections = getStorageData('mock_sections', DEFAULT_SECTIONS);

      const hydrated = filtered.map((student) => {
        const course = storedCourses.find((c) => c.id === student.courseId);
        const branch = storedBranches.find((b) => b.id === student.branchId);
        const sem = storedSemesters.find((s) => s.id === student.semesterId);
        const sec = storedSections.find((s) => s.id === student.sectionId);
        return {
          ...student,
          course: course ? { name: course.name } : undefined,
          branch: branch ? { name: branch.name } : undefined,
          semester: sem ? { name: sem.name, number: sem.number } : undefined,
          section: sec ? { name: sec.name } : undefined,
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
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      enrollmentNo: '',
      courseId: courses[0]?.id || '',
      branchId: branches[0]?.id || '',
      semesterId: semesters[0]?.id || '',
      sectionId: sections[0]?.id || '',
      batchYear: new Date().getFullYear(),
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (item: Student) => {
    setEditItem(item);
    setViewItem(null);
    setFormData({
      firstName: item.user?.firstName || '',
      lastName: item.user?.lastName || '',
      email: item.user?.email || '',
      phone: item.user?.phone || '',
      enrollmentNo: item.enrollmentNo,
      courseId: item.courseId || '',
      branchId: item.branchId || '',
      semesterId: item.semesterId || '',
      sectionId: item.sectionId || '',
      batchYear: item.batchYear || new Date().getFullYear(),
      isActive: item.isActive,
    });
    setShowModal(true);
  };

  const handleView = (item: Student) => {
    const storedCourses = getStorageData('mock_courses', DEFAULT_COURSES);
    const storedBranches = getStorageData('mock_branches', DEFAULT_BRANCHES);
    const storedSemesters = getStorageData('mock_semesters', DEFAULT_SEMESTERS);
    const storedSections = getStorageData('mock_sections', DEFAULT_SECTIONS);

    setViewItem({
      ...item,
      course: storedCourses.find((c) => c.id === item.courseId) || item.course,
      branch: storedBranches.find((b) => b.id === item.branchId) || item.branch,
      semester: storedSemesters.find((s) => s.id === item.semesterId) || item.semester,
      section: storedSections.find((s) => s.id === item.sectionId) || item.section,
    });
  };

  const handleDelete = async (item: Student) => {
    if (!confirm(`Are you sure you want to delete student ${item.user?.firstName} ${item.user?.lastName}?`)) return;
    try {
      await api.delete(`/students/${item.id}`);
      setToast({ message: 'Student record deleted successfully!', type: 'success' });
      fetchData();
    } catch {
      deleteMockItem('mock_students', DEFAULT_STUDENTS, item.id);
      setToast({ message: 'Student record deleted from mock storage!', type: 'success' });
      fetchData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      enrollmentNo: formData.enrollmentNo,
      courseId: formData.courseId,
      branchId: formData.branchId || undefined,
      semesterId: formData.semesterId,
      sectionId: formData.sectionId || undefined,
      batchYear: Number(formData.batchYear),
      isActive: formData.isActive,
      user: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      },
    };

    try {
      if (editItem) {
        await api.put(`/students/${editItem.id}`, payload);
        setToast({ message: 'Student record updated successfully!', type: 'success' });
      } else {
        await api.post('/students', payload);
        setToast({ message: 'Student record created successfully!', type: 'success' });
      }
      setShowModal(false);
      fetchData();
    } catch {
      saveMockItem('mock_students', DEFAULT_STUDENTS, {
        ...(editItem ? { id: editItem.id } : {}),
        ...payload,
      });
      setToast({
        message: editItem ? 'Student updated in mock storage!' : 'Student created in mock storage!',
        type: 'success',
      });
      setShowModal(false);
      fetchData();
    }
  };

  const columns = [
    {
      key: 'user',
      title: 'Student',
      sortable: true,
      render: (_: any, row: Student) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0">
            {row.user?.firstName?.[0]}{row.user?.lastName?.[0]}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white leading-tight">{row.user?.firstName} {row.user?.lastName}</p>
            <p className="text-xs text-slate-500">{row.user?.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'enrollmentNo', title: 'USN / Enrollment', sortable: true },
    {
      key: 'course',
      title: 'Course',
      render: (_: any, row: Student) => (
        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
          {row.course?.name || 'N/A'}
        </span>
      ),
    },
    {
      key: 'semester',
      title: 'Semester',
      render: (_: any, row: Student) => (row.semester ? `Semester ${row.semester.number}` : 'N/A'),
    },
    { key: 'batchYear', title: 'Admission Year', sortable: true },
    {
      key: 'isActive',
      title: 'Status',
      render: (value: boolean) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${value ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400'}`}>
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
        <Breadcrumbs items={[{ label: 'People', href: '#' }, { label: 'Students' }]} />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Students</h1>
            <p className="text-sm text-slate-500">Manage all student records and profiles</p>
          </div>
        </div>
      </div>

      <DataTable
        title="Students List"
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
        addLabel="Add Student"
        searchPlaceholder="Search by name or enrollment..."
      />

      {/* View Details Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Student Profile Details</h3>
              <button onClick={() => setViewItem(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {viewItem.user?.firstName?.[0]}{viewItem.user?.lastName?.[0]}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{viewItem.user?.firstName} {viewItem.user?.lastName}</h4>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-1">USN/Enrollment No: {viewItem.enrollmentNo}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Degree Course</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.course?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Branch</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.branch?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Semester</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {viewItem.semester ? `Semester ${viewItem.semester.number} (${viewItem.semester.name})` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Section</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.section?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Admission Year</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.batchYear}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.user?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email Address</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <p className="mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${viewItem.isActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30' : 'bg-red-50 text-red-700 dark:bg-red-950/30'}`}>
                      {viewItem.isActive ? 'Active' : 'Inactive'}
                    </span>
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
                {editItem ? 'Edit Student Profile' : 'Add New Student'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">First Name *</label>
                  <input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Last Name *</label>
                  <input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Phone</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">USN / Enrollment *</label>
                  <input value={formData.enrollmentNo} onChange={(e) => setFormData({ ...formData, enrollmentNo: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Admission Year *</label>
                  <input type="number" value={formData.batchYear} onChange={(e) => setFormData({ ...formData, batchYear: Number(e.target.value) })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Course *</label>
                  <select value={formData.courseId} onChange={(e) => setFormData({ ...formData, courseId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="" disabled>Select Course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Branch *</label>
                  <select value={formData.branchId} onChange={(e) => setFormData({ ...formData, branchId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="" disabled>Select Branch</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Semester *</label>
                  <select value={formData.semesterId} onChange={(e) => setFormData({ ...formData, semesterId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="" disabled>Select Semester</option>
                    {semesters.map((s) => (
                      <option key={s.id} value={s.id}>Semester {s.number} ({s.name})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Section *</label>
                  <select value={formData.sectionId} onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="" disabled>Select Section</option>
                    {sections.map((sec) => (
                      <option key={sec.id} value={sec.id}>{sec.name}</option>
                    ))}
                  </select>
                </div>
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
                  {editItem ? 'Update Student' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
