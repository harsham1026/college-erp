'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Check, AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react';

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

// Types for background particles
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  // Mouse tracker for full-screen spotlight & parallax
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for spring-based responsive parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for smooth 60fps movement
  const springX = useSpring(mouseX, { damping: 30, stiffness: 60 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 60 });

  // Spotlight follow coordinates relative to client
  const [spotlightCoords, setSpotlightCoords] = useState({ x: 0, y: 0 });

  // Floating background particles
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate random stars/particles once on mount
    const generated: Particle[] = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * -20,
    }));
    setParticles(generated);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Set spotlight coordinates relative to container
    setSpotlightCoords({ x: clientX - left, y: clientY - top });

    // Set normalized coordinates (-0.5 to 0.5) for parallax offsets
    const normX = (clientX - left) / width - 0.5;
    const normY = (clientY - top) / height - 0.5;
    
    mouseX.set(normX);
    mouseY.set(normY);
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
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full flex items-center justify-center bg-[#07090e] overflow-hidden text-slate-100 relative p-4"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      
      {/* 1. Full-screen Spotlight Layer */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(700px circle at ${spotlightCoords.x}px ${spotlightCoords.y}px, rgba(99, 102, 241, 0.08), transparent 75%)`,
        }}
      />

      {/* 2. Interactive Parallax Background Grid */}
      <motion.div 
        style={{
          x: springX.get() * -20,
          y: springY.get() * -20,
        }}
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] pointer-events-none -z-20"
      />

      {/* 3. Floating Continuous Animated Blobs */}
      <motion.div 
        animate={{
          x: [0, 80, -50, 0],
          y: [0, -70, 60, 0],
          scale: [1, 1.15, 0.9, 1]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          x: springX.get() * -45,
          y: springY.get() * -45,
        }}
        className="absolute top-[10%] left-[15%] w-[450px] h-[450px] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none -z-10"
      />

      <motion.div 
        animate={{
          x: [0, -60, 80, 0],
          y: [0, 90, -50, 0],
          scale: [1, 0.9, 1.2, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          x: springX.get() * -30,
          y: springY.get() * -30,
        }}
        className="absolute bottom-[15%] right-[10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[140px] pointer-events-none -z-10"
      />

      <motion.div 
        animate={{
          x: [0, 40, -40, 0],
          y: [0, 50, -60, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute top-[40%] right-[30%] w-[350px] h-[350px] rounded-full bg-pink-500/5 blur-[120px] pointer-events-none -z-10"
      />

      {/* 4. Floating Stars/Particles */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: `${p.y}%` }}
            animate={{
              opacity: [0, 0.6, 0.6, 0],
              y: [`${p.y}%`, `${p.y - 15}%`],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute bg-white rounded-full"
            style={{
              left: `${p.x}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              boxShadow: '0 0 10px rgba(255,255,255,0.8)',
            }}
          />
        ))}
      </div>

      {/* 5. Center Glassmorphic Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          // Subtle continuous card float
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }}
        style={{
          // Custom card parallax tilt
          x: springX.get() * 15,
          y: springY.get() * 15,
        }}
        className="w-full max-w-[450px] rounded-[24px] border border-white/[0.08] bg-[#0c101c]/65 backdrop-blur-2xl p-8 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.8)] overflow-hidden relative z-20 group"
      >
        
        {/* Soft neon line on card top border */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        {/* Top Branding Section */}
        <div className="flex flex-col items-center text-center mb-8">
          
          {/* Main Logo Container */}
          <motion.div 
            whileHover={{ scale: 1.08, rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 shadow-[0_8px_25px_rgba(99,102,241,0.35)] mb-4 cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </motion.div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            CollegePES ERP
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-medium">
            Welcome back! Sign in to continue.
          </p>
        </div>

        {/* Dynamic Error Alert */}
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

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Address */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest pl-0.5">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu"
                required
                className="w-full pl-11 pr-4 py-3 rounded-[14px] border border-white/5 bg-slate-950/50 text-slate-100 placeholder-slate-500 text-sm transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 group-hover:border-white/10"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center pl-0.5">
              <label className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                <Lock className="w-4.5 h-4.5" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-11 py-3 rounded-[14px] border border-white/5 bg-slate-950/50 text-slate-100 placeholder-slate-500 text-sm transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 group-hover:border-white/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-indigo-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-4.5 h-4.5 rounded-md border border-white/10 bg-slate-950/70 transition-colors peer-checked:bg-indigo-600 peer-checked:border-indigo-500 flex items-center justify-center group-hover:border-white/20" />
                <Check className="absolute w-3.5 h-3.5 text-white scale-0 transition-transform peer-checked:scale-100 pointer-events-none left-0.5 right-0.5 top-0.5 bottom-0.5 m-auto" />
              </div>
              <span className="text-xs sm:text-sm text-slate-400 font-medium group-hover:text-slate-300 transition-colors">
                Remember my account
              </span>
            </label>
          </div>

          {/* Premium Gradient Sign In Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.015, y: -2 }}
            whileTap={{ scale: 0.985, y: 0 }}
            className="w-full py-3.5 rounded-[14px] text-white font-bold text-sm tracking-wide transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 via-pink-500 to-indigo-500 hover:shadow-[0_8px_30px_rgba(99,102,241,0.35)] shadow-[0_0_20px_transparent] relative overflow-hidden"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <span>Verifying credentials...</span>
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
            Contact Admin
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
