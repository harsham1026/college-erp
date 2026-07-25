'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const MESSAGES = [
  { max: 15, text: 'Authenticating...' },
  { max: 35, text: 'Verifying Credentials...' },
  { max: 55, text: 'Loading User Profile...' },
  { max: 75, text: 'Fetching Dashboard...' },
  { max: 90, text: 'Preparing Workspace...' },
  { max: 100, text: 'Almost Ready...' }
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('Authenticating...');
  const [showSuccess, setShowSuccess] = useState(false);

  // Background floating particles state
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  useEffect(() => {
    // Generate particles
    const list = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1
    }));
    setParticles(list);
  }, []);

  // Update progress bar naturally over ~2.6 seconds
  useEffect(() => {
    const totalDuration = 2600; // 2.6s
    const intervalTime = 30; // ms
    const increment = 100 / (totalDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + increment, 100);
        if (next === 100) {
          clearInterval(timer);
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Update message based on progress
  useEffect(() => {
    const found = MESSAGES.find((m) => progress <= m.max);
    if (found && found.text !== currentMessage) {
      setCurrentMessage(found.text);
    }
  }, [progress, currentMessage]);

  // Handle success state and completion
  useEffect(() => {
    if (progress >= 100) {
      const successTimer = setTimeout(() => {
        setShowSuccess(true);
      }, 200);

      const completeTimer = setTimeout(() => {
        onComplete();
      }, 1200); // Wait 0.5s for success check + 0.5s fade out

      return () => {
        clearTimeout(successTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
        className="fixed inset-0 w-full h-full flex items-center justify-center bg-[#090b18] z-50 overflow-hidden select-none"
      >
        
        {/* Animated Background Gradients & Blobs */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#090B18] via-[#15193A] to-[#0C1024] -z-20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] opacity-30 -z-20" />

        {/* Floating background neon spheres */}
        <motion.div
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -50, 40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none -z-10"
        />

        <motion.div
          animate={{
            x: [0, -30, 40, 0],
            y: [0, 50, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[110px] pointer-events-none -z-10"
        />

        {/* Subtle moving star particles */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              animate={{
                y: ['0%', '-10%', '0%'],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{
                duration: 10 + p.id,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute bg-white/20 rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
              }}
            />
          ))}
        </div>

        {/* Center Container */}
        <div className="w-full max-w-[400px] p-6 flex flex-col items-center justify-center text-center">
          
          <AnimatePresence mode="wait">
            {!showSuccess ? (
              <motion.div
                key="loading-content"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.3 } }}
                className="flex flex-col items-center w-full"
              >
                {/* CollegePES Logo badge */}
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 shadow-[0_8px_25px_rgba(99,102,241,0.35)] mb-4"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </motion.div>

                <h1 className="text-xl font-bold tracking-tight text-white mb-1.5">
                  CollegePES ERP
                </h1>
                
                {/* Message display */}
                <div className="h-6 overflow-hidden mb-8">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentMessage}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 0.7, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs sm:text-sm text-slate-300 font-semibold"
                    >
                      {currentMessage}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Progress bar container */}
                <div className="w-[340px] h-[6px] bg-slate-950/60 rounded-full border border-white/5 overflow-hidden relative shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
                  {/* Glowing core bar */}
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-600 via-pink-500 to-indigo-500 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.7)]"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-content"
                initial={{ opacity: 0, scale: 0.85, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                className="flex flex-col items-center justify-center"
              >
                {/* Large animated green check circle */}
                <motion.div 
                  initial={{ rotate: -45, scale: 0.5 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 150 }}
                  className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)] mb-4"
                >
                  <Check className="w-7 h-7" strokeWidth={3} />
                </motion.div>

                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Welcome Back!
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-medium">Redirecting you securely...</p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
