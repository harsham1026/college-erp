'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Forgot Password?</h2>
          <p className="text-sm text-slate-500 mt-2">Enter your email to receive a reset OTP</p>
        </div>

        {sent ? (
          <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 mx-auto mb-4 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Check your email</h3>
            <p className="text-sm text-slate-500 mt-2 mb-6">If an account exists for {email}, we&apos;ve sent a reset OTP.</p>
            <Link href="/login" className="text-sm font-medium" style={{ color: '#6366f1' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-slate-200 p-8">
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 border-0 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <button type="submit" disabled={isLoading} className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {isLoading ? 'Sending...' : 'Send Reset OTP'}
              </button>
            </form>
            <p className="text-center text-sm text-slate-500 mt-6">
              Remember your password?{' '}
              <Link href="/login" className="font-semibold" style={{ color: '#6366f1' }}>Sign In</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
