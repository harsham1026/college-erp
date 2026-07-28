'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import { getMockCollection, DEFAULT_AUDIT_LOGS } from '@/lib/mockDb';
import { ScrollText, ShieldAlert, Monitor, Terminal } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res: any = await api.get('/audit-logs', { page, limit, search, module: moduleFilter !== 'ALL' ? moduleFilter : undefined });
      setLogs(res.data || []);
      setTotal(res.pagination?.total || 0);
    } catch {
      const res = getMockCollection('mock_audit_logs', DEFAULT_AUDIT_LOGS, {
        page,
        limit,
        search,
        searchFields: ['user', 'module', 'action', 'target', 'ipAddress'],
        filter: (item) => (moduleFilter === 'ALL' ? true : item.module === moduleFilter),
      });
      setLogs(res.data);
      setTotal(res.pagination.total);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, moduleFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const columns = [
    {
      key: 'timestamp',
      title: 'Date & Time',
      sortable: true,
      render: (v: string) => <span className="font-mono text-xs text-slate-500">{v}</span>,
    },
    {
      key: 'user',
      title: 'User Account',
      sortable: true,
      render: (v: string) => <span className="font-semibold text-slate-900 dark:text-white">{v}</span>,
    },
    {
      key: 'module',
      title: 'Module',
      render: (v: string) => <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">{v}</span>,
    },
    {
      key: 'action',
      title: 'Action Event',
      render: (v: string, r: any) => (
        <div>
          <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{v}</span>
          <p className="text-xs text-slate-500">{r.target}</p>
        </div>
      ),
    },
    {
      key: 'ipAddress',
      title: 'IP & Device',
      render: (v: string, r: any) => (
        <div>
          <p className="font-mono text-xs text-slate-700 dark:text-slate-300">{v}</p>
          <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{r.device}</p>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (v: string) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${v === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950' : 'bg-red-100 text-red-700 dark:bg-red-950'}`}>
          {v}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <Breadcrumbs items={[{ label: 'System' }, { label: 'Audit Logs' }]} />
        <div className="flex items-center gap-3 mt-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-md flex-shrink-0">
            <ScrollText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Security & Audit Trail</h1>
            <p className="text-sm text-slate-500">Track user logins, system actions, data mutations, IP addresses and security events</p>
          </div>
        </div>
      </div>

      {/* Module Filters */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {['ALL', 'Auth', 'Users', 'Academics', 'Finance', 'Analytics'].map((m) => (
          <button
            key={m}
            onClick={() => { setModuleFilter(m); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${moduleFilter === m ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            {m === 'ALL' ? 'All System Events' : `${m} Module`}
          </button>
        ))}
      </div>

      <DataTable
        title="Audit Logs History"
        columns={columns}
        data={logs}
        totalItems={total}
        page={page}
        limit={limit}
        isLoading={isLoading}
        onPageChange={setPage}
        onLimitChange={(l) => { setPage(1); setLimit(l); }}
        onSearch={(s) => { setSearch(s); setPage(1); }}
        onSort={() => {}}
        searchPlaceholder="Search logs by user, IP or action..."
      />
    </div>
  );
}
