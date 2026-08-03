'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Building2,
  Calendar, ClipboardList, CreditCard, Library, Building,
  Bus, Briefcase, Bell, Settings, BarChart3, Shield,
  ChevronDown, ChevronLeft, ChevronRight, Menu, X,
  BookOpenCheck, FileText, UserCheck, Layers, Award,
  MessageSquare, HelpCircle, LogOut, Sun, Moon,
  School, GitBranch, Clock, Landmark, PenTool,
  Truck, Home, UserPlus, ScrollText, CircleDot,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  children?: NavItem[];
  badge?: string;
}

const adminNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  {
    title: 'Academic', href: '#', icon: School,
    children: [
      { title: 'Colleges', href: '/admin/academic/colleges', icon: Building2 },
      { title: 'Departments', href: '/admin/academic/departments', icon: Layers },
      { title: 'Courses', href: '/admin/academic/courses', icon: BookOpen },
      { title: 'Branches', href: '/admin/academic/branches', icon: GitBranch },
      { title: 'Semesters', href: '/admin/academic/semesters', icon: Clock },
      { title: 'Sections', href: '/admin/academic/sections', icon: CircleDot },
      { title: 'Subjects', href: '/admin/academic/subjects', icon: BookOpenCheck },
      { title: 'Timetable', href: '/admin/academic/timetable', icon: Calendar },
    ],
  },
  {
    title: 'People', href: '#', icon: Users,
    children: [
      { title: 'Teachers', href: '/admin/teachers', icon: UserCheck },
      { title: 'Students', href: '/admin/students', icon: GraduationCap },
      { title: 'Parents', href: '/admin/parents', icon: UserPlus },
    ],
  },
  {
    title: 'Academics', href: '#', icon: ClipboardList,
    children: [
      { title: 'Attendance', href: '/admin/attendance', icon: ClipboardList },
      { title: 'Exams', href: '/admin/exams', icon: FileText },
      { title: 'Results', href: '/admin/results', icon: Award },
    ],
  },
  {
    title: 'Finance', href: '#', icon: CreditCard,
    children: [
      { title: 'Fees', href: '/admin/fees', icon: CreditCard },
      { title: 'Scholarships', href: '/admin/scholarships', icon: Award },
    ],
  },
  { title: 'Library', href: '/admin/library', icon: Library },
  { title: 'Hostel', href: '/admin/hostel', icon: Building },
  { title: 'Transport', href: '/admin/transport', icon: Bus },
  { title: 'Placement', href: '/admin/placement', icon: Briefcase },
  { title: 'Events & Clubs', href: '/admin/events', icon: Calendar },
  {
    title: 'System', href: '#', icon: Settings,
    children: [
      { title: 'Users', href: '/admin/users', icon: Users },
      { title: 'Roles', href: '/admin/roles', icon: Shield },
      { title: 'Settings', href: '/admin/settings', icon: Settings },
      { title: 'Audit Logs', href: '/admin/audit-logs', icon: ScrollText },
      { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
];

const teacherNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
  { title: 'Attendance', href: '/teacher/attendance', icon: ClipboardList },
  { title: 'Homework', href: '/teacher/homework', icon: PenTool },
  { title: 'Assignments', href: '/teacher/assignments', icon: FileText },
  { title: 'Quiz', href: '/teacher/quiz', icon: HelpCircle },
  { title: 'Question Bank', href: '/teacher/question-bank', icon: BookOpen },
  { title: 'Materials', href: '/teacher/materials', icon: BookOpenCheck },
  { title: 'Students', href: '/teacher/students', icon: GraduationCap },
  { title: 'Marks', href: '/teacher/marks', icon: Award },
  { title: 'Reports', href: '/teacher/reports', icon: BarChart3 },
  { title: 'Announcements', href: '/teacher/announcements', icon: Bell },
  { title: 'Leave', href: '/teacher/leave', icon: Calendar },
  { title: 'Calendar', href: '/teacher/calendar', icon: Calendar },
  { title: 'Tasks', href: '/teacher/tasks', icon: ClipboardList },
];

const studentNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/student', icon: LayoutDashboard },
  { title: 'Attendance', href: '/student/attendance', icon: ClipboardList },
  { title: 'Homework', href: '/student/homework', icon: PenTool },
  { title: 'Assignments', href: '/student/assignments', icon: FileText },
  { title: 'Materials', href: '/student/materials', icon: BookOpenCheck },
  { title: 'Timetable', href: '/student/timetable', icon: Calendar },
  { title: 'Marks', href: '/student/marks', icon: Award },
  { title: 'Results', href: '/student/results', icon: BarChart3 },
  { title: 'Fees', href: '/student/fees', icon: CreditCard },
  { title: 'Placement', href: '/student/placement', icon: Briefcase },
  { title: 'AI Study Planner', href: '/student/ai-planner', icon: BookOpen, badge: 'AI' },
  { title: 'AI Chatbot', href: '/student/ai-chat', icon: MessageSquare, badge: 'AI' },
  { title: 'Resume Builder', href: '/student/resume', icon: FileText },
  { title: 'Achievements', href: '/student/achievements', icon: Award },
];

const principalNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/principal', icon: LayoutDashboard },
  ...adminNavItems.slice(1),
];

