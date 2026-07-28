'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import { Settings, Building2, Calendar, Mail, Shield, Database, Bell, Palette, Save, Download } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'email' | 'notifications' | 'security' | 'backup'>('profile');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [profile, setProfile] = useState({
    collegeName: 'Modern Institute of Technology & Engineering',
    code: 'MIT-ENG-2026',
    email: 'contact@mit.edu.in',
    phone: '+91 80 2345 6789',
    address: '123 Innovation Park, Tech Hub Road',
    city: 'Bangalore',
    state: 'Karnataka',
  });

  const [academicSettings, setAcademicSettings] = useState({
    academicYear: '2026-2027',
    minAttendance: 75,
    gradingSystem: '10-Point SGPA/CGPA',
    passingMarksPercent: 40,
  });

  const [emailSms, setEmailSms] = useState({
    smtpServer: 'smtp.gmail.com',
    smtpPort: 587,
    senderEmail: 'notifications@college.edu',
    smsGatewayKey: 'SMS_GATEWAY_LIVE_KEY_99812',
  });

  const [security, setSecurity] = useState({
    requireTwoFactor: true,
    sessionTimeoutMinutes: 60,
    maxLoginAttempts: 5,
    passwordExpiryDays: 90,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToast({ message: 'System configuration settings saved successfully!', type: 'success' });
  };

  const triggerBackup = () => {
    setToast({ message: 'Database backup successfully generated! Downloading archive...', type: 'success' });
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <Breadcrumbs items={[{ label: 'System' }, { label: 'Settings' }]} />
        <div className="flex items-center gap-3 mt-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-md flex-shrink-0">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">System Settings</h1>
            <p className="text-sm text-slate-500">Configure global ERP settings, college profile, communication gateways, security policies & backups</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Building2 className="w-4 h-4" /> College Profile
        </button>
        <button onClick={() => setActiveTab('academic')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'academic' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Calendar className="w-4 h-4" /> Academic & Semesters
        </button>
        <button onClick={() => setActiveTab('email')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'email' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Mail className="w-4 h-4" /> Email & SMS Gateway
        </button>
        <button onClick={() => setActiveTab('security')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'security' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Shield className="w-4 h-4" /> Security & Auth
        </button>
        <button onClick={() => setActiveTab('backup')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'backup' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Database className="w-4 h-4" /> Database Backup
        </button>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">College Institutional Profile</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">College / Institute Title</label>
              <input value={profile.collegeName} onChange={(e) => setProfile({ ...profile, collegeName: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Institutional Code</label>
                <input value={profile.code} onChange={(e) => setProfile({ ...profile, code: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Contact Email</label>
                <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">City</label>
                <input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">State</label>
                <input value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
            </div>
            <div className="pt-4">
              <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">
                <Save className="w-4 h-4" /> Save Profile
              </button>
            </div>
          </form>
        )}

        {activeTab === 'academic' && (
          <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Academic Rules & Terms</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Current Academic Year</label>
                <input value={academicSettings.academicYear} onChange={(e) => setAcademicSettings({ ...academicSettings, academicYear: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Minimum Attendance Cutoff (%)</label>
                <input type="number" value={academicSettings.minAttendance} onChange={(e) => setAcademicSettings({ ...academicSettings, minAttendance: Number(e.target.value) })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
            </div>
            <div className="pt-4">
              <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">
                <Save className="w-4 h-4" /> Save Academic Rules
              </button>
            </div>
          </form>
        )}

        {activeTab === 'email' && (
          <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Email (SMTP) & SMS Gateway Credentials</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">SMTP Host Server</label>
                <input value={emailSms.smtpServer} onChange={(e) => setEmailSms({ ...emailSms, smtpServer: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Sender Email</label>
                <input value={emailSms.senderEmail} onChange={(e) => setEmailSms({ ...emailSms, senderEmail: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">SMS Gateway API Key</label>
              <input value={emailSms.smsGatewayKey} onChange={(e) => setEmailSms({ ...emailSms, smsGatewayKey: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 font-mono" />
            </div>
            <div className="pt-4">
              <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">
                <Save className="w-4 h-4" /> Save Gateways
              </button>
            </div>
          </form>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Authentication & Security Policies</h3>
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">Two-Factor Authentication (2FA)</p>
                <p className="text-xs text-slate-500">Require TOTP or SMS OTP for admin account logins</p>
              </div>
              <input type="checkbox" checked={security.requireTwoFactor} onChange={(e) => setSecurity({ ...security, requireTwoFactor: e.target.checked })} className="w-5 h-5 rounded accent-indigo-600" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Session Expiry (Minutes)</label>
                <input type="number" value={security.sessionTimeoutMinutes} onChange={(e) => setSecurity({ ...security, sessionTimeoutMinutes: Number(e.target.value) })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Max Failed Login Attempts</label>
                <input type="number" value={security.maxLoginAttempts} onChange={(e) => setSecurity({ ...security, maxLoginAttempts: Number(e.target.value) })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
            </div>
            <div className="pt-4">
              <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">
                <Save className="w-4 h-4" /> Save Security Policies
              </button>
            </div>
          </form>
        )}

        {activeTab === 'backup' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Database Backup & Disaster Recovery</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Generate immediate snapshot of PostgreSQL database schema, student records, fee collections and system logs.</p>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">Last Automatic Backup</p>
                <p className="text-xs text-slate-500">2026-07-28 03:00:00 AM UTC (Size: 142.8 MB)</p>
              </div>
              <button onClick={triggerBackup} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">
                <Download className="w-4 h-4" /> Export Backup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
