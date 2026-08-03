'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar, Plus, Clock, CheckCircle2, XCircle, AlertCircle,
  Search, Filter, Trash2, FileText, UserCheck
} from 'lucide-react';
import { INITIAL_LEAVE_APPLICATIONS, LeaveApplicationItem } from '@/lib/teacherMockData';

export default function TeacherLeavePage() {
  const [leaves, setLeaves] = useState<LeaveApplicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Apply Modal
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveApplicationItem['leaveType']>('Casual Leave');
  const [startDate, setStartDate] = useState('2026-08-12');
  const [endDate, setEndDate] = useState('2026-08-13');
  const [substituteTeacher, setSubstituteTeacher] = useState('Prof. Anitha Rao');
  const [reason, setReason] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLeaves(INITIAL_LEAVE_APPLICATIONS);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    const newLeave: LeaveApplicationItem = {
      id: 'lv-' + Date.now(),
      leaveType,
      startDate,
      endDate,
      totalDays: 2,
      reason,
      substituteTeacher,
      appliedDate: new Date().toISOString().substring(0, 10),
      status: 'PENDING',
    };

    setLeaves([newLeave, ...leaves]);
    setIsApplyOpen(false);
    setReason('');
  };

  const handleCancelLeave = (id: string) => {
    if (confirm('Cancel this pending leave application?')) {
      setLeaves(prev => prev.filter(l => l.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" /> Faculty Leave Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Leave Management & History</h1>
          <p className="text-indigo-200 text-sm mt-1">Apply for casual, medical, or earned leave and track approval status</p>
        </div>
        <button
          onClick={() => setIsApplyOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-950 font-bold text-sm hover:bg-indigo-50 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 text-indigo-700" /> Apply Leave
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Casual Leave (CL)</p>
          <h3 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">8 Days</h3>
          <p className="text-xs text-slate-500 mt-1">Remaining out of 12</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Medical Leave (ML)</p>
          <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">10 Days</h3>
          <p className="text-xs text-slate-500 mt-1">Remaining out of 10</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Earned Leave (EL)</p>
          <h3 className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">12 Days</h3>
          <p className="text-xs text-slate-500 mt-1">Remaining out of 15</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Applications Pending</p>
          <h3 className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {leaves.filter(l => l.status === 'PENDING').length}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Awaiting HOD Approval</p>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-[#334155]">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Leave Application History</h3>
        </div>
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading leave records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-[#334155]">
                  <th className="px-6 py-4">Leave Category</th>
                  <th className="px-6 py-4">Duration & Dates</th>
                  <th className="px-6 py-4">Substitute Faculty</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {leaves.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white text-sm">{item.leaveType}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {item.startDate} to {item.endDate} ({item.totalDays} Days)
                    </td>
                    <td className="px-6 py-4 text-sm text-indigo-600 font-semibold">{item.substituteTeacher}</td>
                    <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">{item.reason}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        item.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.status === 'PENDING' && (
                        <button onClick={() => handleCancelLeave(item.id)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100">
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {isApplyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleApplySubmit} className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Apply For Faculty Leave</h3>
              <button type="button" onClick={() => setIsApplyOpen(false)} className="p-2 text-slate-400 text-lg">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Leave Type</label>
                <select value={leaveType} onChange={e => setLeaveType(e.target.value as any)} className="w-full p-3 rounded-xl bg-slate-50 border text-xs font-bold text-slate-900 dark:text-white">
                  <option value="Casual Leave">Casual Leave (CL)</option>
                  <option value="Medical Leave">Medical Leave (ML)</option>
                  <option value="Earned Leave">Earned Leave (EL)</option>
                  <option value="Half Day">Half Day Leave</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Substitute Teacher</label>
                <select value={substituteTeacher} onChange={e => setSubstituteTeacher(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 border text-xs font-bold text-slate-900 dark:text-white">
                  <option value="Prof. Anitha Rao">Prof. Anitha Rao</option>
                  <option value="Dr. Suresh V.">Dr. Suresh V.</option>
                  <option value="Prof. Meenakshi S.">Prof. Meenakshi S.</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Start Date</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 border text-xs font-bold text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">End Date</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 border text-xs font-bold text-slate-900 dark:text-white" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Reason For Leave</label>
              <textarea rows={3} required value={reason} onChange={e => setReason(e.target.value)} placeholder="Provide detailed reason..." className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm text-slate-900 dark:text-white" />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button type="button" onClick={() => setIsApplyOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm">Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700">Submit Application</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
