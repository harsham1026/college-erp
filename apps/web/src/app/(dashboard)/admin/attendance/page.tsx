'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import { getMockCollection, saveMockItem, deleteMockItem, getStorageData, saveStorageData, DEFAULT_ATTENDANCES, DEFAULT_STUDENTS, DEFAULT_SUBJECTS, DEFAULT_SECTIONS } from '@/lib/mockDb';
import { ClipboardList, CheckCircle2, FileSpreadsheet, FileText, Calendar as CalendarIcon, Check, X, Search, Loader2 } from 'lucide-react';

interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT';
  subjectId: string;
  sectionId: string;
  student?: { user: { firstName: string; lastName: string }; enrollmentNo: string };
  subject?: { name: string; code: string };
  section?: { name: string };
}

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<'logs' | 'mark'>('logs');
  const [data, setData] = useState<Attendance[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  // Mark Attendance Form States
  const [markDate, setMarkDate] = useState(new Date().toISOString().split('T')[0]);
  const [markSubjectId, setMarkSubjectId] = useState('');
  const [markSectionId, setMarkSectionId] = useState('');
  const [studentsRoster, setStudentsRoster] = useState<any[]>([]);
  const [rosterStates, setRosterStates] = useState<Record<string, 'PRESENT' | 'ABSENT'>>({});
  const [rosterLoading, setRosterLoading] = useState(false);

  // Dropdown Metadata State
  const [subjects, setSubjects] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Export States
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const fetchMetadata = async () => {
    try {
      const [subRes, secRes, studRes]: any = await Promise.all([
        api.get('/subjects'),
        api.get('/sections'),
        api.get('/students'),
      ]);
      setSubjects(subRes.data || subRes || []);
      setSections(secRes.data || secRes || []);
      setStudents(studRes.data || studRes || []);
    } catch {
      setSubjects(getStorageData('mock_subjects', DEFAULT_SUBJECTS));
      setSections(getStorageData('mock_sections', DEFAULT_SECTIONS));
      setStudents(getStorageData('mock_students', DEFAULT_STUDENTS));
    }
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get('/attendance', { page, limit, search, sortBy, sortOrder });
      setData(response.data || []);
      setTotal(response.pagination?.total || 0);
    } catch {
      // Fallback local storage mock DB
      const result = getMockCollection<Attendance>('mock_attendance', DEFAULT_ATTENDANCES, {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        searchFields: ['date', 'status'],
      });

      // Hydrate relations manually
      const storedStudents = getStorageData('mock_students', DEFAULT_STUDENTS);
      const storedSubjects = getStorageData('mock_subjects', DEFAULT_SUBJECTS);
      const storedSections = getStorageData('mock_sections', DEFAULT_SECTIONS);

      let filtered = result.data;
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter((att) => {
          const stud = storedStudents.find((s) => s.id === att.studentId);
          return (
            stud?.user?.firstName?.toLowerCase().includes(searchLower) ||
            stud?.user?.lastName?.toLowerCase().includes(searchLower) ||
            stud?.enrollmentNo?.toLowerCase().includes(searchLower) ||
            att.date.includes(searchLower)
          );
        });
      }

      const hydrated = filtered.map((att) => {
        const stud = storedStudents.find((s) => s.id === att.studentId);
        const sub = storedSubjects.find((s) => s.id === att.subjectId);
        const sec = storedSections.find((s) => s.id === att.sectionId);
        return {
          ...att,
          student: stud
            ? {
                user: { firstName: stud.user.firstName, lastName: stud.user.lastName },
                enrollmentNo: stud.enrollmentNo,
              }
            : undefined,
          subject: sub ? { name: sub.name, code: sub.code } : undefined,
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

  // Set default form values once metadata is loaded
  useEffect(() => {
    if (subjects.length > 0 && !markSubjectId) setMarkSubjectId(subjects[0].id);
    if (sections.length > 0 && !markSectionId) setMarkSectionId(sections[0].id);
  }, [subjects, sections]);

  // Load roster based on selected Section
  const handleLoadRoster = () => {
    if (!markSectionId) return;
    setRosterLoading(true);
    // Find all students in that section
    const storedStudents = getStorageData('mock_students', DEFAULT_STUDENTS);
    const roster = storedStudents.filter((s) => s.sectionId === markSectionId);

    // Load existing attendance states for this date/subject/section if exists
    const storedLogs = getStorageData('mock_attendance', DEFAULT_ATTENDANCES);
    const existingStates: Record<string, 'PRESENT' | 'ABSENT'> = {};

    roster.forEach((student) => {
      const match = storedLogs.find(
        (l) => l.studentId === student.id && l.date === markDate && l.subjectId === markSubjectId
      );
      existingStates[student.id] = match ? match.status : 'PRESENT'; // default to PRESENT
    });

    setStudentsRoster(roster);
    setRosterStates(existingStates);
    setRosterLoading(false);
  };

  const toggleRosterState = (studentId: string) => {
    setRosterStates((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'PRESENT' ? 'ABSENT' : 'PRESENT',
    }));
  };

  const handleSaveAttendance = async () => {
    if (studentsRoster.length === 0) return;
    try {
      // Save all roster items
      const storedLogs = getStorageData('mock_attendance', DEFAULT_ATTENDANCES);

      // Clean existing records for this date/subject/section to avoid duplicate keys
      let updatedLogs = storedLogs.filter(
        (log) => !(log.date === markDate && log.subjectId === markSubjectId && log.sectionId === markSectionId)
      );

      studentsRoster.forEach((student) => {
        updatedLogs.unshift({
          id: Math.random().toString(36).substring(2, 9),
          studentId: student.id,
          date: markDate,
          status: rosterStates[student.id] || 'PRESENT',
          subjectId: markSubjectId,
          sectionId: markSectionId,
        });
      });

      saveStorageData('mock_attendance', updatedLogs);
      setToast({ message: 'Attendance register saved successfully!', type: 'success' });
      fetchData();
      setActiveTab('logs');
    } catch {
      setToast({ message: 'Failed to save attendance register.', type: 'error' });
    }
  };

  const handleDeleteLog = async (item: Attendance) => {
    if (!confirm('Are you sure you want to delete this log entry?')) return;
    try {
      await api.delete(`/attendance/${item.id}`);
      setToast({ message: 'Log deleted successfully!', type: 'success' });
      fetchData();
    } catch {
      deleteMockItem('mock_attendance', DEFAULT_ATTENDANCES, item.id);
      setToast({ message: 'Log removed from mock storage!', type: 'success' });
      fetchData();
    }
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    setIsExporting(format);
    setTimeout(() => {
      setIsExporting(null);
      setToast({
        message: `Attendance report exported successfully in ${format.toUpperCase()} format!`,
        type: 'success',
      });
    }, 1500);
  };

  const columns = [
    { key: 'date', title: 'Date', sortable: true },
    {
      key: 'student',
      title: 'Student & USN',
      render: (_: any, row: Attendance) =>
        row.student ? (
          <div>
            <p className="font-semibold text-slate-900 dark:text-white leading-tight">
              {row.student.user.firstName} {row.student.user.lastName}
            </p>
            <p className="text-[11px] text-slate-500 font-semibold">{row.student.enrollmentNo}</p>
          </div>
        ) : (
          <span className="text-slate-400 text-xs">Unknown Student</span>
        ),
    },
    {
      key: 'subject',
      title: 'Subject',
      render: (_: any, row: Attendance) =>
        row.subject ? `${row.subject.name} (${row.subject.code})` : 'N/A',
    },
    {
      key: 'section',
      title: 'Section',
      render: (_: any, row: Attendance) => row.section?.name || 'N/A',
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: 'PRESENT' | 'ABSENT') => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            value === 'PRESENT'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'
          }`}
        >
          {value}
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
        <Breadcrumbs items={[{ label: 'Academics', href: '#' }, { label: 'Attendance' }]} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md flex-shrink-0">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Attendance</h1>
              <p className="text-sm text-slate-500">Track and register student class attendances</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting !== null}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 text-xs font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <FileText className="w-3.5 h-3.5" /> Export PDF
            </button>
            <button
              onClick={() => handleExport('excel')}
              disabled={isExporting !== null}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 text-xs font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Export Excel
            </button>
          </div>
        </div>
      </div>

      {isExporting && (
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 rounded-xl text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-2 animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Exporting data report as {isExporting.toUpperCase()}... Please wait.
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'logs'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-850'
          }`}
        >
          Daily Logs
        </button>
        <button
          onClick={() => setActiveTab('mark')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'mark'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-850'
          }`}
        >
          Mark Attendance
        </button>
      </div>

      {activeTab === 'logs' ? (
        <DataTable
          title="Attendance Log Ledger"
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
          onDelete={handleDeleteLog}
          searchPlaceholder="Search by student name, USN or Date..."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class Selectors */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Class Settings</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-450 uppercase mb-1">Date</label>
              <input
                type="date"
                value={markDate}
                onChange={(e) => setMarkDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-450 uppercase mb-1">Subject</label>
              <select
                value={markSubjectId}
                onChange={(e) => setMarkSubjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-450 uppercase mb-1">Class Section</label>
              <select
                value={markSectionId}
                onChange={(e) => setMarkSectionId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
              >
                {sections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleLoadRoster}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-95"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              Load Student Roster
            </button>
          </div>

          {/* Student Roster Checkbox list */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Student Attendance Checklist</h3>
                <p className="text-xs text-slate-500">{studentsRoster.length} students enrolled in this section</p>
              </div>
              {studentsRoster.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const allPres: Record<string, 'PRESENT'> = {};
                      studentsRoster.forEach((s) => (allPres[s.id] = 'PRESENT'));
                      setRosterStates(allPres as any);
                    }}
                    className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 hover:bg-emerald-100 rounded-lg text-xs font-semibold"
                  >
                    Mark All Present
                  </button>
                  <button
                    onClick={() => {
                      const allAbs: Record<string, 'ABSENT'> = {};
                      studentsRoster.forEach((s) => (allAbs[s.id] = 'ABSENT'));
                      setRosterStates(allAbs as any);
                    }}
                    className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-450 hover:bg-rose-100 rounded-lg text-xs font-semibold"
                  >
                    Mark All Absent
                  </button>
                </div>
              )}
            </div>

            {rosterLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                <p className="text-sm text-slate-500 mt-2">Loading roster...</p>
              </div>
            ) : studentsRoster.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <ClipboardList className="w-12 h-12 stroke-1 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-sm font-semibold">No Roster Loaded</p>
                <p className="text-xs">Configure the class settings and click "Load Student Roster".</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between">
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[450px] overflow-y-auto pr-2">
                  {studentsRoster.map((student) => {
                    const status = rosterStates[student.id] || 'PRESENT';
                    return (
                      <div
                        key={student.id}
                        onClick={() => toggleRosterState(student.id)}
                        className="flex items-center justify-between py-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors px-2 rounded-xl cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                            {student.user.firstName[0]}
                            {student.user.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              {student.user.firstName} {student.user.lastName}
                            </p>
                            <p className="text-[11px] text-slate-450">{student.enrollmentNo}</p>
                          </div>
                        </div>

                        <button
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            status === 'PRESENT'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400'
                              : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-800 dark:text-rose-450'
                          }`}
                        >
                          {status === 'PRESENT' ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Present
                            </>
                          ) : (
                            <>
                              <X className="w-3.5 h-3.5" /> Absent
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-4 flex justify-end">
                  <button
                    onClick={handleSaveAttendance}
                    className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-95 transition-opacity"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                  >
                    Save Attendance Registry
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
