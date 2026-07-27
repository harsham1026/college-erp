'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import LoadingScreen from '@/components/LoadingScreen';

export default function PrincipalLoginPage() {
  const [principalId, setPrincipalId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(principalId, password, 'PRINCIPAL');
      setShowLoadingScreen(true);
    } catch (err: any) {
      setError(err.message || 'Invalid Principal ID or password.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#07090e] overflow-hidden text-slate-100 relative p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AnimatePresence>
        {showLoadingScreen && (
          <LoadingScreen onComplete={() => router.push('/principal')} />
        )}
      </AnimatePresence>

      {/* Parallax Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] pointer-events-none -z-20" />

      {/* Floating Blobs */}
      <div className="absolute top-[15%] left-[15%] w-[450px] h-[450px] rounded-full bg-amber-600/10 blur-[130px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-[15%] right-[10%] w-[500px] h-[500px] rounded-full bg-orange-600/10 blur-[140px] pointer-events-none -z-10" />

      {/* Glassmorphic Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] rounded-[24px] border border-white/[0.08] bg-[#0c101c]/75 backdrop-blur-2xl p-8 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.8)] relative z-20"
      >
        {/* Top Highlight Line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Portal Selection</span>
        </Link>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-[0_8px_25px_rgba(245,158,11,0.35)] mb-4">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Principal Portal</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-medium">
            Enter your Principal ID or email for executive access.
          </p>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-950/45 border border-red-500/25 text-red-200 text-xs font-semibold flex items-start gap-2.5 shadow-md"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-amber-300 uppercase tracking-widest pl-0.5">
              Principal ID / Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Briefcase className="w-4.5 h-4.5" />
              </div>
              <input
                type="text"
                value={principalId}
                onChange={(e) => setPrincipalId(e.target.value)}
                placeholder="e.g. PRN001 or principal@college.edu"
                required
                className="w-full pl-11 pr-4 py-3 rounded-[14px] border border-white/5 bg-slate-950/50 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-amber-300 uppercase tracking-widest pl-0.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4.5 h-4.5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-11 py-3 rounded-[14px] border border-white/5 bg-slate-950/50 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-amber-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            className="w-full py-3.5 rounded-[14px] text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-[0_8px_30px_rgba(245,158,11,0.35)] transition-all duration-300 disabled:opacity-50"
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
