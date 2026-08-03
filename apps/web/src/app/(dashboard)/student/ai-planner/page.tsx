'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen, Sparkles, Calendar, Clock, CheckCircle2,
  TrendingUp, RefreshCw, AlertCircle, Plus, Check, Search, Filter, Lightbulb
} from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

interface StudyTask {
  id: string;
  day: string;
  timeSlot: string;
  subject: string;
  topic: string;
  type: 'LEARN' | 'REVISE' | 'PRACTICE';
  completed: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export default function StudentAIPlannerPage() {
  // Input parameters
  const [examDate, setExamDate] = useState('2026-09-15');
  const [availableHours, setAvailableHours] = useState(4);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Data Structures & Algorithms', 'Database Management Systems', 'Operating Systems']);
  const [weakSubjects, setWeakSubjects] = useState<string[]>(['Operating Systems']);

  const [isGenerating, setIsGenerating] = useState(false);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [activeTab, setActiveTab] = useState<'DAILY' | 'REVISION' | 'PROGRESS'>('DAILY');
  const [currentTip, setCurrentTip] = useState('Break study sessions into 50-minute blocks with 10-minute active recovery breaks for maximum cognitive retention.');

  // Pre-seed sample plan if empty
  useEffect(() => {
    const savedPlan = localStorage.getItem('collegepes_ai_study_plan');
    if (savedPlan) {
      try {
        setTasks(JSON.parse(savedPlan));
      } catch {
        generatePlan();
      }
    } else {
      generatePlan();
    }
  }, []);

  const generatePlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated: StudyTask[] = [
        { id: 't-1', day: 'Monday', timeSlot: '07:00 PM - 08:30 PM', subject: 'Operating Systems', topic: 'Process Synchronization & Semaphores', type: 'LEARN', completed: true, priority: 'HIGH' },
        { id: 't-2', day: 'Monday', timeSlot: '08:45 PM - 10:00 PM', subject: 'Data Structures & Algorithms', topic: 'AVL Tree Double Rotations & Balance Factors', type: 'PRACTICE', completed: true, priority: 'HIGH' },
        { id: 't-3', day: 'Tuesday', timeSlot: '07:00 PM - 08:30 PM', subject: 'Database Management Systems', topic: 'BCNF Decomposition & 4NF Dependency', type: 'LEARN', completed: false, priority: 'MEDIUM' },
        { id: 't-4', day: 'Tuesday', timeSlot: '08:45 PM - 10:00 PM', subject: 'Operating Systems', topic: 'Bankers Algorithm for Deadlock Avoidance', type: 'PRACTICE', completed: false, priority: 'HIGH' },
        { id: 't-5', day: 'Wednesday', timeSlot: '07:00 PM - 08:30 PM', subject: 'Computer Networks', topic: 'TCP Sliding Window Protocol & Congestion Control', type: 'LEARN', completed: false, priority: 'MEDIUM' },
        { id: 't-6', day: 'Wednesday', timeSlot: '08:45 PM - 10:00 PM', subject: 'Operating Systems', topic: 'Virtual Memory & LRU Page Replacement', type: 'REVISE', completed: false, priority: 'HIGH' },
        { id: 't-7', day: 'Thursday', timeSlot: '07:00 PM - 08:30 PM', subject: 'Data Structures & Algorithms', topic: 'Graph Traversal (BFS/DFS) & Topological Sorting', type: 'PRACTICE', completed: false, priority: 'MEDIUM' },
        { id: 't-8', day: 'Friday', timeSlot: '06:00 PM - 08:00 PM', subject: 'Weekly Full Revision', topic: 'Mock Test on Weak Topics (OS & DBMS)', type: 'REVISE', completed: false, priority: 'HIGH' },
      ];
      setTasks(generated);
      localStorage.setItem('collegepes_ai_study_plan', JSON.stringify(generated));
      setIsGenerating(false);
    }, 600);
  };

  const toggleTaskCompleted = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    localStorage.setItem('collegepes_ai_study_plan', JSON.stringify(updated));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const radialData = [{ name: 'Progress', value: completionPercentage, fill: '#6366f1' }];

  const generateMotivationalTip = () => {
    const tips = [
      'Focus on active recall instead of passive reading. Test yourself every 20 minutes!',
      'Solve 3 previous year VTU questions daily on your weak subject to build exam confidence.',
      'Consistency outperforms intensity. 3 hours daily for 14 days beats 12 hours the night before.',
      'Group related concepts together: link OS Process Synchronization directly with DBMS Lock-based Concurrency!',
    ];
    setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-950 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-violet-300" /> AI Powered Learning System
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">AI Exam Study Planner</h1>
          <p className="text-violet-200 text-sm mt-1">Generates customized daily schedules, revision timelines, and weak area target plans</p>
        </div>
        <button
          onClick={generatePlan}
          disabled={isGenerating}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-950 font-bold text-sm hover:bg-violet-50 shadow-lg transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating AI Schedule...' : 'Regenerate Plan'}
        </button>
      </div>

      {/* Input Parameters Box */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" /> Planner Configuration Parameters
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Target Exam Date</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white border-0"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Daily Study Hours</label>
            <select
              value={availableHours}
              onChange={(e) => setAvailableHours(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white border-0"
            >
              <option value={2}>2 Hours / Day</option>
              <option value={4}>4 Hours / Day</option>
              <option value={6}>6 Hours / Day</option>
              <option value={8}>8 Hours / Day</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Pacing Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white border-0"
            >
              <option value="Easy">Easy (Relaxed)</option>
              <option value="Medium">Medium (Balanced)</option>
              <option value="Hard">Hard (Intensive)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Weak Subject Focus</label>
            <select
              value={weakSubjects[0] || 'Operating Systems'}
              onChange={(e) => setWeakSubjects([e.target.value])}
              className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white border-0"
            >
              <option value="Operating Systems">Operating Systems</option>
              <option value="Computer Networks">Computer Networks</option>
              <option value="Data Structures & Algorithms">Data Structures</option>
              <option value="Database Management Systems">Database Management</option>
            </select>
          </div>
        </div>
      </div>

      {/* Progress Gauge & Motivational Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radial Gauge */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Schedule Completion Rate</h3>
          <div className="w-44 h-44 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={radialData} startAngle={180} endAngle={0}>
                <RadialBar background dataKey="value" cornerRadius={12} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute text-center mt-4">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{completionPercentage}%</span>
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">{completedCount} of {totalCount} Done</span>
            </div>
          </div>
        </div>

        {/* Motivational Tips */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-900/60 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-500" /> AI Strategy Insight
              </span>
              <button
                onClick={generateMotivationalTip}
                className="px-3 py-1 rounded-xl bg-white dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 text-xs font-semibold hover:opacity-90 shadow-sm"
              >
                New Tip
              </button>
            </div>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-200 leading-relaxed italic">
              &quot;{currentTip}&quot;
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-indigo-900 dark:text-indigo-200 font-semibold pt-2 border-t border-indigo-200/60 dark:border-indigo-900">
            <span>High Priority Weak Area: <strong className="text-indigo-700 dark:text-indigo-400">{weakSubjects.join(', ')}</strong></span>
            <span>Target Exam: <strong>Sep 15, 2026</strong></span>
          </div>
        </div>
      </div>

      {/* Generated Tasks Checklist */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Generated Action Plan</h3>
          <span className="text-xs text-slate-500">Click checkboxes to update progress bar</span>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTaskCompleted(task.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-75'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-indigo-500 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                  task.completed
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {task.completed && <Check className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{task.day}</span>
                    <span className="text-xs text-slate-400">• {task.timeSlot}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      task.type === 'LEARN' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                      task.type === 'REVISE' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {task.type}
                    </span>
                  </div>
                  <h4 className={`text-sm font-bold mt-0.5 ${task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {task.subject}: {task.topic}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  task.priority === 'HIGH' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' : 'bg-slate-100 text-slate-600'
                }`}>
                  {task.priority} PRIORITY
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
