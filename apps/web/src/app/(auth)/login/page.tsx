'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const ROLE_ROUTES: Record<string, string> = {
  SUPER_ADMIN: '/admin',
  PRINCIPAL: '/principal',
  VICE_PRINCIPAL: '/principal',
  HOD: '/hod',
  TEACHER: '/teacher',
  STUDENT: '/student',
  PARENT: '/parent',
  ACCOUNTANT: '/accountant',
  LIBRARIAN: '/librarian',
  PLACEMENT_OFFICER: '/placement',
  HOSTEL_WARDEN: '/hostel',
  TRANSPORT_MANAGER: '/transport',
  RECEPTIONIST: '/receptionist',
  EXAM_CONTROLLER: '/exam-controller',
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password, rememberMe);
      if (result.requiresTwoFactor) {
        router.push(`/two-factor?token=${result.tempToken}`);
        return;
      }
      const role = result.user?.role || 'STUDENT';
      router.push(ROLE_ROUTES[role] || '/student');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      }}>
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-20 animate-pulse" style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute bottom-32 right-16 w-96 h-96 rounded-full opacity-15 animate-pulse" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full opacity-10 animate-pulse" style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', animationDelay: '2s' }} />

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">College ERP</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6" style={{ letterSpacing: '-0.025em' }}>
            Smart Campus<br />
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Management
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-md leading-relaxed">
            AI-powered enterprise resource planning for modern educational institutions. Manage academics, finance, placements, and more — all in one place.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mt-10">
            {['AI Powered', '14 Roles', 'Real-time Analytics', 'Secure'].map((feature) => (
              <span key={feature} className="px-4 py-2 rounded-full text-sm font-medium border border-slate-700 text-slate-300" style={{ backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.05)' }}>
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: '#fafbfc' }}>
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900">College ERP</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-2" style={{ letterSpacing: '-0.025em' }}>Welcome back</h2>
          <p className="text-slate-500 mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl text-sm font-medium" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border text-slate-900 placeholder-slate-400 transition-all duration-200 text-sm focus:outline-none focus:ring-2"
                  style={{ background: 'white', borderColor: '#e2e8f0', focusRingColor: '#6366f1' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border text-slate-900 placeholder-slate-400 transition-all duration-200 text-sm focus:outline-none focus:ring-2"
                  style={{ background: 'white', borderColor: '#e2e8f0' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300"
                  style={{ accentColor: '#6366f1' }}
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm font-medium" style={{ color: '#6366f1' }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Google Login */}
          <button className="w-full py-3.5 rounded-xl border font-medium text-sm text-slate-700 flex items-center justify-center gap-3 transition-all duration-200 hover:bg-slate-50" style={{ borderColor: '#e2e8f0' }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-slate-500 mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold" style={{ color: '#6366f1' }}>
              Contact Admin
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 rounded-xl border" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">Quick Login</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Admin', email: 'admin@collegeerp.com', pwd: 'Admin@123', color: '#6366f1' },
                { label: 'Teacher', email: 'priya.sharma@collegeerp.com', pwd: 'Teacher@123', color: '#8b5cf6' },
                { label: 'Student', email: 'rahul.verma@student.collegeerp.com', pwd: 'Student@123', color: '#06b6d4' },
                { label: 'Principal', email: 'principal@collegeerp.com', pwd: 'Principal@123', color: '#f59e0b' },
              ].map((demo) => (
                <button
                  key={demo.label}
                  type="button"
                  onClick={() => fillDemo(demo.email, demo.pwd)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-white transition-all duration-200 hover:opacity-90"
                  style={{ background: demo.color }}
                >
                  {demo.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
