'use client';

import React, { useEffect, useState } from 'react';
import {
  Users, GraduationCap, BookOpen, Building2, CreditCard,
  TrendingUp, TrendingDown, ArrowUpRight, Clock, Activity,
} from 'lucide-react';
import api from '@/lib/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444'];

const attendanceData = [
  { day: 'Mon', present: 92, absent: 8 },
  { day: 'Tue', present: 88, absent: 12 },
  { day: 'Wed', present: 95, absent: 5 },
  { day: 'Thu', present: 91, absent: 9 },
  { day: 'Fri', present: 87, absent: 13 },
];

const feeData = [
  { month: 'Jan', collected: 85000, pending: 15000 },
  { month: 'Feb', collected: 92000, pending: 12000 },
  { month: 'Mar', collected: 78000, pending: 22000 },
  { month: 'Apr', collected: 95000, pending: 8000 },
  { month: 'May', collected: 88000, pending: 16000 },
  { month: 'Jun', collected: 91000, pending: 11000 },
];

const departmentData = [
  { name: 'CSE', students: 450, value: 450 },
  { name: 'ECE', students: 320, value: 320 },
  { name: 'ME', students: 280, value: 280 },
  { name: 'MBA', students: 180, value: 180 },
  { name: 'Civil', students: 150, value: 150 },
];

const enrollmentTrend = [
  { year: '2020', students: 2800 },
  { year: '2021', students: 3200 },
  { year: '2022', students: 3800 },
  { year: '2023', students: 4200 },
  { year: '2024', students: 4800 },
  { year: '2025', students: 5400 },
];

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  color: string;
  gradient: string;
}

function StatCard({ title, value, change, trend, icon: Icon, color, gradient }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
          <div className="flex items-center gap-1.5">
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
              {change}
            </span>
            <span className="text-xs text-slate-400">vs last month</span>
          </div>
        </div>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ background: gradient }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {/* Decorative gradient */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity" style={{ background: color }} />
    </div>
  );
}

function ChartCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#334155]">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function RecentActivityItem({ title, time, icon: Icon, color }: { title: string; time: string; icon: React.ElementType; color: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{title}</p>
        <p className="text-xs text-slate-400">{time}</p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-slate-400" />
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response: any = await api.get('/dashboard/admin');
        setStats(response.data);
      } catch (error) {
        // Use fallback data
        setStats({
          stats: {
            totalStudents: 4800,
            totalTeachers: 285,
            totalCourses: 42,
            totalDepartments: 12,
            totalFeeCollected: 24500000,
          },
        });
      }
    };
    fetchStats();
  }, []);

  const statsCards: StatCardProps[] = [
    {
      title: 'Total Students',
      value: stats?.stats?.totalStudents?.toLocaleString() || '4,800',
      change: '+12.5%',
      trend: 'up',
      icon: GraduationCap,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    },
    {
      title: 'Total Teachers',
      value: stats?.stats?.totalTeachers?.toLocaleString() || '285',
      change: '+4.2%',
      trend: 'up',
      icon: Users,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    },
    {
      title: 'Active Courses',
      value: stats?.stats?.totalCourses || '42',
      change: '+2.1%',
      trend: 'up',
      icon: BookOpen,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
    },
    {
      title: 'Fee Collected',
      value: `₹${((stats?.stats?.totalFeeCollected || 24500000) / 100000).toFixed(1)}L`,
      change: '+18.3%',
      trend: 'up',
      icon: CreditCard,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back! Here&apos;s your institution overview.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Attendance Chart */}
        <ChartCard
          title="Weekly Attendance"
          action={<span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-full">This Week</span>}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={attendanceData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                }}
              />
              <Bar dataKey="present" fill="#6366f1" radius={[6, 6, 0, 0]} name="Present %" />
              <Bar dataKey="absent" fill="#e2e8f0" radius={[6, 6, 0, 0]} name="Absent %" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Fee Collection Chart */}
        <ChartCard
          title="Fee Collection"
          action={<span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2.5 py-1 rounded-full">6 Months</span>}
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={feeData}>
              <defs>
                <linearGradient id="feeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="collected" stroke="#6366f1" fill="url(#feeGradient)" strokeWidth={2.5} name="Collected (₹)" />
              <Area type="monotone" dataKey="pending" stroke="#f59e0b" fill="transparent" strokeWidth={2} strokeDasharray="5 5" name="Pending (₹)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Department Distribution */}
        <ChartCard title="Department Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {departmentData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {departmentData.map((dept, index) => (
              <div key={dept.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[index] }} />
                <span className="text-xs text-slate-600 dark:text-slate-400">{dept.name} ({dept.students})</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Enrollment Trend */}
        <ChartCard title="Enrollment Trend">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={enrollmentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="students" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Recent Activity */}
        <ChartCard title="Recent Activity">
          <div className="space-y-0">
            <RecentActivityItem title="New student enrolled - Rahul Verma" time="2 min ago" icon={GraduationCap} color="#6366f1" />
            <RecentActivityItem title="Fee payment received - ₹45,000" time="15 min ago" icon={CreditCard} color="#10b981" />
            <RecentActivityItem title="Teacher joined - Dr. Priya Sharma" time="1 hour ago" icon={Users} color="#8b5cf6" />
            <RecentActivityItem title="New course added - B.Tech AI & ML" time="3 hours ago" icon={BookOpen} color="#06b6d4" />
            <RecentActivityItem title="Exam scheduled - Semester 3" time="5 hours ago" icon={Activity} color="#f59e0b" />
            <RecentActivityItem title="New department - Data Science" time="1 day ago" icon={Building2} color="#ef4444" />
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