const navItemsByRole: Record<string, NavItem[]> = {
  SUPER_ADMIN: adminNavItems,
  PRINCIPAL: principalNavItems,
  VICE_PRINCIPAL: principalNavItems,
  HOD: adminNavItems,
  TEACHER: teacherNavItems,
  STUDENT: studentNavItems,
  PARENT: [
    { title: 'Dashboard', href: '/parent', icon: LayoutDashboard },
    { title: 'Attendance', href: '/parent/attendance', icon: ClipboardList },
    { title: 'Homework', href: '/parent/homework', icon: PenTool },
    { title: 'Marks', href: '/parent/marks', icon: Award },
    { title: 'Fees', href: '/parent/fees', icon: CreditCard },
    { title: 'Notifications', href: '/parent/notifications', icon: Bell },
  ],
  ACCOUNTANT: [
    { title: 'Dashboard', href: '/accountant', icon: LayoutDashboard },
    { title: 'Fee Collection', href: '/accountant/fees', icon: CreditCard },
    { title: 'Payments', href: '/accountant/payments', icon: Landmark },
    { title: 'Scholarships', href: '/accountant/scholarships', icon: Award },
    { title: 'Salary', href: '/accountant/salary', icon: Users },
    { title: 'Reports', href: '/accountant/reports', icon: BarChart3 },
  ],
  LIBRARIAN: [
    { title: 'Dashboard', href: '/librarian', icon: LayoutDashboard },
    { title: 'Books', href: '/librarian/books', icon: BookOpen },
    { title: 'Issue/Return', href: '/librarian/issues', icon: BookOpenCheck },
    { title: 'Reservations', href: '/librarian/reservations', icon: Calendar },
    { title: 'Fine', href: '/librarian/fines', icon: CreditCard },
  ],
  PLACEMENT_OFFICER: [
    { title: 'Dashboard', href: '/placement', icon: LayoutDashboard },
    { title: 'Companies', href: '/placement/companies', icon: Building2 },
    { title: 'Drives', href: '/placement/drives', icon: Briefcase },
    { title: 'Applications', href: '/placement/applications', icon: FileText },
    { title: 'Statistics', href: '/placement/statistics', icon: BarChart3 },
  ],
  HOSTEL_WARDEN: [
    { title: 'Dashboard', href: '/hostel', icon: LayoutDashboard },
    { title: 'Rooms', href: '/hostel/rooms', icon: Home },
    { title: 'Allocations', href: '/hostel/allocations', icon: Users },
    { title: 'Complaints', href: '/hostel/complaints', icon: MessageSquare },
  ],
  TRANSPORT_MANAGER: [
    { title: 'Dashboard', href: '/transport', icon: LayoutDashboard },
    { title: 'Buses', href: '/transport/buses', icon: Bus },
    { title: 'Routes', href: '/transport/routes', icon: Truck },
    { title: 'Drivers', href: '/transport/drivers', icon: Users },
  ],
  RECEPTIONIST: [
    { title: 'Dashboard', href: '/receptionist', icon: LayoutDashboard },
    { title: 'Visitors', href: '/receptionist/visitors', icon: Users },
  ],
  EXAM_CONTROLLER: [
    { title: 'Dashboard', href: '/exam-controller', icon: LayoutDashboard },
    { title: 'Exams', href: '/exam-controller/exams', icon: FileText },
    { title: 'Results', href: '/exam-controller/results', icon: Award },
    { title: 'Grade Calc', href: '/exam-controller/grades', icon: BarChart3 },
  ],
};

function NavItemComponent({ item, isCollapsed }: { item: NavItem; isCollapsed: boolean }) {
  const pathname = usePathname();
  const hasChildren = item.children && item.children.length > 0;
  const isChildActive = hasChildren && item.children!.some(child => pathname === child.href || pathname.startsWith(child.href + '/'));
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    if (isChildActive) {
      setIsOpen(true);
    }
  }, [isChildActive]);

  const isActive = pathname === item.href;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
            isChildActive ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
          )}
        >
          <item.icon className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">{item.title}</span>
              <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', isOpen && 'rotate-180')} />
            </>
          )}
        </button>
        {!isCollapsed && isOpen && (
          <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-slate-200 dark:border-slate-700 pl-3">
            {item.children!.map((child) => (
              <NavItemComponent key={child.href} item={child} isCollapsed={false} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
      )}
    >
      <item.icon className="w-5 h-5 flex-shrink-0" />
      {!isCollapsed && (
        <>
          <span className="flex-1">{item.title}</span>
          {item.badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-violet-500 to-indigo-500 text-white">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = navItemsByRole[user?.role || 'STUDENT'] || studentNavItems;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white shadow-lg dark:bg-slate-800"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300 ease-in-out',
          'bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-[#334155]',
          isCollapsed ? 'w-[72px]' : 'w-[280px]',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-slate-200 dark:border-[#334155]">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600">
                <GraduationCap className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 dark:text-white">CollegePES</h1>
                <p className="text-[10px] text-slate-500">Enterprise Platform</p>
              </div>
            </div>
          )}
          <button
            onClick={() => { setIsCollapsed(!isCollapsed); setIsMobileOpen(false); }}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
          {navItems.map((item) => (
            <NavItemComponent key={item.href + item.title} item={item} isCollapsed={isCollapsed} />
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-slate-200 dark:border-[#334155] p-3">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-slate-500 truncate">{user?.role?.replace(/_/g, ' ')}</p>
              </div>
              <button onClick={logout} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={logout} className="w-full flex justify-center p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500">
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
