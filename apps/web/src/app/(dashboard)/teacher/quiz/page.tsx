'use client';

import React, { useState, useEffect } from 'react';
import {
  HelpCircle, Plus, Search, Filter, Clock, Award, CheckCircle2,
  Trophy, Trash2, Eye, FileText, Sparkles
} from 'lucide-react';
import { INITIAL_TEACHER_QUIZZES, TeacherQuizItem, QuizQuestion } from '@/lib/teacherMockData';

export default function TeacherQuizPage() {
  const [quizzes, setQuizzes] = useState<TeacherQuizItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [leaderboardItem, setLeaderboardItem] = useState<TeacherQuizItem | null>(null);

  // Form states
  const [titleInput, setTitleInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('CS301');
  const [sectionInput, setSectionInput] = useState('CSE-A');
  const [timeLimitInput, setTimeLimitInput] = useState(20);
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    { id: 'q-101', questionText: 'What is the balance factor of an AVL tree node?', type: 'MCQ', options: ['-1, 0, +1', '-2, 0, +2', '0, 1, 2', 'Unlimited'], correctAnswer: '-1, 0, +1', marks: 2 },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuizzes(INITIAL_TEACHER_QUIZZES);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;

    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    const newQuiz: TeacherQuizItem = {
      id: 'quiz-' + Date.now(),
      title: titleInput,
      subjectCode: subjectInput,
      subjectName: subjectInput === 'CS301' ? 'Data Structures' : 'DBMS',
      section: sectionInput,
      timeLimitMins: timeLimitInput,
      totalMarks,
      assignedDate: new Date().toISOString().substring(0, 10),
      status: 'ACTIVE',
      questions,
      leaderboard: [],
    };

    setQuizzes([newQuiz, ...quizzes]);
    setIsCreateOpen(false);
    setTitleInput('');
  };

  const handleAddQuestion = () => {
    const newQ: QuizQuestion = {
      id: 'q-' + Date.now(),
      questionText: 'Sample quiz question prompt?',
      type: 'MCQ',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A',
      marks: 2,
    };
    setQuestions([...questions, newQ]);
  };

  const filteredQuizzes = quizzes.filter(q =>
    q.title.toLowerCase().includes(search.toLowerCase()) ||
    q.subjectCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-violet-900 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4" /> Interactive Quiz Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Quiz Management & Evaluation</h1>
          <p className="text-purple-200 text-sm mt-1">Design MCQs, True/False, and short answer quizzes with automatic grading & leaderboards</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-purple-950 font-bold text-sm hover:bg-purple-50 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 text-purple-700" /> Create Quiz
        </button>
      </div>

      {/* Filter */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search quizzes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white border-0"
          />
        </div>
      </div>

      {/* Quiz Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full p-12 text-center text-slate-500">Loading quizzes...</div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500">No quizzes found.</div>
        ) : (
          filteredQuizzes.map(quiz => (
            <div key={quiz.id} className="p-6 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] shadow-sm hover:shadow-xl transition-all space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2.5 py-0.5 rounded-md">
                    {quiz.subjectCode} • {quiz.section}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{quiz.title}</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {quiz.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-indigo-500" /> {quiz.timeLimitMins} Mins</span>
                <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-purple-500" /> {quiz.questions.length} Questions</span>
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-500" /> {quiz.totalMarks} Marks</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setLeaderboardItem(quiz)}
                  className="px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs hover:bg-purple-100 flex items-center gap-1.5"
                >
                  <Trophy className="w-4 h-4 text-amber-500" /> Leaderboard & Scores
                </button>
                <button
                  onClick={() => setQuizzes(prev => prev.filter(q => q.id !== quiz.id))}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Quiz Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleCreateSubmit} className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Quiz</h3>
              <button type="button" onClick={() => setIsCreateOpen(false)} className="p-2 text-slate-400 text-lg">✕</button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Quiz Title</label>
              <input
                type="text"
                required
                value={titleInput}
                onChange={e => setTitleInput(e.target.value)}
                placeholder="e.g. Tree Traversal & BST Quiz"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Subject</label>
                <select value={subjectInput} onChange={e => setSubjectInput(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-xs font-bold text-slate-900 dark:text-white">
                  <option value="CS301">CS301</option>
                  <option value="CS302">CS302</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Section</label>
                <select value={sectionInput} onChange={e => setSectionInput(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-xs font-bold text-slate-900 dark:text-white">
                  <option value="CSE-A">CSE-A</option>
                  <option value="CSE-B">CSE-B</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Time Limit (Mins)</label>
                <input type="number" value={timeLimitInput} onChange={e => setTimeLimitInput(Number(e.target.value))} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-xs font-bold text-slate-900 dark:text-white" />
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quiz Questions ({questions.length})</h4>
                <button type="button" onClick={handleAddQuestion} className="text-xs font-bold text-purple-600 flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Question
                </button>
              </div>

              {questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-2 border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-purple-600">Question #{idx + 1}</span>
                    <span className="font-semibold text-slate-500">{q.type} • {q.marks} Marks</span>
                  </div>
                  <input
                    type="text"
                    value={q.questionText}
                    onChange={e => {
                      const val = e.target.value;
                      setQuestions(prev => prev.map(item => item.id === q.id ? { ...item, questionText: val } : item));
                    }}
                    className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm">Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-sm shadow-md hover:bg-purple-700">Publish Quiz</button>
            </div>
          </form>
        </div>
      )}

      {/* Leaderboard Modal */}
      {leaderboardItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> {leaderboardItem.title} Scores
              </h3>
              <button onClick={() => setLeaderboardItem(null)} className="p-2 text-slate-400 text-lg">✕</button>
            </div>

            <div className="space-y-2">
              {leaderboardItem.leaderboard.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center italic">No student submissions completed yet.</p>
              ) : (
                leaderboardItem.leaderboard.map(lb => (
                  <div key={lb.usn} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                        lb.rank === 1 ? 'bg-amber-500 text-white' : lb.rank === 2 ? 'bg-slate-300 text-slate-900' : 'bg-amber-700 text-white'
                      }`}>
                        #{lb.rank}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{lb.studentName}</h4>
                        <p className="text-xs text-slate-400">{lb.usn} • Time: {lb.completedTime}</p>
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                      {lb.score} / {lb.totalMarks} Marks
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-3">
              <button onClick={() => setLeaderboardItem(null)} className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 font-medium text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
