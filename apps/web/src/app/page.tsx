'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { GraduationCap, UserCheck, Shield, Briefcase, ArrowRight, Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const PORTALS = [
  {
    id: 'student',
    title: 'Student Portal',
    icon: GraduationCap,
    description: 'Access attendance, timetable, assignments, fees, exams, results and profile.',
    buttonText: 'Continue',
    route: '/student/login',
    badge: 'Student Access',
    color: 'from-cyan-500 to-blue-600',
    glowColor: 'rgba(6, 182, 212, 0.15)',
    buttonBg: 'bg-gradient-to-r from-cyan-500 to-blue-600',
  },
  {
    id: 'teacher',
    title: 'Teacher Portal',
    icon: UserCheck,
    description: 'Manage attendance, classes, timetable, assignments and marks.',
    buttonText: 'Continue',
    route: '/teacher/login',
    badge: 'Faculty Portal',
    color: 'from-violet-500 to-purple-600',
    glowColor: 'rgba(139, 92, 246, 0.15)',
    buttonBg: 'bg-gradient-to-r from-violet-500 to-purple-600',
  },
  {
    id: 'admin',
    title: 'Admin Portal',
    icon: Shield,
    description: 'Manage students, teachers, departments, courses, finance and complete ERP settings.',
    buttonText: 'Continue',
    route: '/admin/login',
    badge: 'System Admin',
    color: 'from-indigo-500 to-violet-600',
    glowColor: 'rgba(99, 102, 241, 0.15)',
    buttonBg: 'bg-gradient-to-r from-indigo-500 to-violet-600',
  },
  {
    id: 'principal',
    title: 'Principal Portal',
    icon: Briefcase,
    description: 'View reports, analytics, approvals and institutional performance.',
    buttonText: 'Continue',
    route: '/principal/login',
    badge: 'Executive Oversight',
    color: 'from-amber-500 to-orange-600',
    glowColor: 'rgba(245, 158, 11, 0.15)',
    buttonBg: 'bg-gradient-to-r from-amber-500 to-orange-600',
  },
];

export default function PortalSelectionPage() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 30, stiffness: 60 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 60 });

  const [spotlightCoords, setSpotlightCoords] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setMounted(true);
    const generated: Particle[] = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 18 + 10,
      delay: Math.random() * -20,
    }));
    setParticles(generated);
  }, []);

  const isDark = resolvedTheme === 'dark';

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    setSpotlightCoords({ x: clientX - left, y: clientY - top });

    const normX = (clientX - left) / width - 0.5;
    const normY = (clientY - top) / height - 0.5;
    
    mouseX.set(normX);
    mouseY.set(normY);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full flex flex-col justify-between bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-white transition-colors duration-250 relative overflow-hidden p-4 sm:p-8"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* 1. Full-screen Spotlight Layer */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(800px circle at ${spotlightCoords.x}px ${spotlightCoords.y}px, rgba(99, 102, 241, 0.08), transparent 75%)`,
        }}
      />

      {/* 2. Background Grid */}
      <motion.div
        style={{
          x: springX.get() * -20,
          y: springY.get() * -20,
        }}
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] pointer-events-none -z-20"
      />

      {/* Top Header / Branding Navbar */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between py-4 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-md">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">CollegePES ERP</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-[#334155] shadow-sm text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Unified Campus Management</span>
          </div>

          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2.5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto py-12 z-20 space-y-12">
        {/* Title Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            Choose Your Portal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium"
          >
            Select your administrative or academic portal to access your dashboard.
          </motion.p>
        </div>

        {/* 4 Large Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {PORTALS.map((portal, index) => {
            const Icon = portal.icon;
            return (
              <motion.div
                key={portal.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + index * 0.1 }}
                whileHover={{ y: -6, scale: 1.01 }}
                onClick={() => router.push(portal.route)}
                className="group cursor-pointer rounded-[24px] border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1e293b] p-7 flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl relative overflow-hidden"
              >
                <div className="space-y-6 relative z-10">
                  {/* Icon & Badge Header */}
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${portal.color} flex items-center justify-center shadow-md transform group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      {portal.badge}
                    </span>
                  </div>

                  {/* Card Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {portal.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-normal min-h-[50px]">
                      {portal.description}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 relative z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(portal.route);
                    }}
                    className={`w-full py-3 px-4 rounded-[14px] text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 ${portal.buttonBg} transition-all duration-300 shadow-md hover:opacity-90`}
                  >
                    <span>{portal.buttonText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto text-center py-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 z-20">
        © {new Date().getFullYear()} CollegePES ERP Systems. All rights reserved. Secured Enterprise Authentication.
      </footer>
    </div>
  );
}
