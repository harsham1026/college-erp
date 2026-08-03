'use client';

import React, { useState, useEffect } from 'react';
import {
  Award, Calendar, Upload, Plus, CheckCircle2, Search, Filter,
  Trophy, Medal, ShieldCheck, Sparkles, ExternalLink, Eye
} from 'lucide-react';
import { INITIAL_ACHIEVEMENTS, AchievementItem } from '@/lib/studentMockData';

const CATEGORIES = [
  'ALL', 'Certificates', 'Hackathons', 'Sports',
  'Technical Events', 'NPTEL', 'Internships', 'Awards', 'Competitions'
] as const;

export default function StudentAchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'GRID' | 'TIMELINE'>('TIMELINE');

  // Upload Modal
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [issuerInput, setIssuerInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<AchievementItem['category']>('Certificates');
  const [dateInput, setDateInput] = useState('2026-08-01');
  const [descInput, setDescInput] = useState('');
  const [fileNameInput, setFileNameInput] = useState('');

  // Preview Modal
  const [previewItem, setPreviewItem] = useState<AchievementItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAchievements(INITIAL_ACHIEVEMENTS);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const filtered = achievements.filter((a) => {
    const matchesCategory = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
                          a.issuer.toLowerCase().includes(search.toLowerCase()) ||
                          a.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;

    const newAch: AchievementItem = {
      id: 'ach-' + Date.now(),
      title: titleInput,
      issuer: issuerInput || 'CollegePES / External Authority',
      category: categoryInput,
      date: dateInput,
      description: descInput || 'Uploaded official credential certificate.',
      badgeColor: 'from-indigo-500 to-violet-600',
      verified: true,
    };

    setAchievements([newAch, ...achievements]);
    setIsUploadOpen(false);
    setTitleInput('');
    setIssuerInput('');
    setDescInput('');
    setFileNameInput('');
    alert('Achievement & Certificate uploaded successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-800 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" /> Student Portfolio
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Achievements & Certifications</h1>
          <p className="text-amber-100 text-sm mt-1">Hackathons, NPTEL scores, sports awards, certificates, and internships timeline</p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-amber-950 font-extrabold text-sm hover:bg-amber-50 shadow-lg transition-all"
        >
          <Upload className="w-4 h-4 text-amber-700" /> Upload Certificate
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search achievement or issuer..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white border-0"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline vs Grid View */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          Loading student achievements...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-500 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          <Trophy className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">No achievements recorded in this category.</p>
        </div>
      ) : (
        /* Timeline View */
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {filtered.map((item) => (
            <div key={item.id} className="relative group">
              {/* Point icon */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 ring-4 ring-white dark:ring-[#0f172a] flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] shadow-sm hover:shadow-xl transition-all duration-300 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{item.date}</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {item.title}
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">Issued by {item.issuer}</p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Verified Certificate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Certificate Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleUploadSubmit} className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upload New Achievement</h3>
              <button type="button" onClick={() => setIsUploadOpen(false)} className="p-2 text-slate-400 text-lg">✕</button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Achievement / Certificate Title</label>
              <input
                type="text"
                required
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="e.g. 1st Winner Smart India Hackathon"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Category</label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value as any)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                >
                  {CATEGORIES.filter(c => c !== 'ALL').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Date</label>
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Issuing Authority</label>
              <input
                type="text"
                value={issuerInput}
                onChange={(e) => setIssuerInput(e.target.value)}
                placeholder="e.g. IEEE / VTU / NPTEL / Company Name"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="border-2 border-dashed border-amber-300 dark:border-amber-800 rounded-2xl p-4 text-center">
              <Upload className="w-6 h-6 text-amber-500 mx-auto mb-1" />
              <input
                type="file"
                className="hidden"
                id="cert-upload"
                onChange={(e) => setFileNameInput(e.target.files?.[0]?.name || '')}
              />
              <label htmlFor="cert-upload" className="text-xs font-bold text-amber-600 dark:text-amber-400 cursor-pointer">
                {fileNameInput ? `Attached: ${fileNameInput}` : 'Attach Certificate Document (PDF/Image)'}
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button type="button" onClick={() => setIsUploadOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-sm shadow-md hover:bg-amber-700">
                Save & Upload
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Preview Certificate Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Verified Credential
              </h3>
              <button onClick={() => setPreviewItem(null)} className="p-2 text-slate-400 text-lg">✕</button>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-900 text-center space-y-3">
              <Trophy className="w-12 h-12 text-amber-500 mx-auto" />
              <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">{previewItem.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">Issued by <strong>{previewItem.issuer}</strong> on {previewItem.date}</p>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white">
                Official CollegePES Verification ID: {previewItem.id.toUpperCase()}
              </span>
            </div>

            <div className="flex justify-end pt-3">
              <button onClick={() => setPreviewItem(null)} className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
