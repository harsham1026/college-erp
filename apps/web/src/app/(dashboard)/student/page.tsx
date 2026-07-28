'use client';

import React, { useEffect, useState } from 'react';
import {
  GraduationCap, Clock, BookOpen, ClipboardList, CreditCard,
  TrendingUp, Calendar, FileText, Bell, Award, BarChart3,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar,
} from 'recharts';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response: any = await api.get('/dashboard/student');
        setStats(response.data);
      } catch {
        setStats({
          stats: { attendancePercentage: 87, pendingHomeworkCount: 3, pendingAssignmentCount: 2, cgpa: 8.7 },
          student: { course: { name: 'B.Tech Computer Science' }, semester: { name: 'Semester 3' } },
        });
      }
    };
    fetchStats();
  }, []);

  const attendancePercent = stats?.stats?.attendancePercentage || 87;
  const radialData = [{ name: 'Attendance', value: attendancePercent, fill: attendancePercent >= 75 ? '#6366f1' : '#ef4444' }];

  const subjectAttendance = [
    { subject: 'DSA', percentage: 92 },
    { subject: 'DBMS', percentage: 85 },
    { subject: 'OS', percentage: 88 },
    { subject: 'CN', percentage: 78 },
    { subject: 'DSA Lab', percentage: 95 },
    { subject: 'DBMS Lab', percentage: 90 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl overflow-hidden p-8 text-white relative" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, white, transparent)' }} />
        <div className="relative z-10">
          <p className="text-indigo-200 text-sm font-medium">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},</p>
          <h1 className="text-3xl font-bold mt-1 tracking-tight">{user?.firstName} {user?.lastName} 👋</h1>
          <p className="text-indigo-200 mt-2">{stats?.student?.course?.name} • {stats?.student?.semester?.name}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Attendance', value: `${attendancePercent}%`, icon: ClipboardList, color: '#6366f1', bg: 'bg-indigo-50' },
          { title: 'CGPA', value: stats?.stats?.cgpa || '8.7', icon: Award, color: '#8b5cf6', bg: 'bg-violet-50' },
          { title: 'Pending HW', value: stats?.stats?.pendingHomeworkCount || 3, icon: FileText, color: '#f59e0b', bg: 'bg-amber-50' },
          { title: 'Assignments', value: stats?.stats?.pendingAssignmentCount || 2, icon: BookOpen, color: '#06b6d4', bg: 'bg-cyan-50' },
        ].map((stat) => (
          <div key={stat.title} className="rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Attendance Radial */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Overall Attendance</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={radialData} startAngle={180} endAngle={0}>
                <RadialBar background dataKey="value" cornerRadius={15} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-4xl font-bold text-slate-900 dark:text-white -mt-8">{attendancePercent}%</p>
          <p className="text-center text-sm text-slate-500 mt-1">
            {attendancePercent >= 75 ? '✅ Above minimum requirement' : '⚠️ Below 75% threshold'}
          </p>
        </div>

        {/* Subject-wise Attendance */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Subject-wise Attendance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={subjectAttendance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis type="category" dataKey="subject" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} width={60} />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
              <Bar dataKey="percentage" radius={[0, 6, 6, 0]} fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { title: 'Timetable', icon: Calendar, color: '#6366f1', href: '/student/timetable' },
          { title: 'Materials', icon: BookOpen, color: '#8b5cf6', href: '/student/materials' },
          { title: 'Results', icon: BarChart3, color: '#06b6d4', href: '/student/results' },
          { title: 'Fees', icon: CreditCard, color: '#10b981', href: '/student/fees' },
          { title: 'AI Chat', icon: GraduationCap, color: '#f59e0b', href: '/student/ai-chat' },
          { title: 'Placement', icon: TrendingUp, color: '#ef4444', href: '/student/placement' },
        ].map((link) => (
          <a key={link.title} href={link.href} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${link.color}15` }}>
              <link.icon className="w-5 h-5" style={{ color: link.color }} />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{link.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
