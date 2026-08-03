'use client';

import React, { useState, useEffect } from 'react';
import {
  ClipboardList, Plus, CheckCircle2, Clock, Check, Search, Filter,
  Trash2, AlertCircle, Bell, Sparkles
} from 'lucide-react';
import { INITIAL_TEACHER_TASKS, TeacherTaskItem } from '@/lib/teacherMockData';

export default function TeacherTasksPage() {
  const [tasks, setTasks] = useState<TeacherTaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [priorityInput, setPriorityInput] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [dueDateInput, setDueDateInput] = useState('2026-08-08');
  const [categoryInput, setCategoryInput] = useState<TeacherTaskItem['category']>('Grading');

  useEffect(() => {
    const timer = setTimeout(() => {
      setTasks(INITIAL_TEACHER_TASKS);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;

    const newTask: TeacherTaskItem = {
      id: 'tsk-' + Date.now(),
      title: titleInput,
      priority: priorityInput,
      dueDate: dueDateInput,
      category: categoryInput,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setIsCreateOpen(false);
    setTitleInput('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-950 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <ClipboardList className="w-4 h-4" /> Personal Productivity
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Faculty Task Checklist</h1>
          <p className="text-violet-200 text-sm mt-1">Manage exam grading tasks, paper preparation, and department administrative deadlines</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-950 font-bold text-sm hover:bg-violet-50 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 text-indigo-700" /> Create Task
        </button>
      </div>

      {/* Progress & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completion Rate</p>
          <h3 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{progressPercent}%</h3>
          <p className="text-xs text-slate-500 mt-1">{completedCount} of {totalCount} Tasks Done</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">High Priority Pending</p>
          <h3 className="text-3xl font-extrabold text-red-600 dark:text-red-400 mt-1">
            {tasks.filter(t => !t.completed && t.priority === 'HIGH').length}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Urgent Attention Needed</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Notifications</p>
          <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">Active</h3>
          <p className="text-xs text-slate-500 mt-1">Reminders Enabled</p>
        </div>
      </div>

      {/* Filter */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search task title..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white border-0"
          />
        </div>
        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 border-0"
        >
          <option value="ALL">All Priorities</option>
          <option value="HIGH">High Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="LOW">Low Priority</option>
        </select>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
            Loading tasks...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-slate-500 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
            No tasks found.
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-70'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-500 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                  task.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {task.completed && <Check className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{task.category}</span>
                    <span className="text-xs text-slate-400">• Due {task.dueDate}</span>
                  </div>
                  <h4 className={`text-base font-bold mt-0.5 ${task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {task.title}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  task.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {task.priority}
                </span>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }} className="p-1.5 text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleCreateSubmit} className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Task</h3>
              <button type="button" onClick={() => setIsCreateOpen(false)} className="p-2 text-slate-400 text-lg">✕</button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Task Description</label>
              <input type="text" required value={titleInput} onChange={e => setTitleInput(e.target.value)} placeholder="e.g. Grade CSE-A Midterm Papers" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm text-slate-900 dark:text-white" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Priority</label>
                <select value={priorityInput} onChange={e => setPriorityInput(e.target.value as any)} className="w-full p-2.5 rounded-xl bg-slate-50 border text-xs font-bold text-slate-900 dark:text-white">
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Category</label>
                <select value={categoryInput} onChange={e => setCategoryInput(e.target.value as any)} className="w-full p-2.5 rounded-xl bg-slate-50 border text-xs font-bold text-slate-900 dark:text-white">
                  <option value="Grading">Grading</option>
                  <option value="Preparation">Preparation</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Meeting">Meeting</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Due Date</label>
                <input type="date" value={dueDateInput} onChange={e => setDueDateInput(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 border text-xs font-bold text-slate-900 dark:text-white" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm">Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700">Save Task</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
