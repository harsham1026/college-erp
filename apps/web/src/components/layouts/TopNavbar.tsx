'use client';

import React from 'react';
import { Bell, Search, Sun, Moon, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export function TopNavbar() {
  const { user } = useAuth();
  const [isDark, setIsDark] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);

  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between h-full px-6">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search anything... (⌘K)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleDark}
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-900" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700/50 cursor-pointer transition-colors">
                      <p className="text-sm text-slate-900 dark:text-white">New announcement posted</p>
                      <p className="text-xs text-slate-500 mt-1">{i} hour ago</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 text-center">
                  <button className="text-xs font-medium text-indigo-600">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.firstName}</p>
                <p className="text-[10px] text-slate-500">{user?.role?.replace(/_/g, ' ')}</p>
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <div className="py-1.5">
                  <button className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <User className="w-4 h-4" /> Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
