'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import { getMockCollection, saveMockItem, deleteMockItem, getStorageData, DEFAULT_RESULTS, DEFAULT_STUDENTS, DEFAULT_EXAMS, DEFAULT_SUBJECTS } from '@/lib/mockDb';
import { Award, X, Eye, FileText, Download, Loader2 } from 'lucide-react';

interface ResultRecord {
  id: string;
  studentId: string;
  examId: string;
  subjectId: string;
  marksObtained: number;
  totalMarks: number;
  sgpa: number;
  cgpa: number;
  isPublished?: boolean;
  student?: { user: { firstName: string; lastName: string }; enrollmentNo: string };
  exam?: { name: string };
  subject?: { name: string; code: string; credits: number };
  createdAt?: string;
}

// Map score to Grade Points
function calculateGradePoints(percentage: number): { grade: string; points: number } {
  if (percentage >= 90) return { grade: 'O (Outstanding)', points: 10 };
  if (percentage >= 80) return { grade: 'A+ (Excellent)', points: 9 };
  if (percentage >= 70) return { grade: 'A (Very Good)', points: 8 };
  if (percentage >= 60) return { grade: 'B+ (Good)', points: 7 };
  if (percentage >= 50) return { grade: 'B (Above Average)', points: 6 };
  if (percentage >= 40) return { grade: 'C (Pass)', points: 5 };
  return { grade: 'F (Fail)', points: 0 };
}

