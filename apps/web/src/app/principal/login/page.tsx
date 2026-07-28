'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import LoadingScreen from '@/components/LoadingScreen';

export default function PrincipalLoginPage() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(employeeId, password, 'PRINCIPAL');
      setShowLoadingScreen(true);
    } catch (err: any) {
      setError(err.message || 'Invalid Executive ID or password.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-white transition-colors duration-250 overflow-hidden relative p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AnimatePresence>
        {showLoadingScreen && (
          <LoadingScreen onComplete={() => router.push('/principal')} />
        )}
      </AnimatePresence>

      {/* Top Right Theme Toggle */}
      {mounted && (
        <div className="absolute top-6 right-6 z-30">
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2.5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
        </div>
      )}

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] rounded-[24px] border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1e293b] p-8 sm:p-10 shadow-xl relative z-20"
      >
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Portal Selection</span>
        </Link>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-md mb-4">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Principal Portal</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5 font-medium">
            Enter your Executive ID and password to view institutional performance.
          </p>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/45 border border-red-200 dark:border-red-500/25 text-red-700 dark:text-red-200 text-xs font-semibold flex items-start gap-2.5 shadow-sm"
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-amber-600 dark:text-amber-300 uppercase tracking-widest pl-0.5">
              Executive ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Briefcase className="w-4.5 h-4.5" />
              </div>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="e.g. PRN001"
                required
                className="w-full pl-11 pr-4 py-3 rounded-[14px] border border-slate-200 dark:border-[#334155] bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-250"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-amber-600 dark:text-amber-300 uppercase tracking-widest pl-0.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4.5 h-4.5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-11 py-3 rounded-[14px] border border-slate-200 dark:border-[#334155] bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-250"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-[14px] text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
