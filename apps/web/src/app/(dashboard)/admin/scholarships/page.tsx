'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import { getMockCollection, saveMockItem, deleteMockItem, getStorageData, saveStorageData, DEFAULT_SCHOLARSHIPS, DEFAULT_SCHOLARSHIP_APPLICATIONS, DEFAULT_STUDENTS } from '@/lib/mockDb';
import { Award, X, Check, Eye } from 'lucide-react';

interface Scholarship {
  id: string;
  name: string;
  amount: number;
  description: string;
}

interface ScholarshipApplication {
  id: string;
  studentId: string;
  scholarshipId: string;
  applyDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  paymentStatus: 'PENDING' | 'DISBURSED';
  student?: { user: { firstName: string; lastName: string }; enrollmentNo: string };
  scholarship?: { name: string; amount: number };
}

export default function ScholarshipsPage() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'applications'>('catalog');

  // Datatable Lists
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);

  // Paging states
  const [isLoading, setIsLoading] = useState(true);
  const [catTotal, setCatTotal] = useState(0);
  const [catPage, setCatPage] = useState(1);
  const [catLimit, setCatLimit] = useState(10);
  const [catSearch, setCatSearch] = useState('');

  const [appTotal, setAppTotal] = useState(0);
  const [appPage, setAppPage] = useState(1);
  const [appLimit, setAppLimit] = useState(10);
  const [appSearch, setAppSearch] = useState('');

  // Sorting states
  const [catSortBy, setCatSortBy] = useState('name');
  const [catSortOrder, setCatSortOrder] = useState<'asc' | 'desc'>('asc');
  const [appSortBy, setAppSortBy] = useState('applyDate');
  const [appSortOrder, setAppSortOrder] = useState<'asc' | 'desc'>('desc');

  // Dropdown Metadata
  const [students, setStudents] = useState<any[]>([]);
  const [scholarshipsAll, setScholarshipsAll] = useState<any[]>([]);

  // Modals & Notifications
  const [showCatModal, setShowCatModal] = useState(false);
  const [editCat, setEditCat] = useState<Scholarship | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form States
  const [catForm, setCatForm] = useState({
    name: '',
    amount: 15000,
    description: '',
  });

  const [applyForm, setApplyForm] = useState({
    studentId: '',
    scholarshipId: '',
  });

  const fetchMetadata = async () => {
    try {
      const studRes: any = await api.get('/students');
      setStudents(studRes.data || studRes || []);
    } catch {
      setStudents(getStorageData('mock_students', DEFAULT_STUDENTS));
    }
  };

  const fetchCatalog = useCallback(() => {
    setIsLoading(true);
    try {
      const result = getMockCollection<Scholarship>('mock_scholarships', DEFAULT_SCHOLARSHIPS, {
        page: catPage,
        limit: catLimit,
        search: catSearch,
        sortBy: catSortBy,
        sortOrder: catSortOrder,
        searchFields: ['name', 'description'],
      });
      setScholarships(result.data);
      setScholarshipsAll(getStorageData('mock_scholarships', DEFAULT_SCHOLARSHIPS));
      setCatTotal(result.pagination.total);
    } catch {
      setToast({ message: 'Failed to retrieve scholarship catalog.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [catPage, catLimit, catSearch, catSortBy, catSortOrder]);

  const fetchApplications = useCallback(() => {
    setIsLoading(true);
    try {
      const result = getMockCollection<ScholarshipApplication>('mock_scholarship_applications', DEFAULT_SCHOLARSHIP_APPLICATIONS, {
        page: appPage,
        limit: appLimit,
        search: appSearch,
        sortBy: appSortBy,
        sortOrder: appSortOrder,
        searchFields: ['status', 'paymentStatus'],
      });

      const storedStudents = getStorageData('mock_students', DEFAULT_STUDENTS);
      const storedScholarships = getStorageData('mock_scholarships', DEFAULT_SCHOLARSHIPS);

      let filtered = result.data;
      if (appSearch) {
        const searchLower = appSearch.toLowerCase();
        filtered = filtered.filter((app) => {
          const stud = storedStudents.find((s) => s.id === app.studentId);
          return (
            stud?.user?.firstName?.toLowerCase().includes(searchLower) ||
            stud?.user?.lastName?.toLowerCase().includes(searchLower) ||
            stud?.enrollmentNo?.toLowerCase().includes(searchLower)
          );
        });
      }

      const hydrated = filtered.map((app) => {
        const stud = storedStudents.find((s) => s.id === app.studentId);
        const schol = storedScholarships.find((s) => s.id === app.scholarshipId);
        return {
          ...app,
          student: stud
            ? {
                user: { firstName: stud.user.firstName, lastName: stud.user.lastName },
                enrollmentNo: stud.enrollmentNo,
              }
            : undefined,
          scholarship: schol ? { name: schol.name, amount: schol.amount } : undefined,
        };
      });

      setApplications(hydrated);
      setAppTotal(result.pagination.total);
    } catch {
      setToast({ message: 'Failed to retrieve applications.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [appPage, appLimit, appSearch, appSortBy, appSortOrder]);

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    if (activeTab === 'catalog') {
      fetchCatalog();
    } else {
      fetchApplications();
    }
  }, [activeTab, fetchCatalog, fetchApplications]);

  // Set default application dropdowns
  useEffect(() => {
    if (students.length > 0 && !applyForm.studentId) {
      setApplyForm((prev) => ({ ...prev, studentId: students[0].id }));
    }
    if (scholarshipsAll.length > 0 && !applyForm.scholarshipId) {
      setApplyForm((prev) => ({ ...prev, scholarshipId: scholarshipsAll[0].id }));
    }
  }, [students, scholarshipsAll]);

  // CRUD Catalog
  const handleAddCat = () => {
    setEditCat(null);
    setCatForm({
      name: '',
      amount: 15000,
      description: '',
    });
    setShowCatModal(true);
  };

  const handleEditCat = (item: Scholarship) => {
    setEditCat(item);
    setCatForm({
      name: item.name,
      amount: item.amount,
      description: item.description || '',
    });
    setShowCatModal(true);
  };

  const handleDeleteCat = (item: Scholarship) => {
    if (!confirm(`Are you sure you want to delete ${item.name}?`)) return;
    deleteMockItem('mock_scholarships', DEFAULT_SCHOLARSHIPS, item.id);
    setToast({ message: 'Scholarship program deleted!', type: 'success' });
    fetchCatalog();
  };

  const handleCatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...catForm,
      amount: Number(catForm.amount),
    };
    saveMockItem('mock_scholarships', DEFAULT_SCHOLARSHIPS, {
      ...(editCat ? { id: editCat.id } : {}),
      ...payload,
    });
    setToast({ message: editCat ? 'Scholarship category updated!' : 'Scholarship program created!', type: 'success' });
    setShowCatModal(false);
    fetchCatalog();
  };

  // Application actions
  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newApp = {
        studentId: applyForm.studentId,
        scholarshipId: applyForm.scholarshipId,
        applyDate: new Date().toISOString().split('T')[0],
        status: 'PENDING' as const,
        paymentStatus: 'PENDING' as const,
      };

      saveMockItem('mock_scholarship_applications', DEFAULT_SCHOLARSHIP_APPLICATIONS, newApp);
      setToast({ message: 'Scholarship application submitted successfully!', type: 'success' });
      setShowApplyModal(false);
      fetchApplications();
    } catch {
      setToast({ message: 'Failed to apply scholarship.', type: 'error' });
    }
  };

  const handleReview = (id: string, action: 'APPROVED' | 'REJECTED') => {
    try {
      const stored = getStorageData<ScholarshipApplication>('mock_scholarship_applications', DEFAULT_SCHOLARSHIP_APPLICATIONS);
      const index = stored.findIndex((a) => a.id === id);
      if (index !== -1) {
        stored[index].status = action;
        saveStorageData('mock_scholarship_applications', stored);
        setToast({ message: `Application ${action.toLowerCase()} successfully!`, type: 'success' });
        fetchApplications();
      }
    } catch {
      setToast({ message: 'Failed to update application review.', type: 'error' });
    }
  };

  const handleDisburse = (id: string) => {
    try {
      const stored = getStorageData<ScholarshipApplication>('mock_scholarship_applications', DEFAULT_SCHOLARSHIP_APPLICATIONS);
      const index = stored.findIndex((a) => a.id === id);
      if (index !== -1) {
        stored[index].paymentStatus = 'DISBURSED';
        saveStorageData('mock_scholarship_applications', stored);
        setToast({ message: `Scholarship payment disbursed successfully!`, type: 'success' });
        fetchApplications();
      }
    } catch {
      setToast({ message: 'Failed to disburse scholarship.', type: 'error' });
    }
  };

  const catColumns = [
    { key: 'name', title: 'Scholarship Scheme', sortable: true },
    { key: 'amount', title: 'Award Amount', render: (val: number) => `₹ ${val.toLocaleString()}`, sortable: true },
    { key: 'description', title: 'Eligibility Criteria Details' },
  ];

  const appColumns = [
    {
      key: 'student',
      title: 'Student & USN',
      render: (_: any, row: ScholarshipApplication) =>
        row.student ? (
          <div>
            <p className="font-semibold text-slate-900 dark:text-white leading-tight">
              {row.student.user.firstName} {row.student.user.lastName}
            </p>
            <p className="text-xs text-slate-500 font-semibold">{row.student.enrollmentNo}</p>
          </div>
        ) : (
          <span className="text-slate-400 text-xs">Unknown Student</span>
        ),
    },
    { key: 'scholarship', title: 'Applied Program', render: (_: any, row: ScholarshipApplication) => row.scholarship?.name || 'N/A' },
    { key: 'applyDate', title: 'Date Applied', sortable: true },
    {
      key: 'status',
      title: 'Approval Status',
      render: (value: 'PENDING' | 'APPROVED' | 'REJECTED', row: ScholarshipApplication) => (
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              value === 'APPROVED'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450'
                : value === 'REJECTED'
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-955/20 dark:text-amber-400'
            }`}
          >
            {value}
          </span>
          {value === 'PENDING' && (
            <div className="flex gap-1">
              <button
                onClick={() => handleReview(row.id, 'APPROVED')}
                className="p-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                title="Approve"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleReview(row.id, 'REJECTED')}
                className="p-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                title="Reject"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'paymentStatus',
      title: 'Disbursement Status',
      render: (value: 'PENDING' | 'DISBURSED', row: ScholarshipApplication) => (
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              value === 'DISBURSED'
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
            }`}
          >
            {value}
          </span>
          {row.status === 'APPROVED' && value === 'PENDING' && (
            <button
              onClick={() => handleDisburse(row.id)}
              className="px-2 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700"
            >
              Disburse
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div>
        <Breadcrumbs items={[{ label: 'Finance', href: '#' }, { label: 'Scholarships' }]} />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md flex-shrink-0">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Student Scholarships</h1>
            <p className="text-sm text-slate-500">Configure financial aid categories and audit disbursement claims</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'catalog'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-850'
          }`}
        >
          Scholarship Programs
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'applications'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-850'
          }`}
        >
          Applications & Approvals
        </button>
      </div>

      {activeTab === 'catalog' ? (
        <DataTable
          title="Scholarship Programs Catalog"
          columns={catColumns}
          data={scholarships}
          totalItems={catTotal}
          page={catPage}
          limit={catLimit}
          isLoading={isLoading}
          onPageChange={setCatPage}
          onLimitChange={(l) => { setCatPage(1); setCatLimit(l); }}
          onSearch={(s) => { setCatSearch(s); setCatPage(1); }}
          onSort={(by, order) => { setCatSortBy(by); setCatSortOrder(order); }}
          onAdd={handleAddCat}
          onEdit={handleEditCat}
          onDelete={handleDeleteCat}
          addLabel="Add Program"
          searchPlaceholder="Search catalog..."
        />
      ) : (
        <DataTable
          title="Student Applications claims"
          columns={appColumns}
          data={applications}
          totalItems={appTotal}
          page={appPage}
          limit={appLimit}
          isLoading={isLoading}
          onPageChange={setAppPage}
          onLimitChange={(l) => { setAppPage(1); setAppLimit(l); }}
          onSearch={(s) => { setAppSearch(s); setAppPage(1); }}
          onSort={(by, order) => { setAppSortBy(by); setAppSortOrder(order); }}
          onAdd={() => setShowApplyModal(true)}
          addLabel="Apply Student"
          searchPlaceholder="Search by student name or USN..."
        />
      )}

      {/* Catalog Add/Edit Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCatModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {editCat ? 'Edit Scholarship Program' : 'Create Scholarship Program'}
              </h3>
              <button onClick={() => setShowCatModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCatSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Scholarship Title *</label>
                <input value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} required placeholder="e.g. Merit-cum-Means Grant" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Award Amount (₹) *</label>
                <input type="number" min={1} value={catForm.amount} onChange={(e) => setCatForm({ ...catForm, amount: Number(e.target.value) })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Eligibility Criteria Description</label>
                <textarea rows={3} value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowCatModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  {editCat ? 'Update Program' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowApplyModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Apply Student for Scholarship</h3>
              <button onClick={() => setShowApplyModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleApplySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Select Student *</label>
                <select
                  value={applyForm.studentId}
                  onChange={(e) => setApplyForm({ ...applyForm, studentId: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="" disabled>Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.user?.firstName} {student.user?.lastName} ({student.enrollmentNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Select Program *</label>
                <select
                  value={applyForm.scholarshipId}
                  onChange={(e) => setApplyForm({ ...applyForm, scholarshipId: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="" disabled>Select Scholarship Scheme</option>
                  {scholarshipsAll.map((schol) => (
                    <option key={schol.id} value={schol.id}>
                      {schol.name} (₹ {schol.amount.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowApplyModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-350 dark:hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