export default function ResultsPage() {
  const [data, setData] = useState<ResultRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  // Dropdown Metadata State
  const [students, setStudents] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  // Modal and Toast State
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState<ResultRecord | null>(null);
  const [editItem, setEditItem] = useState<ResultRecord | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Download state
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    studentId: '',
    examId: '',
    subjectId: '',
    marksObtained: 80,
    totalMarks: 100,
    isPublished: true,
  });

  const fetchMetadata = async () => {
    try {
      const [studRes, examRes, subRes]: any = await Promise.all([
        api.get('/students'),
        api.get('/exams'),
        api.get('/subjects'),
      ]);
      setStudents(studRes.data || studRes || []);
      setExams(examRes.data || examRes || []);
      setSubjects(subRes.data || subRes || []);
    } catch {
      setStudents(getStorageData('mock_students', DEFAULT_STUDENTS));
      setExams(getStorageData('mock_exams', DEFAULT_EXAMS));
      setSubjects(getStorageData('mock_subjects', DEFAULT_SUBJECTS));
    }
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/results', { page, limit, search, sortBy, sortOrder });
      setData(response.data || []);
      setTotal(response.pagination?.total || 0);
    } catch {
      // Fallback local storage mock DB
      const result = getMockCollection<ResultRecord>('mock_results', DEFAULT_RESULTS, {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        searchFields: ['marksObtained', 'totalMarks'],
      });

      // Hydrate relations manually
      const storedStudents = getStorageData('mock_students', DEFAULT_STUDENTS);
      const storedExams = getStorageData('mock_exams', DEFAULT_EXAMS);
      const storedSubjects = getStorageData('mock_subjects', DEFAULT_SUBJECTS);

      let filtered = result.data;
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter((res) => {
          const stud = storedStudents.find((s) => s.id === res.studentId);
          return (
            stud?.user?.firstName?.toLowerCase().includes(searchLower) ||
            stud?.user?.lastName?.toLowerCase().includes(searchLower) ||
            stud?.enrollmentNo?.toLowerCase().includes(searchLower)
          );
        });
      }

      const hydrated = filtered.map((res) => {
        const stud = storedStudents.find((s) => s.id === res.studentId);
        const ex = storedExams.find((e) => e.id === res.examId);
        const sub = storedSubjects.find((s) => s.id === res.subjectId);
        return {
          ...res,
          student: stud
            ? {
                user: { firstName: stud.user.firstName, lastName: stud.user.lastName },
                enrollmentNo: stud.enrollmentNo,
              }
            : undefined,
          exam: ex ? { name: ex.name } : undefined,
          subject: sub ? { name: sub.name, code: sub.code, credits: sub.credits } : undefined,
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
      studentId: students[0]?.id || '',
      examId: exams[0]?.id || '',
      subjectId: subjects[0]?.id || '',
      marksObtained: 80,
      totalMarks: 100,
      isPublished: true,
    });
    setShowModal(true);
  };

  const handleEdit = (item: ResultRecord) => {
    setEditItem(item);
    setViewItem(null);
    setFormData({
      studentId: item.studentId,
      examId: item.examId,
      subjectId: item.subjectId,
      marksObtained: item.marksObtained,
      totalMarks: item.totalMarks,
      isPublished: item.isPublished !== undefined ? item.isPublished : true,
    });
    setShowModal(true);
  };

  const handleView = (item: ResultRecord) => {
    const storedStudents = getStorageData('mock_students', DEFAULT_STUDENTS);
    const storedExams = getStorageData('mock_exams', DEFAULT_EXAMS);
    const storedSubjects = getStorageData('mock_subjects', DEFAULT_SUBJECTS);

    setViewItem({
      ...item,
      student: storedStudents.find((s) => s.id === item.studentId) || item.student,
      exam: storedExams.find((e) => e.id === item.examId) || item.exam,
      subject: storedSubjects.find((s) => s.id === item.subjectId) || item.subject,
    });
  };

  const handleDelete = async (item: ResultRecord) => {
    if (!confirm('Are you sure you want to delete this result?')) return;
    try {
      await api.delete(`/results/${item.id}`);
      setToast({ message: 'Result deleted successfully!', type: 'success' });
      fetchData();
    } catch {
      deleteMockItem('mock_results', DEFAULT_RESULTS, item.id);
      setToast({ message: 'Result deleted from mock storage!', type: 'success' });
      fetchData();
    }
  };

  const handleTogglePublish = (item: ResultRecord) => {
    try {
      const stored = getStorageData<ResultRecord>('mock_results', DEFAULT_RESULTS);
      const idx = stored.findIndex((x) => x.id === item.id);
      if (idx !== -1) {
        stored[idx].isPublished = !stored[idx].isPublished;
        saveMockItem('mock_results', DEFAULT_RESULTS, stored[idx]);
        setToast({
          message: stored[idx].isPublished ? 'Result marks published!' : 'Result marks set to draft.',
          type: 'success',
        });
        fetchData();
      }
    } catch {
      setToast({ message: 'Failed to update publication status.', type: 'error' });
    }
  };

  const handleDownload = (item: ResultRecord) => {
    setDownloadingId(item.id);
    setTimeout(() => {
      setDownloadingId(null);
      setToast({
        message: `Marksheet for student ${item.student?.user.firstName} downloaded successfully!`,
        type: 'success',
      });
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Auto calculate GPA based on inputs
    const percentage = (formData.marksObtained / formData.totalMarks) * 100;
    const { points } = calculateGradePoints(percentage);

    // Calculate SGPA (simulate matching credits)
    const computedSgpa = Number((points * 0.95).toFixed(2));
    const computedCgpa = Number((points * 0.93).toFixed(2));

    const payload = {
      ...formData,
      marksObtained: Number(formData.marksObtained),
      totalMarks: Number(formData.totalMarks),
      sgpa: computedSgpa,
      cgpa: computedCgpa,
    };

    try {
      if (editItem) {
        await api.put(`/results/${editItem.id}`, payload);
        setToast({ message: 'Marks updated successfully!', type: 'success' });
      } else {
        await api.post('/results', payload);
        setToast({ message: 'Marks uploaded successfully!', type: 'success' });
      }
      setShowModal(false);
      fetchData();
    } catch {
      saveMockItem('mock_results', DEFAULT_RESULTS, {
        ...(editItem ? { id: editItem.id } : {}),
        ...payload,
      });
      setToast({
        message: editItem ? 'Marks updated in mock storage!' : 'Marks uploaded in mock storage!',
        type: 'success',
      });
      setShowModal(false);
      fetchData();
    }
  };

  const columns = [
    {
      key: 'student',
      title: 'Student Name',
      sortable: true,
      render: (_: any, row: ResultRecord) =>
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
    {
      key: 'exam',
      title: 'Exam',
      render: (_: any, row: ResultRecord) => row.exam?.name || 'N/A',
    },
    {
      key: 'subject',
      title: 'Subject Code',
      render: (_: any, row: ResultRecord) => row.subject?.code || 'N/A',
    },
    {
      key: 'marksObtained',
      title: 'Marks',
      sortable: true,
      render: (value: number, row: ResultRecord) => {
        const percentage = (value / row.totalMarks) * 100;
        const { grade } = calculateGradePoints(percentage);
        return (
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-200">
              {value} / {row.totalMarks}
            </p>
            <p className="text-[10px] text-slate-450 font-medium">{grade.split(' ')[0]} Grade</p>
          </div>
        );
      },
    },
    {
      key: 'sgpa',
      title: 'GPA (SGPA / CGPA)',
      render: (_: any, row: ResultRecord) => (
        <span className="font-bold text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-1 rounded-lg text-xs">
          {row.sgpa} / {row.cgpa}
        </span>
      ),
    },
    {
      key: 'isPublished',
      title: 'Publication',
      render: (value: boolean, row: ResultRecord) => {
        const isPub = value !== undefined ? value : true;
        return (
          <button
            onClick={() => handleTogglePublish(row)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              isPub
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-655 dark:bg-slate-800'
            }`}
          >
            {isPub ? 'Published' : 'Draft / Publish'}
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div>
        <Breadcrumbs items={[{ label: 'Academics', href: '#' }, { label: 'Results' }]} />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md flex-shrink-0">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Results & Grading</h1>
            <p className="text-sm text-slate-500">Record marks, compute grades, and publish student marksheets</p>
          </div>
        </div>
      </div>

      <DataTable
        title="Students Examination Results"
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
        addLabel="Upload Marks"
        searchPlaceholder="Search results by student name..."
      />

      {/* View Details Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Academic Marksheet Profile</h3>
              <button onClick={() => setViewItem(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {viewItem.student?.user.firstName?.[0]}
                  {viewItem.student?.user.lastName?.[0]}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {viewItem.student?.user.firstName} {viewItem.student?.user.lastName}
                  </h4>
                  <p className="text-sm text-indigo-650 dark:text-indigo-400 font-semibold mt-1">USN: {viewItem.student?.enrollmentNo}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Evaluation Exam</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.exam?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Subject Course</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {viewItem.subject ? `${viewItem.subject.name} (${viewItem.subject.code})` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Marks Obtained</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {viewItem.marksObtained} / {viewItem.totalMarks}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Grade Equivalence</p>
                  <p className="font-semibold text-emerald-650 dark:text-emerald-400 mt-0.5">
                    {calculateGradePoints((viewItem.marksObtained / viewItem.totalMarks) * 100).grade}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">SGPA Semester GPA</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.sgpa}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">CGPA Cumulative GPA</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{viewItem.cgpa}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex gap-2 justify-end">
                <button
                  onClick={() => handleDownload(viewItem)}
                  disabled={downloadingId !== null}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 text-indigo-750 text-xs font-bold rounded-xl dark:bg-indigo-950/20 dark:border-indigo-900/50 dark:text-indigo-400"
                >
                  {downloadingId === viewItem.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" /> Download Marksheet PDF
                    </>
                  )}
                </button>
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
                {editItem ? 'Edit Marks Entry' : 'Upload Evaluation Marks'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Student *</label>
                <select value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                  <option value="" disabled>Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.user?.firstName} {student.user?.lastName} ({student.enrollmentNo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Exam *</label>
                  <select value={formData.examId} onChange={(e) => setFormData({ ...formData, examId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="" disabled>Select Exam</option>
                    {exams.map((exam) => (
                      <option key={exam.id} value={exam.id}>{exam.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Subject *</label>
                  <select value={formData.subjectId} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                    <option value="" disabled>Select Subject</option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Marks Obtained *</label>
                  <input type="number" min={0} max={formData.totalMarks} value={formData.marksObtained} onChange={(e) => setFormData({ ...formData, marksObtained: Number(e.target.value) })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Total Marks *</label>
                  <input type="number" min={1} value={formData.totalMarks} onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Status</label>
                <select value={formData.isPublished ? 'true' : 'false'} onChange={(e) => setFormData({ ...formData, isPublished: e.target.value === 'true' })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 focus:ring-2 focus:ring-indigo-500/20">
                  <option value="true">Publish Immediately</option>
                  <option value="false">Save as Draft</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  {editItem ? 'Update Marks' : 'Upload Marks'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
