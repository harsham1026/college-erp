'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpenCheck, Upload, Download, Search, Filter, Trash2,
  FileText, Presentation, FileCode, Video, Link, Eye
} from 'lucide-react';
import { INITIAL_TEACHER_MATERIALS, TeacherMaterialItem } from '@/lib/teacherMockData';

export default function TeacherMaterialsPage() {
  const [materials, setMaterials] = useState<TeacherMaterialItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Upload Modal
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('CS301');
  const [categoryInput, setCategoryInput] = useState<TeacherMaterialItem['category']>('PDF');
  const [moduleInput, setModuleInput] = useState('Module 1');
  const [descInput, setDescInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setMaterials(INITIAL_TEACHER_MATERIALS);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;

    const newMat: TeacherMaterialItem = {
      id: 'mat-' + Date.now(),
      title: titleInput,
      subjectCode: subjectInput,
      subjectName: subjectInput === 'CS301' ? 'Data Structures' : 'DBMS',
      category: categoryInput,
      module: moduleInput,
      uploadedDate: new Date().toISOString().substring(0, 10),
      fileSize: '4.2 MB',
      fileUrl: '#',
      downloadCount: 0,
      description: descInput || 'Uploaded course study material.',
    };

    setMaterials([newMat, ...materials]);
    setIsUploadOpen(false);
    setTitleInput('');
    setDescInput('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete material file?')) {
      setMaterials(prev => prev.filter(m => m.id !== id));
    }
  };

  const filtered = materials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
                          m.subjectCode.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-700 via-teal-700 to-indigo-800 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpenCheck className="w-4 h-4" /> Academic Content Repository
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Study Materials & Notes Management</h1>
          <p className="text-cyan-100 text-sm mt-1">Upload lecture notes, PDFs, PPTs, video links, and track student download statistics</p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-cyan-950 font-bold text-sm hover:bg-cyan-50 shadow-lg transition-all"
        >
          <Upload className="w-4 h-4 text-cyan-700" /> Upload Study Material
        </button>
      </div>

      {/* Filter */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search materials..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white border-0"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 border-0"
        >
          <option value="ALL">All File Formats</option>
          <option value="PDF">PDF</option>
          <option value="PPT">PPT</option>
          <option value="Notes">Notes</option>
          <option value="Video">Video</option>
        </select>
      </div>

      {/* Material Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full p-12 text-center text-slate-500">Loading materials...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500">No materials uploaded yet.</div>
        ) : (
          filtered.map(mat => (
            <div key={mat.id} className="p-6 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] hover:shadow-xl transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                    {mat.subjectCode} • {mat.module}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{mat.category}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{mat.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{mat.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-emerald-600">
                  <Download className="w-3.5 h-3.5" /> {mat.downloadCount} Student Downloads
                </span>
                <button onClick={() => handleDelete(mat.id)} className="p-1.5 text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleUploadSubmit} className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upload Study Material</h3>
              <button type="button" onClick={() => setIsUploadOpen(false)} className="p-2 text-slate-400 text-lg">✕</button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Material Title</label>
              <input type="text" required value={titleInput} onChange={e => setTitleInput(e.target.value)} placeholder="e.g. Graph Traversal Algorithms Notes" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm text-slate-900 dark:text-white" />
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
                <label className="text-xs font-semibold text-slate-500 block mb-1">Type</label>
                <select value={categoryInput} onChange={e => setCategoryInput(e.target.value as any)} className="w-full p-2.5 rounded-xl bg-slate-50 border text-xs font-bold text-slate-900 dark:text-white">
                  <option value="PDF">PDF</option>
                  <option value="PPT">PPT</option>
                  <option value="Notes">Notes</option>
                  <option value="Video">Video</option>
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
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Description</label>
              <textarea rows={2} value={descInput} onChange={e => setDescInput(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm text-slate-900 dark:text-white" />
            </div>

            <div className="border-2 border-dashed border-cyan-300 rounded-2xl p-4 text-center">
              <Upload className="w-6 h-6 text-cyan-600 mx-auto mb-1" />
              <span className="text-xs font-bold text-cyan-700">Choose File to Upload</span>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button type="button" onClick={() => setIsUploadOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm">Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-sm hover:bg-cyan-700">Upload Now</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
