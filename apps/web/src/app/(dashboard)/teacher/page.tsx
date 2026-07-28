'use client';

import React, { useEffect, useState } from 'react';
import {
  ClipboardList, BookOpen, Users, Clock, Calendar,
  FileText, Bell, TrendingUp, CheckCircle, XCircle,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response: any = await api.get('/dashboard/teacher');
        setStats(response.data);
      } catch {
        setStats({ stats: { totalSubjects: 4, pendingHomework: 2 }, todayClasses: [] });
      }
    };
    fetchStats();
  }, []);

  const todayClasses = [
    { time: '09:00 - 10:00', subject: 'Data Structures', section: 'CSE-A', room: 'Room 301', status: 'completed' },
    { time: '10:15 - 11:15', subject: 'DSA Lab', section: 'CSE-B', room: 'Lab 201', status: 'ongoing' },
    { time: '11:30 - 12:30', subject: 'Data Structures', section: 'CSE-C', room: 'Room 302', status: 'upcoming' },
    { time: '14:00 - 15:00', subject: 'Algorithms', section: 'CSE-A', room: 'Room 401', status: 'upcoming' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl overflow-hidden p-8 text-white relative" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, white, transparent)' }} />
        <div className="relative z-10">
          <p className="text-violet-200 text-sm font-medium">Welcome back,</p>
          <h1 className="text-3xl font-bold mt-1 tracking-tight">{user?.firstName} {user?.lastName} 👋</h1>
          <p className="text-violet-200 mt-2">You have {todayClasses.filter(c => c.status === 'upcoming').length} upcoming classes today</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Subjects', value: stats?.stats?.totalSubjects || 4, icon: BookOpen, gradient: 'from-indigo-500 to-violet-600' },
          { title: "Today's Classes", value: todayClasses.length, icon: Calendar, gradient: 'from-violet-500 to-purple-600' },
          { title: 'Pending HW', value: stats?.stats?.pendingHomework || 2, icon: FileText, gradient: 'from-amber-500 to-orange-600' },
          { title: 'Attendance Rate', value: '91%', icon: ClipboardList, gradient: 'from-emerald-500 to-teal-600' },
        ].map((stat) => (
          <div key={stat.title} className="rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-[#334155] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Today&apos;s Schedule</h3>
          <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2.5 py-1 rounded-full">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long' })}
          </span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {todayClasses.map((cls, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-2 w-32 flex-shrink-0">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400">{cls.time}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{cls.subject}</p>
                <p className="text-xs text-slate-500">{cls.section} • {cls.room}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                cls.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                cls.status === 'ongoing' ? 'bg-indigo-50 text-indigo-700' :
                'bg-slate-100 text-slate-600'
              }`}>
                {cls.status === 'completed' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                {cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}
              </span>
              {cls.status === 'ongoing' && (
                <button className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 transition-opacity">
                  Take Attendance
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { title: 'Take Attendance', icon: ClipboardList, href: '/teacher/attendance', color: '#6366f1' },
          { title: 'Create Homework', icon: FileText, href: '/teacher/homework', color: '#8b5cf6' },
          { title: 'Upload Material', icon: BookOpen, href: '/teacher/materials', color: '#06b6d4' },
          { title: 'View Students', icon: Users, href: '/teacher/students', color: '#10b981' },
        ].map((action) => (
          <a key={action.title} href={action.href} className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${action.color}15` }}>
              <action.icon className="w-5 h-5" style={{ color: action.color }} />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{action.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
