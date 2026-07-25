'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Check, AlertCircle, ArrowRight, ShieldCheck, Database, BarChart3, LockKeyhole } from 'lucide-react';

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

// SVG Animated Flapping Bird Component
const AnimatedBird = ({ delay = 0, duration = 15, startY = 80, scale = 0.6 }) => (
  <motion.div
    initial={{ x: '-10%', y: startY, scale: 0, opacity: 0 }}
    animate={{
      x: '110%',
      y: [startY, startY - 25, startY + 15, startY],
      scale: [scale * 0.8, scale * 1.1, scale * 1.1, scale * 0.8],
      opacity: [0, 0.7, 0.7, 0]
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'linear'
    }}
    className="absolute pointer-events-none z-10"
  >
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-violet-400/40">
      <motion.path
        d="M2 14 Q6 8, 12 14 Q18 8, 22 14"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ 
          d: [
            "M2 14 Q6 6, 12 14 Q18 6, 22 14", 
            "M2 17 Q6 21, 12 17 Q18 21, 22 17",
            "M2 14 Q6 6, 12 14 Q18 6, 22 14"
          ] 
        }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
      />
    </svg>
  </motion.div>
);

// SVG Floating Cloud Component
const FloatingCloud = ({ delay = 0, duration = 45, scale = 1, startY = 40 }) => (
  <motion.div
    initial={{ x: '110%', y: startY, scale, opacity: 0 }}
    animate={{
      x: '-20%',
      opacity: [0, 0.3, 0.3, 0]
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'linear'
    }}
    className="absolute pointer-events-none z-10"
  >
    <svg width="150" height="90" viewBox="0 0 120 80" fill="currentColor" className="text-indigo-400/10">
      <path d="M20 60 A20 20 0 0 1 50 40 A25 25 0 0 1 95 45 A20 20 0 0 1 100 60 A15 15 0 0 1 85 75 L30 75 A15 15 0 0 1 20 60 Z" />
    </svg>
  </motion.div>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  // Spotlight coordinates on card hover
  const [cardCoords, setCardCoords] = useState({ x: 0, y: 0 });
  const [isCardHovered, setIsCardHovered] = useState(false);

  // Parallax coordinates reacting to container mouse hover
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setParallaxOffset({ x, y });
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    setCardCoords({ x: clientX - left, y: clientY - top });
  };

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

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full flex flex-col lg:flex-row bg-[#080b11] overflow-hidden text-slate-100 relative"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Background neon grids/glows across the page */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111622_1px,transparent_1px),linear-gradient(to_bottom,#111622_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      {/* LEFT SIDE - Landscape Illustration & Welcome Section */}
      <div className="h-[45vh] lg:h-screen lg:w-1/2 relative overflow-hidden flex flex-col justify-between p-6 lg:p-16 border-b border-indigo-950/20 lg:border-b-0 lg:border-r border-indigo-950/30">
        
        {/* Parallax Landscape Layers */}
        <div className="absolute inset-0 select-none pointer-events-none z-0">
          
          {/* Layer 1: Sky Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f19] via-[#150f2b] to-[#1d143c]" />

          {/* Layer 2: Glowing Sun (Interactive Parallax) */}
          <motion.div 
            animate={{
              x: parallaxOffset.x * -15,
              y: parallaxOffset.y * -15
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 80 }}
            className="absolute top-[25%] left-[45%] lg:top-[30%] lg:left-[40%] w-48 h-48 lg:w-64 lg:h-64 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(99, 102, 241, 0.1) 40%, transparent 75%)',
            }}
          >
            {/* Inner Core Sun */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-400 shadow-[0_0_60px_rgba(168,85,247,0.6)]" />
          </motion.div>

          {/* Floating Clouds */}
          <FloatingCloud startY={30} delay={0} duration={60} scale={0.7} />
          <FloatingCloud startY={60} delay={15} duration={75} scale={1.1} />
          <FloatingCloud startY={120} delay={30} duration={50} scale={0.9} />

          {/* Animated Birds */}
          <AnimatedBird startY={70} delay={3} duration={14} scale={0.5} />
          <AnimatedBird startY={120} delay={8} duration={18} scale={0.7} />

          {/* Layer 3: Back Peaks (Far Mountains) */}
          <motion.svg 
            animate={{
              x: parallaxOffset.x * -8,
              y: parallaxOffset.y * -8
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 80 }}
            viewBox="0 0 1000 400" 
            className="absolute bottom-[10%] left-0 w-full h-[60%] text-[#14122d]/60 fill-current"
            preserveAspectRatio="none"
          >
            <path d="M0 260 L120 180 L250 240 L380 150 L520 220 L680 140 L820 230 L940 160 L1000 200 L1000 400 L0 400 Z" />
          </motion.svg>

          {/* Layer 4: Mid Peaks (Middle Mountains with Glowing Grid-lines) */}
          <motion.svg 
            animate={{
              x: parallaxOffset.x * -16,
              y: parallaxOffset.y * -16
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 80 }}
            viewBox="0 0 1000 400" 
            className="absolute bottom-[4%] left-0 w-full h-[55%] text-[#0d0a1d] fill-current stroke-violet-500/10 stroke-[1.5]"
            preserveAspectRatio="none"
          >
            <path d="M0 300 L150 210 L300 290 L450 180 L620 270 L780 190 L920 260 L1000 220 L1000 400 L0 400 Z" />
          </motion.svg>

          {/* Layer 5: Front Horizon Waves (Foreground Grid/Synthwave Net) */}
          <motion.div 
            animate={{
              x: parallaxOffset.x * -24,
              y: parallaxOffset.y * -24
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 80 }}
            className="absolute bottom-0 left-0 w-full h-[30%] z-20 pointer-events-none"
          >
            <svg viewBox="0 0 1000 120" className="w-full h-full text-[#07050e] fill-current" preserveAspectRatio="none">
              {/* Neon horizon grid glow line */}
              <path d="M0 60 Q250 10, 500 60 T1000 60 L1000 120 L0 120 Z" />
              <path d="M0 60 Q250 10, 500 60 T1000 60" fill="none" stroke="url(#wave-gradient)" strokeWidth="3" className="opacity-70" />
              <defs>
                <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

        </div>

        {/* Branding & Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <span className="text-xl lg:text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            CollegePES
          </span>
        </motion.div>

        {/* Welcome Messages (Title & Subtitle) */}
        <div className="relative z-10 flex flex-col justify-end lg:mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white mb-3"
          >
            Welcome to <br className="hidden lg:block" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              CollegePES ERP
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm lg:text-lg text-slate-300 max-w-md font-medium"
          >
            Smart Campus Management System
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="hidden lg:block text-sm text-slate-400 max-w-sm mt-3 leading-relaxed"
          >
            Empowering students, parents, teachers, and admins with a unified, real-time administrative intelligence suite.
          </motion.p>

          {/* Feature Pills */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden lg:flex flex-wrap gap-2 mt-8 z-10"
          >
            {[
              { label: 'AI Powered', icon: <SparklesIcon className="w-3.5 h-3.5" /> },
              { label: '14 Enterprise Roles', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
              { label: 'Real-time Metrics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
              { label: 'Secure Architecture', icon: <Database className="w-3.5 h-3.5" /> }
            ].map((feat) => (
              <div 
                key={feat.label} 
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold border border-indigo-500/20 bg-indigo-950/20 backdrop-blur-md text-indigo-200 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
              >
                {feat.icon}
                {feat.label}
              </div>
            ))}
          </motion.div>
        </div>

      </div>

      {/* RIGHT SIDE - Premium Glassmorphic Login Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-16 z-10 relative">
        <div className="w-full max-w-md relative">
          
          {/* Back glows behind card */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 blur-2xl -z-10" />

          {/* Glass Card Container */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            onMouseMove={handleCardMouseMove}
            onMouseEnter={() => setIsCardHovered(true)}
            onMouseLeave={() => setIsCardHovered(false)}
            className="rounded-[24px] border border-white/10 bg-[#0d1321]/70 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative"
          >
            {/* Card Spotlight Border & Glow Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 -z-10"
              style={{
                background: isCardHovered 
                  ? `radial-gradient(350px circle at ${cardCoords.x}px ${cardCoords.y}px, rgba(99, 102, 241, 0.12), transparent 75%)` 
                  : 'none',
                opacity: isCardHovered ? 1 : 0
              }}
            />

            {/* Title block */}
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center lg:justify-start gap-2">
                Sign In
              </h2>
              <p className="text-slate-400 text-sm mt-1">Enter your admin, staff, or student credentials</p>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-sm font-semibold flex items-start gap-2.5 shadow-inner"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider pl-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-400 text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@college.edu"
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-[16px] border border-white/5 bg-slate-950/40 text-slate-100 placeholder-slate-500 text-sm transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 group-hover:border-white/10"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center pl-1">
                  <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Password</label>
                  <Link href="/forgot-password" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-400 text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3.5 rounded-[16px] border border-white/5 bg-slate-950/40 text-slate-100 placeholder-slate-500 text-sm transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 group-hover:border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 rounded-md border border-white/10 bg-slate-950/60 transition-colors peer-checked:bg-indigo-600 peer-checked:border-indigo-500 flex items-center justify-center" />
                    <Check className="absolute w-3.5 h-3.5 text-white scale-0 transition-transform peer-checked:scale-100 pointer-events-none left-0.5 right-0.5 top-0.5 bottom-0.5 m-auto" />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-400 font-medium hover:text-slate-300 transition-colors">Remember my account</span>
                </label>
              </div>

              {/* Gradient Sign In Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-4 rounded-[16px] text-white font-bold text-sm tracking-wide transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-lg hover:shadow-indigo-500/20 relative overflow-hidden"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    <span>Verifying Identity...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer Admin Link */}
            <div className="text-center mt-8">
              <span className="text-xs text-slate-500">Need credentials? </span>
              <Link href="/register" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-400/40 hover:decoration-indigo-400 transition-colors">
                Contact Administration Office
              </Link>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Simple Sparkles SVG Icon replacement for clean imports
function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z" opacity="0.6" />
      <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" opacity="0.6" />
    </svg>
  );
}
