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
      }, 1200);

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
        className="fixed inset-0 w-full h-full flex items-center justify-center bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-white transition-colors duration-250 z-50 overflow-hidden select-none"
      >
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 via-indigo-50/50 to-slate-100 dark:from-[#090B18] dark:via-[#15193A] dark:to-[#0C1024] -z-20" />
        
        {/* Floating Background Blobs */}
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
          className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none -z-10"
        />

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
                  className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 shadow-md mb-4"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </motion.div>

                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-1.5">
                  CollegePES ERP
                </h1>
                
                {/* Message display */}
                <div className="h-6 overflow-hidden mb-8">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentMessage}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 0.8, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold"
                    >
                      {currentMessage}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Progress bar container */}
                <div className="w-[340px] h-[6px] bg-slate-200 dark:bg-slate-950/60 rounded-full border border-slate-300 dark:border-white/5 overflow-hidden relative shadow-inner">
                  {/* Glowing core bar */}
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-600 via-pink-500 to-indigo-500 rounded-full shadow-md"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-content"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                className="flex flex-col items-center justify-center"
              >
                {/* Check icon */}
                <motion.div 
                  initial={{ rotate: -45, scale: 0.5 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 150 }}
                  className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-md mb-4"
                >
                  <Check className="w-7 h-7" strokeWidth={3} />
                </motion.div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Welcome Back!
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Redirecting you securely...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
