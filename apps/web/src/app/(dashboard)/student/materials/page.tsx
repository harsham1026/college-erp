'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpenCheck, Download, Search, Filter, Play, FileText,
  Presentation, FileCode, Video, Eye, ChevronLeft, ChevronRight
} from 'lucide-react';
import { INITIAL_MATERIALS, StudyMaterial } from '@/lib/studentMockData';

export default function StudentMaterialsPage() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [subjectFilter, setSubjectFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const limit = 6;

  // Video Player Modal
  const [videoModal, setVideoModal] = useState<StudyMaterial | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMaterials(INITIAL_MATERIALS);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const filtered = materials.filter((m) => {
    const matchesSearch = m.materialName.toLowerCase().includes(search.toLowerCase()) ||
                          m.subject.toLowerCase().includes(search.toLowerCase()) ||
                          m.faculty.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || m.fileType === typeFilter;
    const matchesSubject = subjectFilter === 'ALL' || m.subjectCode === subjectFilter;
    return matchesSearch && matchesType && matchesSubject;
  });

  const totalPages = Math.ceil(filtered.length / limit) || 1;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const getTypeIcon = (type: StudyMaterial['fileType']) => {
    switch (type) {
      case 'PDF': return <FileText className="w-5 h-5 text-red-500" />;
      case 'PPT': return <Presentation className="w-5 h-5 text-orange-500" />;
      case 'NOTES': return <FileCode className="w-5 h-5 text-blue-500" />;
      case 'VIDEO': return <Video className="w-5 h-5 text-purple-500" />;
    }
  };

  const handleDownload = (item: StudyMaterial) => {
    alert(`Downloading ${item.materialName} (${item.fileType})...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpenCheck className="w-4 h-4" /> Academic Library
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Study Materials & Notes</h1>
          <p className="text-violet-200 text-sm mt-1">Access lecture notes, presentation slides, reference PDFs, and video lectures</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl text-center">
          <span className="text-xs text-violet-200 block">Available Materials</span>
          <span className="text-xl font-bold">{materials.length} Files</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search material title or subject..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none border-0"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none border-0"
          >
            <option value="ALL">All Types</option>
            <option value="PDF">PDF Documents</option>
            <option value="PPT">PPT Presentations</option>
            <option value="NOTES">Handwritten Notes</option>
            <option value="VIDEO">Video Tutorials</option>
          </select>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none border-0"
          >
            <option value="ALL">All Subjects</option>
            <option value="CS301">CS301 - Data Structures</option>
            <option value="CS302">CS302 - DBMS</option>
            <option value="CS303">CS303 - Operating Systems</option>
            <option value="CS304">CS304 - Computer Networks</option>
          </select>
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          <div className="col-span-full p-12 text-center text-slate-500">Loading study materials...</div>
        ) : paginated.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-[#334155]">
            <BookOpenCheck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600 dark:text-slate-400 font-semibold">No materials found matching search.</p>
          </div>
        ) : (
          paginated.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.fileType)}
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{item.fileType}</span>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded-md">
                    {item.subjectCode}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {item.materialName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Faculty: <strong className="text-slate-700 dark:text-slate-300">{item.faculty}</strong></span>
                  <span>{item.uploadedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.fileType === 'VIDEO' ? (
                    <button
                      onClick={() => setVideoModal(item)}
                      className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <Play className="w-4 h-4 fill-white" /> Watch Video Lecture
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDownload(item)}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <Download className="w-4 h-4" /> Download {item.fileType} {item.fileSize ? `(${item.fileSize})` : ''}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filtered.length > limit && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-xs text-slate-500">Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, filtered.length)} of {filtered.length} items</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-800 space-y-4 p-6 text-white">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-purple-400">{videoModal.subjectCode} • {videoModal.subject}</span>
                <h3 className="text-lg font-bold text-white">{videoModal.materialName}</h3>
              </div>
              <button onClick={() => setVideoModal(null)} className="p-2 text-slate-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden relative">
              <iframe
                src={videoModal.videoUrl || 'https://www.youtube.com/embed/PpsEaqJV_A0'}
                title={videoModal.materialName}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-xs text-slate-400">{videoModal.description}</p>
            <div className="flex justify-end pt-2">
              <button onClick={() => setVideoModal(null)} className="px-5 py-2 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700">
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
