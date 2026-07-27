'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import { getMockCollection, saveMockItem, deleteMockItem, getStorageData, DEFAULT_SUBJECTS, DEFAULT_COURSES, DEFAULT_SEMESTERS } from '@/lib/mockDb';
import { BookOpenCheck, X, Eye } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  code: string;
  courseId: string;
  semesterId: string;
  credits: number;
  type: 'THEORY' | 'PRACTICAL' | 'ELECTIVE';
  description?: string;
  isActive: boolean;
  course?: { name: string };
  semester?: { name: string; number: number };
  createdAt?: string;
}

export default function SubjectsPage() {
  const [data, setData] = useState<Subject[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  // Dropdown Metadata State
  const [courses, setCourses] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [filteredSemesters, setFilteredSemesters] = useState<any[]>([]);

  // Modal and Notification State
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState<Subject | null>(null);
  const [editItem, setEditItem] = useState<Subject | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    courseId: '',
    semesterId: '',
    credits: 4,
    type: 'THEORY' as 'THEORY' | 'PRACTICAL' | 'ELECTIVE',
    description: '',
    isActive: true,
  });

  // Fetch courses & semesters for dropdowns
  const fetchMetadata = async () => {
    try {
      const courseRes: any = await api.get('/courses');
      setCourses(courseRes.data || courseRes || []);
    } catch {
      setCourses(getStorageData('mock_courses', DEFAULT_COURSES));
    }

    try {
      const semRes: any = await api.get('/semesters');
      setSemesters(semRes.data || semRes || []);
    } catch {
      setSemesters(getStorageData('mock_semesters', DEFAULT_SEMESTERS));
    }
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/subjects', { page, limit, search, sortBy, sortOrder });
      setData(response.data || []);
      setTotal(response.pagination?.total || 0);
    } catch {
      // Fallback local storage mock DB
      const result = getMockCollection<Subject>('mock_subjects', DEFAULT_SUBJECTS, {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        searchFields: ['name', 'code', 'description'],
      });

      // Hydrate relations manually for display
      const storedCourses = getStorageData('mock_courses', DEFAULT_COURSES);
      const storedSemesters = getStorageData('mock_semesters', DEFAULT_SEMESTERS);
      const hydrated = result.data.map((subj) => {
        const course = storedCourses.find((c) => c.id === subj.courseId);
        const sem = storedSemesters.find((s) => s.id === subj.semesterId);
        return {
          ...subj,
          course: course ? { name: course.name } : undefined,
          semester: sem ? { name: sem.name, number: sem.number } : undefined,
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

  // Handle filtering semesters when course changes in the form
  useEffect(() => {
    if (formData.courseId) {
      const filtered = semesters.filter((sem) => sem.courseId === formData.courseId);
      setFilteredSemesters(filtered);
      // Auto select first semester if available, or empty it
      if (filtered.length > 0) {
        // If editing, preserve semesterId if it exists in filtered list, otherwise set to first item
        if (!filtered.some((f) => f.id === formData.semesterId)) {
          setFormData((prev) => ({ ...prev, semesterId: filtered[0].id }));
        }
      } else {
        setFormData((prev) => ({ ...prev, semesterId: '' }));
      }
    } else {
      setFilteredSemesters([]);
    }
  }, [formData.courseId, semesters]);

  const handleAdd = () => {
    setEditItem(null);
    setViewItem(null);
    setFormData({
      name: '',
      code: '',
      courseId: courses[0]?.id || '',
      semesterId: '',
      credits: 4,
      type: 'THEORY',
      description: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (item: Subject) => {
    setEditItem(item);
    setViewItem(null);
    setFormData({
      name: item.name,
      code: item.code,
      courseId: item.courseId,
      semesterId: item.semesterId,
      credits: item.credits,
      type: item.type,
      description: item.description || '',
      isActive: item.isActive,
    });
    setShowModal(true);
  };

  const handleView = (item: Subject) => {
    const storedCourses = getStorageData('mock_courses', DEFAULT_COURSES);
    const storedSemesters = getStorageData('mock_semesters', DEFAULT_SEMESTERS);
    const course = storedCourses.find((c) => c.id === item.courseId);
    const sem = storedSemesters.find((s) => s.id === item.semesterId);

    setViewItem({
      ...item,
      course: course ? { name: course.name } : item.course,
      semester: sem ? { name: sem.name, number: sem.number } : item.semester,
    });
  };

  const handleDelete = async (item: Subject) => {
    if (!confirm(`Are you sure you want to delete ${item.name}?`)) return;
    try {
      await api.delete(`/subjects/${item.id}`);
      setToast({ message: 'Subject deleted successfully!', type: 'success' });
      fetchData();
    } catch {
      deleteMockItem('mock_subjects', DEFAULT_SUBJECTS, item.id);
      setToast({ message: 'Subject deleted from mock storage!', type: 'success' });
      fetchData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      credits: Number(formData.credits),
    };
    try {
      if (editItem) {
        await api.put(`/subjects/${editItem.id}`, payload);
        setToast({ message: 'Subject updated successfully!', type: 'success' });
      } else {
        await api.post('/subjects', payload);
        setToast({ message: 'Subject created successfully!', type: 'success' });
      }
      setShowModal(false);
      fetchData();
    } catch {
      saveMockItem('mock_subjects', DEFAULT_SUBJECTS, {
        ...(editItem ? { id: editItem.id } : {}),
        ...payload,
      });
      setToast({
        message: editItem ? 'Subject updated in mock storage!' : 'Subject created in mock storage!',
        type: 'success',
      });
      setShowModal(false);
      fetchData();
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'Subject',
      sortable: true,
      render: (value: string, row: Subject) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {row.code}
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white leading-tight">{value}</p>
            <p className="text-xs text-slate-500">{row.credits} Credits • {row.type}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'course',
      title: 'Course',
      render: (_: any, row: Subject) => row.course?.name || <span className="text-slate-400 text-xs">Unknown Course</span>,
    },
    {
      key: 'semester',
      title: 'Semester',
      render: (_: any, row: Subject) => row.semester ? `Semester ${row.semester.number}` : <span className="text-slate-400 text-xs">Unknown Sem</span>,
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
        <Breadcrumbs items={[{ label: 'Academic', href: '#' }, { label: 'Subjects' }]} />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
            <BookOpenCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Subjects</h1>
            <p className="text-sm text-slate-500">Manage academic subjects, credits and syllabus type</p>
          </div>
        </div>
      </div>

      <DataTable
        title="Subjects List"
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
        addLabel="Add Subject"
        searchPlaceholder="Search subjects..."
      />

      {/* View Details Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Subject Details</h3>
              <button onClick={() => setViewItem(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-xl font-bold">
                  {viewItem.code}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{viewItem.name}</h4>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-1">Code: {viewItem.code}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Credits</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.credits} Credits</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Subject Type</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Degree Course</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.course?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Semester Term</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {viewItem.semester ? `${viewItem.semester.name} (Semester ${viewItem.semester.number})` : 'N/A'}
                  </p>
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
                  <p className="text-xs text-slate-500">Description</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-1 whitespace-pre-line leading-relaxed">
                    {viewItem.description || 'No description available for this subject.'}
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
                {editItem ? 'Edit Subject' : 'Add Subject'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Subject Name *</label>
                  <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Subject Code *</label>
                  <input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Credits (1-10) *</label>
                  <input type="number" min={1} max={10} value={formData.credits} onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Syllabus Type *</label>
                  <select value={formData.type} onChange={(e: any) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="THEORY">Theory</option>
                    <option value="PRACTICAL">Practical</option>
                    <option value="ELECTIVE">Elective</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Course *</label>
                  <select value={formData.courseId} onChange={(e) => setFormData({ ...formData, courseId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="" disabled>Select Course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Semester *</label>
                  <select value={formData.semesterId} onChange={(e) => setFormData({ ...formData, semesterId: e.target.value })} required disabled={!formData.courseId} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50">
                    <option value="" disabled>Select Semester</option>
                    {filteredSemesters.map((sem) => (
                      <option key={sem.id} value={sem.id}>Semester {sem.number} ({sem.name})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
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
                  {editItem ? 'Update Subject' : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
