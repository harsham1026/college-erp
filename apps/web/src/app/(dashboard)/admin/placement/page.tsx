'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import {
  getMockCollection, saveMockItem, deleteMockItem,
  DEFAULT_COMPANIES, DEFAULT_PLACEMENT_DRIVES, DEFAULT_JOB_ROLES, DEFAULT_PLACEMENT_APPLICATIONS, DEFAULT_INTERVIEWS, DEFAULT_OFFERS,
} from '@/lib/mockDb';
import { Briefcase, Building2, FileText, Calendar, CheckCircle2, TrendingUp, Award, DollarSign, X } from 'lucide-react';

export default function PlacementPage() {
  const [activeTab, setActiveTab] = useState<'companies' | 'drives' | 'roles' | 'applications' | 'interviews' | 'offers' | 'stats'>('drives');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // --- COMPANIES ---
  const [companies, setCompanies] = useState<any[]>([]);
  const [cmpTotal, setCmpTotal] = useState(0);
  const [cmpPage, setCmpPage] = useState(1);
  const [cmpLimit, setCmpLimit] = useState(10);
  const [cmpSearch, setCmpSearch] = useState('');
  const [cmpLoading, setCmpLoading] = useState(true);
  const [showCmpModal, setShowCmpModal] = useState(false);
  const [editCmp, setEditCmp] = useState<any>(null);
  const [cmpForm, setCmpForm] = useState({ name: '', industry: 'Software / Tech', location: 'Bangalore', hrContact: '', website: '', tier: 'Tier 1 Dream' });

  // --- DRIVES ---
  const [drives, setDrives] = useState<any[]>([]);
  const [drvTotal, setDrvTotal] = useState(0);
  const [drvPage, setDrvPage] = useState(1);
  const [drvLimit, setDrvLimit] = useState(10);
  const [drvSearch, setDrvSearch] = useState('');
  const [drvLoading, setDrvLoading] = useState(true);
  const [showDrvModal, setShowDrvModal] = useState(false);
  const [editDrv, setEditDrv] = useState<any>(null);
  const [drvForm, setDrvForm] = useState({ companyName: '', title: '', ctcLpa: 12, minCgpa: 7.5, driveDate: '', venue: 'Auditorium Block A', status: 'Upcoming' });

  // --- APPLICATIONS ---
  const [apps, setApps] = useState<any[]>([]);
  const [appTotal, setAppTotal] = useState(0);
  const [appPage, setAppPage] = useState(1);
  const [appLimit, setAppLimit] = useState(10);
  const [appSearch, setAppSearch] = useState('');
  const [appLoading, setAppLoading] = useState(true);

  // --- OFFERS ---
  const [offers, setOffers] = useState<any[]>([]);

  // Fetchers
  const fetchCompanies = useCallback(async () => {
    setCmpLoading(true);
    try {
      const res: any = await api.get('/placement/companies', { page: cmpPage, limit: cmpLimit, search: cmpSearch });
      setCompanies(res.data || []);
      setCmpTotal(res.pagination?.total || 0);
    } catch {
      const res = getMockCollection('mock_placement_companies', DEFAULT_COMPANIES, {
        page: cmpPage, limit: cmpLimit, search: cmpSearch, searchFields: ['name', 'industry', 'location', 'tier'],
      });
      setCompanies(res.data);
      setCmpTotal(res.pagination.total);
    } finally { setCmpLoading(false); }
  }, [cmpPage, cmpLimit, cmpSearch]);

  const fetchDrives = useCallback(async () => {
    setDrvLoading(true);
    try {
      const res: any = await api.get('/placement/drives', { page: drvPage, limit: drvLimit, search: drvSearch });
      setDrives(res.data || []);
      setDrvTotal(res.pagination?.total || 0);
    } catch {
      const res = getMockCollection('mock_placement_drives', DEFAULT_PLACEMENT_DRIVES, {
        page: drvPage, limit: drvLimit, search: drvSearch, searchFields: ['companyName', 'title', 'venue'],
      });
      setDrives(res.data);
      setDrvTotal(res.pagination.total);
    } finally { setDrvLoading(false); }
  }, [drvPage, drvLimit, drvSearch]);

  const fetchApps = useCallback(async () => {
    setAppLoading(true);
    try {
      const res: any = await api.get('/placement/applications', { page: appPage, limit: appLimit, search: appSearch });
      setApps(res.data || []);
      setAppTotal(res.pagination?.total || 0);
    } catch {
      const res = getMockCollection('mock_placement_applications', DEFAULT_PLACEMENT_APPLICATIONS, {
        page: appPage, limit: appLimit, search: appSearch, searchFields: ['studentName', 'enrollmentNo', 'companyName', 'roleTitle'],
      });
      setApps(res.data);
      setAppTotal(res.pagination.total);
    } finally { setAppLoading(false); }
  }, [appPage, appLimit, appSearch]);

  useEffect(() => {
    if (activeTab === 'companies') fetchCompanies();
    else if (activeTab === 'drives') fetchDrives();
    else if (activeTab === 'applications') fetchApps();
    else if (activeTab === 'offers') setOffers(DEFAULT_OFFERS);
  }, [activeTab, fetchCompanies, fetchDrives, fetchApps]);

  const handleCmpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMockItem('mock_placement_companies', DEFAULT_COMPANIES, { ...(editCmp ? { id: editCmp.id } : {}), ...cmpForm, status: 'Active' });
    setToast({ message: editCmp ? 'Company updated!' : 'Recruiter company added!', type: 'success' });
    setShowCmpModal(false);
    fetchCompanies();
  };

  const handleDrvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMockItem('mock_placement_drives', DEFAULT_PLACEMENT_DRIVES, { ...(editDrv ? { id: editDrv.id } : {}), ...drvForm, totalApplicants: editDrv ? editDrv.totalApplicants : 0 });
    setToast({ message: editDrv ? 'Placement drive updated!' : 'Drive scheduled successfully!', type: 'success' });
    setShowDrvModal(false);
    fetchDrives();
  };

  const cmpColumns = [
    { key: 'name', title: 'Company Name', sortable: true, render: (v: string, r: any) => (
      <div>
        <p className="font-bold text-slate-900 dark:text-white">{v}</p>
        <p className="text-xs text-slate-500">{r.website}</p>
      </div>
    )},
    { key: 'industry', title: 'Industry Field' },
    { key: 'location', title: 'Job Locations' },
    { key: 'tier', title: 'Company Category', render: (v: string) => <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{v}</span> },
    { key: 'hrContact', title: 'HR Email' },
  ];

  const drvColumns = [
    { key: 'companyName', title: 'Company & Drive Title', sortable: true, render: (v: string, r: any) => (
      <div>
        <p className="font-bold text-slate-900 dark:text-white">{v}</p>
        <p className="text-xs text-slate-500">{r.title}</p>
      </div>
    )},
    { key: 'ctcLpa', title: 'Package (CTC)', sortable: true, render: (v: number) => <strong className="text-emerald-600 dark:text-emerald-400">{v} LPA</strong> },
    { key: 'minCgpa', title: 'Eligibility CGPA', render: (v: number) => `Min CGPA ${v}` },
    { key: 'driveDate', title: 'Drive Date' },
    { key: 'status', title: 'Drive Status', render: (v: string) => (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${v === 'Completed' ? 'bg-slate-100 text-slate-700' : v === 'Ongoing' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
        {v}
      </span>
    )},
  ];

  const appColumns = [
    { key: 'studentName', title: 'Candidate Student', sortable: true, render: (v: string, r: any) => (
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{v}</p>
        <p className="text-xs text-slate-500">USN: {r.enrollmentNo}</p>
      </div>
    )},
    { key: 'companyName', title: 'Company' },
    { key: 'roleTitle', title: 'Role Applied' },
    { key: 'appliedDate', title: 'Applied On' },
    { key: 'status', title: 'Current Status', render: (v: string) => (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${v === 'Selected' ? 'bg-emerald-100 text-emerald-700' : v === 'Shortlisted' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-800'}`}>
        {v}
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <Breadcrumbs items={[{ label: 'Placement Cell' }]} />
        <div className="flex items-center gap-3 mt-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-md flex-shrink-0">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Placement & Career Cell</h1>
            <p className="text-sm text-slate-500">Manage recruiter companies, placement drives, eligible student applications, interview rounds, offers & analytics</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button onClick={() => setActiveTab('drives')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'drives' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Calendar className="w-4 h-4" /> Placement Drives
        </button>
        <button onClick={() => setActiveTab('companies')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'companies' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Building2 className="w-4 h-4" /> Recruiting Companies
        </button>
        <button onClick={() => setActiveTab('applications')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'applications' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <FileText className="w-4 h-4" /> Student Applications
        </button>
        <button onClick={() => setActiveTab('offers')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'offers' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Award className="w-4 h-4" /> Placed Offers
        </button>
        <button onClick={() => setActiveTab('stats')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'stats' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <TrendingUp className="w-4 h-4" /> Placement Statistics
        </button>
      </div>

      {activeTab === 'drives' && (
        <DataTable
          title="Scheduled Placement Drives"
          columns={drvColumns}
          data={drives}
          totalItems={drvTotal}
          page={drvPage}
          limit={drvLimit}
          isLoading={drvLoading}
          onPageChange={setDrvPage}
          onLimitChange={(l) => { setDrvPage(1); setDrvLimit(l); }}
          onSearch={(s) => { setDrvSearch(s); setDrvPage(1); }}
          onSort={() => {}}
          onAdd={() => { setEditDrv(null); setDrvForm({ companyName: companies[0]?.name || 'Google', title: '', ctcLpa: 12, minCgpa: 7.5, driveDate: '', venue: 'Auditorium Block A', status: 'Upcoming' }); setShowDrvModal(true); }}
          onEdit={(r) => { setEditDrv(r); setDrvForm({ companyName: r.companyName, title: r.title, ctcLpa: r.ctcLpa, minCgpa: r.minCgpa, driveDate: r.driveDate, venue: r.venue, status: r.status }); setShowDrvModal(true); }}
          onDelete={(r) => { deleteMockItem('mock_placement_drives', DEFAULT_PLACEMENT_DRIVES, r.id); setToast({ message: 'Drive cancelled!', type: 'success' }); fetchDrives(); }}
          addLabel="Schedule Drive"
          searchPlaceholder="Search drive title or company..."
        />
      )}

      {activeTab === 'companies' && (
        <DataTable
          title="Recruiter Companies Registry"
          columns={cmpColumns}
          data={companies}
          totalItems={cmpTotal}
          page={cmpPage}
          limit={cmpLimit}
          isLoading={cmpLoading}
          onPageChange={setCmpPage}
          onLimitChange={(l) => { setCmpPage(1); setCmpLimit(l); }}
          onSearch={(s) => { setCmpSearch(s); setCmpPage(1); }}
          onSort={() => {}}
          onAdd={() => { setEditCmp(null); setCmpForm({ name: '', industry: 'Software / Tech', location: 'Bangalore', hrContact: '', website: '', tier: 'Tier 1 Dream' }); setShowCmpModal(true); }}
          onEdit={(r) => { setEditCmp(r); setCmpForm({ name: r.name, industry: r.industry, location: r.location, hrContact: r.hrContact, website: r.website, tier: r.tier }); setShowCmpModal(true); }}
          onDelete={(r) => { deleteMockItem('mock_placement_companies', DEFAULT_COMPANIES, r.id); setToast({ message: 'Company removed!', type: 'success' }); fetchCompanies(); }}
          addLabel="Add Company"
          searchPlaceholder="Search company name or industry..."
        />
      )}

      {activeTab === 'applications' && (
        <DataTable
          title="Campus Drive Applications Log"
          columns={appColumns}
          data={apps}
          totalItems={appTotal}
          page={appPage}
          limit={appLimit}
          isLoading={appLoading}
          onPageChange={setAppPage}
          onLimitChange={(l) => { setAppPage(1); setAppLimit(l); }}
          onSearch={(s) => { setAppSearch(s); setAppPage(1); }}
          onSort={() => {}}
          searchPlaceholder="Search applicant by student or USN..."
        />
      )}

      {activeTab === 'offers' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Placed Students & Job Offers</h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {offers.map((o) => (
              <div key={o.id} className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{o.studentName} ({o.enrollmentNo})</h4>
                  <p className="text-xs text-slate-500">Company: {o.companyName} | Branch: {o.branch} | Joining: {o.joiningDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{o.ctcLpa} LPA</p>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">Highest Package</p>
            <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">32.5 LPA</p>
            <p className="text-xs text-slate-400">Offered by Google</p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">Average Package</p>
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">11.8 LPA</p>
            <p className="text-xs text-slate-400">Across B.Tech / M.Tech</p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">Overall Placement %</p>
            <p className="text-3xl font-extrabold text-violet-600 dark:text-violet-400">92.4%</p>
            <p className="text-xs text-slate-400">Class of 2026 Batch</p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">Recruiting Partners</p>
            <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">85+ Companies</p>
            <p className="text-xs text-slate-400">Active Tier 1 & Core Partners</p>
          </div>
        </div>
      )}

      {/* Company Modal */}
      {showCmpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCmpModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editCmp ? 'Edit Company' : 'Add Recruiter Company'}</h3>
              <button onClick={() => setShowCmpModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCmpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Company Name *</label>
                <input value={cmpForm.name} onChange={(e) => setCmpForm({ ...cmpForm, name: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Industry Field</label>
                  <input value={cmpForm.industry} onChange={(e) => setCmpForm({ ...cmpForm, industry: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Category Tier</label>
                  <select value={cmpForm.tier} onChange={(e) => setCmpForm({ ...cmpForm, tier: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0">
                    <option value="Tier 1 Dream">Tier 1 Dream</option>
                    <option value="Tier 1 Core">Tier 1 Core</option>
                    <option value="Mass Recruiter">Mass Recruiter</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowCmpModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Save Company</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drive Modal */}
      {showDrvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDrvModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editDrv ? 'Edit Drive' : 'Schedule Placement Drive'}</h3>
              <button onClick={() => setShowDrvModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleDrvSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Company Name *</label>
                  <input value={drvForm.companyName} onChange={(e) => setDrvForm({ ...drvForm, companyName: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Drive Title *</label>
                  <input value={drvForm.title} onChange={(e) => setDrvForm({ ...drvForm, title: e.target.value })} placeholder="e.g. SDE Trainee 2027" required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Package CTC (LPA)</label>
                  <input type="number" step="0.5" value={drvForm.ctcLpa} onChange={(e) => setDrvForm({ ...drvForm, ctcLpa: Number(e.target.value) })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Min Cutoff CGPA</label>
                  <input type="number" step="0.1" value={drvForm.minCgpa} onChange={(e) => setDrvForm({ ...drvForm, minCgpa: Number(e.target.value) })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowDrvModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Save Drive</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
