'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen, Plus, Search, Filter, Download, Upload,
  Trash2, Edit, FileSpreadsheet, FileText, CheckCircle2
} from 'lucide-react';
import { INITIAL_QUESTION_BANK, QuestionBankItem } from '@/lib/teacherMockData';

export default function TeacherQuestionBankPage() {
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('ALL');

  // Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [qTextInput, setQTextInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('CS301');
  const [moduleInput, setModuleInput] = useState('Module 1');
  const [typeInput, setTypeInput] = useState<'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER'>('MCQ');
  const [difficultyInput, setDifficultyInput] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [marksInput, setMarksInput] = useState(2);
  const [answerInput, setAnswerInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuestions(INITIAL_QUESTION_BANK);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTextInput.trim()) return;

    const newQ: QuestionBankItem = {
      id: 'qb-' + Date.now(),
      subjectCode: subjectInput,
      subjectName: subjectInput === 'CS301' ? 'Data Structures' : 'DBMS',
      module: moduleInput,
      questionText: qTextInput,
      type: typeInput,
      correctAnswer: answerInput || 'Sample Correct Answer',
      difficulty: difficultyInput,
      marks: marksInput,
      createdDate: new Date().toISOString().substring(0, 10),
    };

    setQuestions([newQ, ...questions]);
    setIsCreateOpen(false);
    setQTextInput('');
    setAnswerInput('');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `Question_Bank_Export.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportJSON = () => {
    alert('Imported 5 additional questions from uploaded file.');
  };

  const filtered = questions.filter(q => {
    const matchesSearch = q.questionText.toLowerCase().includes(search.toLowerCase()) ||
                          q.subjectCode.toLowerCase().includes(search.toLowerCase());
    const matchesModule = moduleFilter === 'ALL' || q.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" /> Academic Question Repository
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Subject Question Bank</h1>
          <p className="text-indigo-200 text-sm mt-1">Manage module-wise questions, difficulty tags, and import/export exam papers</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={handleImportJSON} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all">
            <Upload className="w-4 h-4" /> Import Questions
          </button>
          <button onClick={handleExportJSON} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all">
            <Download className="w-4 h-4" /> Export Questions
          </button>
          <button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs shadow-md transition-all">
            <Plus className="w-4 h-4 text-indigo-700" /> Create Question
          </button>
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
            placeholder="Search questions..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white border-0"
          />
        </div>
        <select
          value={moduleFilter}
          onChange={e => setModuleFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 border-0"
        >
          <option value="ALL">All Modules</option>
          <option value="Module 1">Module 1</option>
          <option value="Module 2">Module 2</option>
          <option value="Module 3">Module 3</option>
          <option value="Module 4">Module 4</option>
        </select>
      </div>

      {/* Question List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
            Loading Question Bank...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
            No questions found.
          </div>
        ) : (
          filtered.map(q => (
            <div key={q.id} className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] space-y-3 hover:shadow-md transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {q.subjectCode} • {q.module}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800' :
                    q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {q.difficulty}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-500">{q.marks} Marks</span>
              </div>

              <h4 className="text-base font-semibold text-slate-900 dark:text-white leading-relaxed">{q.questionText}</h4>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">Answer/Key:</strong> {q.correctAnswer}
              </div>

              <div className="flex justify-end pt-1">
                <button onClick={() => setQuestions(prev => prev.filter(item => item.id !== q.id))} className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Delete Question
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleCreateSubmit} className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Question to Bank</h3>
              <button type="button" onClick={() => setIsCreateOpen(false)} className="p-2 text-slate-400 text-lg">✕</button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Question Prompt</label>
              <textarea rows={3} required value={qTextInput} onChange={e => setQTextInput(e.target.value)} placeholder="Type question text..." className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm text-slate-900 dark:text-white focus:outline-none" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Subject</label>
                <select value={subjectInput} onChange={e => setSubjectInput(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 border text-xs font-bold text-slate-900 dark:text-white">
                  <option value="CS301">CS301</option>
                  <option value="CS302">CS302</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Module</label>
                <select value={moduleInput} onChange={e => setModuleInput(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 border text-xs font-bold text-slate-900 dark:text-white">
                  <option value="Module 1">Module 1</option>
                  <option value="Module 2">Module 2</option>
                  <option value="Module 3">Module 3</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Difficulty</label>
                <select value={difficultyInput} onChange={e => setDifficultyInput(e.target.value as any)} className="w-full p-2.5 rounded-xl bg-slate-50 border text-xs font-bold text-slate-900 dark:text-white">
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Correct Answer / Key Solution</label>
              <input type="text" value={answerInput} onChange={e => setAnswerInput(e.target.value)} placeholder="Answer solution key..." className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm text-slate-900 dark:text-white" />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm">Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700">Save Question</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
