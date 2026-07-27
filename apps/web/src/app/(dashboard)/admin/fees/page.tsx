'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import { getMockCollection, saveMockItem, deleteMockItem, getStorageData, saveStorageData, DEFAULT_FEE_STRUCTURES, DEFAULT_FEE_COLLECTIONS, DEFAULT_STUDENTS, DEFAULT_COURSES } from '@/lib/mockDb';
import { CreditCard, X, Eye, FileText, Download, Loader2 } from 'lucide-react';

interface FeeStructure {
  id: string;
  name: string;
  courseId: string;
  semesterNumber: number;
  amount: number;
  description: string;
  course?: { name: string };
}

interface FeeCollection {
  id: string;
  studentId: string;
  feeStructureId: string;
  amountPaid: number;
  balance: number;
  paymentMethod: string;
  date: string;
  transactionId: string;
  student?: { user: { firstName: string; lastName: string }; enrollmentNo: string };
  feeStructure?: { name: string; amount: number };
}

export default function FeesPage() {
  const [activeTab, setActiveTab] = useState<'structure' | 'collection' | 'collect' | 'pending'>('structure');

  // Datatable Lists
  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [collections, setCollections] = useState<FeeCollection[]>([]);
  const [pendingFees, setPendingFees] = useState<any[]>([]);

  // Page loading & paging states
  const [isLoading, setIsLoading] = useState(true);
  const [structTotal, setStructTotal] = useState(0);
  const [structPage, setStructPage] = useState(1);
  const [structLimit, setStructLimit] = useState(10);
  const [structSearch, setStructSearch] = useState('');

  const [colTotal, setColTotal] = useState(0);
  const [colPage, setColPage] = useState(1);
  const [colLimit, setColLimit] = useState(10);
  const [colSearch, setColSearch] = useState('');

  // Sorting states
  const [structSortBy, setStructSortBy] = useState('name');
  const [structSortOrder, setStructSortOrder] = useState<'asc' | 'desc'>('asc');
  const [colSortBy, setColSortBy] = useState('date');
  const [colSortOrder, setColSortOrder] = useState<'asc' | 'desc'>('desc');

  // Dropdown metadata
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [structuresAll, setStructuresAll] = useState<any[]>([]);

  // Modals & Banners
  const [showStructModal, setShowStructModal] = useState(false);
  const [editStruct, setEditStruct] = useState<FeeStructure | null>(null);
  const [showReceipt, setShowReceipt] = useState<FeeCollection | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Form States
  const [structForm, setStructForm] = useState({
    name: '',
    courseId: '',
    semesterNumber: 1,
    amount: 50000,
    description: '',
  });

  const [collectForm, setCollectForm] = useState({
    studentId: '',
    feeStructureId: '',
    amountPaid: 20000,
    paymentMethod: 'UPI',
    transactionId: '',
  });

  const fetchMetadata = async () => {
    try {
      const [studRes, courseRes]: any = await Promise.all([
        api.get('/students'),
        api.get('/courses'),
      ]);
      setStudents(studRes.data || studRes || []);
      setCourses(courseRes.data || courseRes || []);
    } catch {
      setStudents(getStorageData('mock_students', DEFAULT_STUDENTS));
      setCourses(getStorageData('mock_courses', DEFAULT_COURSES));
    }
  };

  const fetchStructures = useCallback(() => {
    setIsLoading(true);
    try {
      const result = getMockCollection<FeeStructure>('mock_fee_structures', DEFAULT_FEE_STRUCTURES, {
        page: structPage,
        limit: structLimit,
        search: structSearch,
        sortBy: structSortBy,
        sortOrder: structSortOrder,
        searchFields: ['name', 'description'],
      });

      const storedCourses = getStorageData('mock_courses', DEFAULT_COURSES);
      const hydrated = result.data.map((struct) => {
        const course = storedCourses.find((c) => c.id === struct.courseId);
        return {
          ...struct,
          course: course ? { name: course.name } : undefined,
        };
      });

      setStructures(hydrated);
      setStructuresAll(getStorageData('mock_fee_structures', DEFAULT_FEE_STRUCTURES));
      setStructTotal(result.pagination.total);
    } catch {
      setToast({ message: 'Failed to retrieve fee structures.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [structPage, structLimit, structSearch, structSortBy, structSortOrder]);

  const fetchCollections = useCallback(() => {
    setIsLoading(true);
    try {
      const result = getMockCollection<FeeCollection>('mock_fee_collections', DEFAULT_FEE_COLLECTIONS, {
        page: colPage,
        limit: colLimit,
        search: colSearch,
        sortBy: colSortBy,
        sortOrder: colSortOrder,
        searchFields: ['paymentMethod', 'transactionId'],
      });

      const storedStudents = getStorageData('mock_students', DEFAULT_STUDENTS);
      const storedStructures = getStorageData('mock_fee_structures', DEFAULT_FEE_STRUCTURES);

      let filtered = result.data;
      if (colSearch) {
        const searchLower = colSearch.toLowerCase();
        filtered = filtered.filter((col) => {
          const stud = storedStudents.find((s) => s.id === col.studentId);
          return (
            stud?.user?.firstName?.toLowerCase().includes(searchLower) ||
            stud?.user?.lastName?.toLowerCase().includes(searchLower) ||
            stud?.enrollmentNo?.toLowerCase().includes(searchLower)
          );
        });
      }

      const hydrated = filtered.map((col) => {
        const stud = storedStudents.find((s) => s.id === col.studentId);
        const struct = storedStructures.find((s) => s.id === col.feeStructureId);
        return {
          ...col,
          student: stud
            ? {
                user: { firstName: stud.user.firstName, lastName: stud.user.lastName },
                enrollmentNo: stud.enrollmentNo,
              }
            : undefined,
          feeStructure: struct ? { name: struct.name, amount: struct.amount } : undefined,
        };
      });

      setCollections(hydrated);
      setColTotal(result.pagination.total);
    } catch {
      setToast({ message: 'Failed to retrieve payment collections.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [colPage, colLimit, colSearch, colSortBy, colSortOrder]);

  const buildPendingFees = useCallback(() => {
    const storedStudents = getStorageData('mock_students', DEFAULT_STUDENTS);
    const storedStructures = getStorageData('mock_fee_structures', DEFAULT_FEE_STRUCTURES);
    const storedPayments = getStorageData('mock_fee_collections', DEFAULT_FEE_COLLECTIONS);

    // Compute outstanding balance per student
    const pendingList: any[] = [];

    storedStudents.forEach((student) => {
      // Find matching fee structures for the student's Course
      const courseFees = storedStructures.filter((f) => f.courseId === student.courseId);
      let totalAssignedFee = 0;
      courseFees.forEach((cf) => (totalAssignedFee += cf.amount));

      // Calculate total payments made by student
      let totalPaid = 0;
      const studentPayments = storedPayments.filter((p) => p.studentId === student.id);
      studentPayments.forEach((sp) => (totalPaid += sp.amountPaid));

      const balance = totalAssignedFee - totalPaid;
      if (balance > 0) {
        pendingList.push({
          id: student.id,
          name: `${student.user.firstName} ${student.user.lastName}`,
          enrollmentNo: student.enrollmentNo,
          totalAssigned: totalAssignedFee,
          totalPaid,
          balance,
        });
      }
    });

    setPendingFees(pendingList);
  }, []);

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    if (activeTab === 'structure') {
      fetchStructures();
    } else if (activeTab === 'collection') {
      fetchCollections();
    } else if (activeTab === 'pending') {
      buildPendingFees();
    }
  }, [activeTab, fetchStructures, fetchCollections, buildPendingFees]);

  // Set default collect choices
  useEffect(() => {
    if (students.length > 0 && !collectForm.studentId) {
      setCollectForm((prev) => ({ ...prev, studentId: students[0].id }));
    }
    if (structuresAll.length > 0 && !collectForm.feeStructureId) {
      setCollectForm((prev) => ({ ...prev, feeStructureId: structuresAll[0].id }));
    }
  }, [students, structuresAll]);

  // CRUD structure handlers
  const handleAddStruct = () => {
    setEditStruct(null);
    setStructForm({
      name: '',
      courseId: courses[0]?.id || '',
      semesterNumber: 1,
      amount: 50000,
      description: '',
    });
    setShowStructModal(true);
  };

  const handleEditStruct = (item: FeeStructure) => {
    setEditStruct(item);
    setStructForm({
      name: item.name,
      courseId: item.courseId,
      semesterNumber: item.semesterNumber,
      amount: item.amount,
      description: item.description || '',
    });
    setShowStructModal(true);
  };

  const handleDeleteStruct = (item: FeeStructure) => {
    if (!confirm(`Are you sure you want to delete ${item.name}?`)) return;
    deleteMockItem('mock_fee_structures', DEFAULT_FEE_STRUCTURES, item.id);
    setToast({ message: 'Fee structure item deleted!', type: 'success' });
    fetchStructures();
  };

  const handleStructSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...structForm,
      amount: Number(structForm.amount),
      semesterNumber: Number(structForm.semesterNumber),
    };
    saveMockItem('mock_fee_structures', DEFAULT_FEE_STRUCTURES, {
      ...(editStruct ? { id: editStruct.id } : {}),
      ...payload,
    });
    setToast({ message: editStruct ? 'Fee structure updated!' : 'Fee structure added!', type: 'success' });
    setShowStructModal(false);
    fetchStructures();
  };

  // Collect Payment handler
  const handleCollectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const storedStructures = getStorageData('mock_fee_structures', DEFAULT_FEE_STRUCTURES);
      const matched = storedStructures.find((s) => s.id === collectForm.feeStructureId);
      const totalCost = matched ? matched.amount : 50000;

      // Find total past paid
      const storedPayments = getStorageData('mock_fee_collections', DEFAULT_FEE_COLLECTIONS);
      let pastPaid = 0;
      storedPayments
        .filter((p) => p.studentId === collectForm.studentId && p.feeStructureId === collectForm.feeStructureId)
        .forEach((sp) => (pastPaid += sp.amountPaid));

      const updatedPaid = pastPaid + Number(collectForm.amountPaid);
      const balance = Math.max(0, totalCost - updatedPaid);

      const txnId = collectForm.transactionId || 'TXN' + Math.floor(Math.random() * 900000 + 100000);

      const newPayment = {
        studentId: collectForm.studentId,
        feeStructureId: collectForm.feeStructureId,
        amountPaid: Number(collectForm.amountPaid),
        balance,
        paymentMethod: collectForm.paymentMethod,
        date: new Date().toISOString().split('T')[0],
        transactionId: txnId,
      };

      saveMockItem('mock_fee_collections', DEFAULT_FEE_COLLECTIONS, newPayment);
      setToast({ message: 'Fee collection payment recorded successfully!', type: 'success' });

      // Reset
      setCollectForm({
        studentId: students[0]?.id || '',
        feeStructureId: structuresAll[0]?.id || '',
        amountPaid: 20000,
        paymentMethod: 'UPI',
        transactionId: '',
      });

      setActiveTab('collection');
    } catch {
      setToast({ message: 'Failed to record payment.', type: 'error' });
    }
  };

  // Receipt Download simulator
  const handleDownloadReceipt = (item: FeeCollection) => {
    setDownloadingId(item.id);
    setTimeout(() => {
      setDownloadingId(null);
      setToast({
        message: `Receipt for transaction ${item.transactionId} downloaded successfully!`,
        type: 'success',
      });
    }, 1500);
  };

  const structColumns = [
    { key: 'name', title: 'Fee Structure Item', sortable: true },
    { key: 'course', title: 'Course', render: (_: any, row: FeeStructure) => row.course?.name || 'N/A' },
    { key: 'semesterNumber', title: 'Semester', render: (val: number) => `Semester ${val}` },
    { key: 'amount', title: 'Amount', render: (val: number) => `₹ ${val.toLocaleString()}`, sortable: true },
  ];

  const colColumns = [
    {
      key: 'student',
      title: 'Student Name',
      render: (_: any, row: FeeCollection) =>
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
    { key: 'feeStructure', title: 'Fee Item', render: (_: any, row: FeeCollection) => row.feeStructure?.name || 'N/A' },
    { key: 'amountPaid', title: 'Paid Amount', render: (val: number) => `₹ ${val.toLocaleString()}` },
    { key: 'balance', title: 'Outstanding Balance', render: (val: number) => `₹ ${val.toLocaleString()}` },
    { key: 'date', title: 'Date Collected', sortable: true },
  ];

  return (
    <div className="space-y-6">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div>
        <Breadcrumbs items={[{ label: 'Finance', href: '#' }, { label: 'Fees' }]} />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md flex-shrink-0">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Fee Ledger Management</h1>
            <p className="text-sm text-slate-500">Configure fee terms, balances, and track collection statements</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('structure')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'structure'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-850'
          }`}
        >
          Fee Structure Config
        </button>
        <button
          onClick={() => setActiveTab('collection')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'collection'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-850'
          }`}
        >
          Payments Audit History
        </button>
        <button
          onClick={() => setActiveTab('collect')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'collect'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-850'
          }`}
        >
          Collect Fee Payment
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'pending'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-850'
          }`}
        >
          Outstanding Balance Due
        </button>
      </div>

      {activeTab === 'structure' && (
        <DataTable
          title="Fee Structures configured"
          columns={structColumns}
          data={structures}
          totalItems={structTotal}
          page={structPage}
          limit={structLimit}
          isLoading={isLoading}
          onPageChange={setStructPage}
          onLimitChange={(l) => { setStructPage(1); setStructLimit(l); }}
          onSearch={(s) => { setStructSearch(s); setStructPage(1); }}
          onSort={(by, order) => { setStructSortBy(by); setStructSortOrder(order); }}
          onAdd={handleAddStruct}
          onEdit={handleEditStruct}
          onDelete={handleDeleteStruct}
          addLabel="Add Fee Category"
          searchPlaceholder="Search structures..."
        />
      )}

      {activeTab === 'collection' && (
        <DataTable
          title="Collections Registry"
          columns={colColumns}
          data={collections}
          totalItems={colTotal}
          page={colPage}
          limit={colLimit}
          isLoading={isLoading}
          onPageChange={setColPage}
          onLimitChange={(l) => { setColPage(1); setColLimit(l); }}
          onSearch={(s) => { setColSearch(s); setColPage(1); }}
          onSort={(by, order) => { setColSortBy(by); setColSortOrder(order); }}
          onView={(row) => setShowReceipt(row)}
          searchPlaceholder="Search by student name or transaction..."
        />
      )}

      {activeTab === 'collect' && (
        <div className="max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Record Fee Collection Payment</h3>
          <form onSubmit={handleCollectSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Student *</label>
              <select
                value={collectForm.studentId}
                onChange={(e) => setCollectForm({ ...collectForm, studentId: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
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
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Fee Structure Category *</label>
              <select
                value={collectForm.feeStructureId}
                onChange={(e) => setCollectForm({ ...collectForm, feeStructureId: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="" disabled>Select Fee Structure Category</option>
                {structuresAll.map((struct) => (
                  <option key={struct.id} value={struct.id}>
                    {struct.name} - ₹ {struct.amount.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Amount Paid (₹) *</label>
                <input
                  type="number"
                  min={1}
                  value={collectForm.amountPaid}
                  onChange={(e) => setCollectForm({ ...collectForm, amountPaid: Number(e.target.value) })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Payment Method</label>
                <select
                  value={collectForm.paymentMethod}
                  onChange={(e) => setCollectForm({ ...collectForm, paymentMethod: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="UPI">UPI / QR Scan</option>
                  <option value="CASH">Cash Payment</option>
                  <option value="CARD">Debit / Credit Card</option>
                  <option value="NETBANKING">NetBanking Transfer</option>
                  <option value="CHEQUE">Bank Cheque</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Transaction ID (Optional)</label>
              <input
                value={collectForm.transactionId}
                onChange={(e) => setCollectForm({ ...collectForm, transactionId: e.target.value })}
                placeholder="Leave blank to auto-generate receipt code"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-95 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              Post Payment Receipt
            </button>
          </form>
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Outstanding Balances Ledger</h3>
            <p className="text-xs text-slate-500">Students with unpaid academic fee dues</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Student Name</th>
                  <th className="px-6 py-3.5">USN</th>
                  <th className="px-6 py-3.5">Total Assigned Fee</th>
                  <th className="px-6 py-3.5">Total Paid</th>
                  <th className="px-6 py-3.5">Pending Due Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {pendingFees.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No outstanding balances found. All accounts fully paid!
                    </td>
                  </tr>
                ) : (
                  pendingFees.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{p.name}</td>
                      <td className="px-6 py-4 font-mono text-xs">{p.enrollmentNo}</td>
                      <td className="px-6 py-4">₹ {p.totalAssigned.toLocaleString()}</td>
                      <td className="px-6 py-4 text-emerald-600 dark:text-emerald-450">₹ {p.totalPaid.toLocaleString()}</td>
                      <td className="px-6 py-4 text-red-600 dark:text-red-450 font-bold">₹ {p.balance.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Structure Add/Edit Modal */}
      {showStructModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowStructModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {editStruct ? 'Edit Fee Category' : 'Create Fee Structure'}
              </h3>
              <button onClick={() => setShowStructModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleStructSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Structure Item Name *</label>
                <input value={structForm.name} onChange={(e) => setStructForm({ ...structForm, name: e.target.value })} required placeholder="e.g. Tuition Fee B.Tech CSE" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Course *</label>
                  <select value={structForm.courseId} onChange={(e) => setStructForm({ ...structForm, courseId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="" disabled>Select Course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Semester Term *</label>
                  <input type="number" min={1} max={12} value={structForm.semesterNumber} onChange={(e) => setStructForm({ ...structForm, semesterNumber: Number(e.target.value) })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Amount (₹) *</label>
                <input type="number" min={1} value={structForm.amount} onChange={(e) => setStructForm({ ...structForm, amount: Number(e.target.value) })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Description</label>
                <textarea rows={2} value={structForm.description} onChange={(e) => setStructForm({ ...structForm, description: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowStructModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  {editStruct ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Collection Payment Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowReceipt(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Fee Payment Receipt</h3>
              <button onClick={() => setShowReceipt(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">CollegePES ERP</h4>
                  <p className="text-xs text-slate-500">Finance & Accounts division</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Receipt Code</p>
                  <p className="font-mono text-xs font-bold text-indigo-650 dark:text-indigo-400">{showReceipt.transactionId}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Student Name</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {showReceipt.student ? `${showReceipt.student.user.firstName} ${showReceipt.student.user.lastName}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">USN / Enrollment</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{showReceipt.student?.enrollmentNo || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Fee Category</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{showReceipt.feeStructure?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Payment Date</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{showReceipt.date}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Method</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{showReceipt.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Amount Paid</p>
                  <p className="font-bold text-emerald-650 dark:text-emerald-450 mt-0.5">₹ {showReceipt.amountPaid.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Due Balance</p>
                  <p className="font-bold text-red-600 dark:text-red-450 mt-0.5">₹ {showReceipt.balance.toLocaleString()}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex gap-2 justify-end">
                <button
                  onClick={() => handleDownloadReceipt(showReceipt)}
                  disabled={downloadingId !== null}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 text-indigo-750 text-xs font-bold rounded-xl dark:bg-indigo-950/20 dark:border-indigo-900/50 dark:text-indigo-400"
                >
                  {downloadingId === showReceipt.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" /> Download Receipt PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
