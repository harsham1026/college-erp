'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import {
  getMockCollection, saveMockItem, deleteMockItem,
  DEFAULT_BOOKS, DEFAULT_BOOK_CATEGORIES, DEFAULT_BOOK_ISSUES, DEFAULT_LIBRARY_FINES,
} from '@/lib/mockDb';
import { Library, BookOpen, Layers, BookCheck, DollarSign, X } from 'lucide-react';

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<'books' | 'categories' | 'issues' | 'fines'>('books');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // --- BOOKS TAB STATE ---
  const [books, setBooks] = useState<any[]>([]);
  const [booksTotal, setBooksTotal] = useState(0);
  const [booksPage, setBooksPage] = useState(1);
  const [booksLimit, setBooksLimit] = useState(10);
  const [booksSearch, setBooksSearch] = useState('');
  const [booksLoading, setBooksLoading] = useState(true);
  const [showBookModal, setShowBookModal] = useState(false);
  const [viewBook, setViewBook] = useState<any>(null);
  const [editBook, setEditBook] = useState<any>(null);
  const [bookFormData, setBookFormData] = useState({
    title: '', isbn: '', author: '', publisher: '', categoryId: '1', totalCopies: 10, availableCopies: 10, rackLocation: 'Rack A-1',
  });

  // --- CATEGORIES TAB STATE ---
  const [categories, setCategories] = useState<any[]>([]);
  const [catTotal, setCatTotal] = useState(0);
  const [catPage, setCatPage] = useState(1);
  const [catLimit, setCatLimit] = useState(10);
  const [catSearch, setCatSearch] = useState('');
  const [catLoading, setCatLoading] = useState(true);
  const [showCatModal, setShowCatModal] = useState(false);
  const [editCat, setEditCat] = useState<any>(null);
  const [catFormData, setCatFormData] = useState({ name: '', code: '', description: '' });

  // --- ISSUES TAB STATE ---
  const [issues, setIssues] = useState<any[]>([]);
  const [issuesTotal, setIssuesTotal] = useState(0);
  const [issuesPage, setIssuesPage] = useState(1);
  const [issuesLimit, setIssuesLimit] = useState(10);
  const [issuesSearch, setIssuesSearch] = useState('');
  const [issuesLoading, setIssuesLoading] = useState(true);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueFormData, setIssueFormData] = useState({
    bookId: '1', borrowerName: '', borrowerId: '', borrowerRole: 'Student', issueDate: new Date().toISOString().split('T')[0], dueDate: '',
  });

  // --- FINES TAB STATE ---
  const [fines, setFines] = useState<any[]>([]);
  const [finesTotal, setFinesTotal] = useState(0);
  const [finesPage, setFinesPage] = useState(1);
  const [finesLimit, setFinesLimit] = useState(10);
  const [finesSearch, setFinesSearch] = useState('');
  const [finesLoading, setFinesLoading] = useState(true);

  // Fetch Books
  const fetchBooks = useCallback(async () => {
    setBooksLoading(true);
    try {
      const res: any = await api.get('/library/books', { page: booksPage, limit: booksLimit, search: booksSearch });
      setBooks(res.data || []);
      setBooksTotal(res.pagination?.total || 0);
    } catch {
      const res = getMockCollection('mock_library_books', DEFAULT_BOOKS, {
        page: booksPage, limit: booksLimit, search: booksSearch, searchFields: ['title', 'isbn', 'author'],
      });
      setBooks(res.data);
      setBooksTotal(res.pagination.total);
    } finally {
      setBooksLoading(false);
    }
  }, [booksPage, booksLimit, booksSearch]);

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    setCatLoading(true);
    try {
      const res: any = await api.get('/library/categories', { page: catPage, limit: catLimit, search: catSearch });
      setCategories(res.data || []);
      setCatTotal(res.pagination?.total || 0);
    } catch {
      const res = getMockCollection('mock_library_categories', DEFAULT_BOOK_CATEGORIES, {
        page: catPage, limit: catLimit, search: catSearch, searchFields: ['name', 'code'],
      });
      setCategories(res.data);
      setCatTotal(res.pagination.total);
    } finally {
      setCatLoading(false);
    }
  }, [catPage, catLimit, catSearch]);

  // Fetch Issues
  const fetchIssues = useCallback(async () => {
    setIssuesLoading(true);
    try {
      const res: any = await api.get('/library/issues', { page: issuesPage, limit: issuesLimit, search: issuesSearch });
      setIssues(res.data || []);
      setIssuesTotal(res.pagination?.total || 0);
    } catch {
      const res = getMockCollection('mock_library_issues', DEFAULT_BOOK_ISSUES, {
        page: issuesPage, limit: issuesLimit, search: issuesSearch, searchFields: ['bookTitle', 'borrowerName', 'borrowerId'],
      });
      setIssues(res.data);
      setIssuesTotal(res.pagination.total);
    } finally {
      setIssuesLoading(false);
    }
  }, [issuesPage, issuesLimit, issuesSearch]);

  // Fetch Fines
  const fetchFines = useCallback(async () => {
    setFinesLoading(true);
    try {
      const res: any = await api.get('/library/fines', { page: finesPage, limit: finesLimit, search: finesSearch });
      setFines(res.data || []);
      setFinesTotal(res.pagination?.total || 0);
    } catch {
      const res = getMockCollection('mock_library_fines', DEFAULT_LIBRARY_FINES, {
        page: finesPage, limit: finesLimit, search: finesSearch, searchFields: ['borrowerName', 'borrowerId', 'bookTitle'],
      });
      setFines(res.data);
      setFinesTotal(res.pagination.total);
    } finally {
      setFinesLoading(false);
    }
  }, [finesPage, finesLimit, finesSearch]);

  useEffect(() => {
    if (activeTab === 'books') fetchBooks();
    else if (activeTab === 'categories') fetchCategories();
    else if (activeTab === 'issues') fetchIssues();
    else if (activeTab === 'fines') fetchFines();
  }, [activeTab, fetchBooks, fetchCategories, fetchIssues, fetchFines]);

  // Book submit
  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === bookFormData.categoryId) || DEFAULT_BOOK_CATEGORIES[0];
    const payload = {
      ...bookFormData,
      categoryName: cat?.name || 'General',
      status: Number(bookFormData.availableCopies) > 0 ? 'Available' : 'Out of Stock',
    };
    saveMockItem('mock_library_books', DEFAULT_BOOKS, { ...(editBook ? { id: editBook.id } : {}), ...payload });
    setToast({ message: editBook ? 'Book updated successfully!' : 'Book added to catalog!', type: 'success' });
    setShowBookModal(false);
    fetchBooks();
  };

  // Category submit
  const handleCatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...catFormData, bookCount: editCat ? editCat.bookCount : 0 };
    saveMockItem('mock_library_categories', DEFAULT_BOOK_CATEGORIES, { ...(editCat ? { id: editCat.id } : {}), ...payload });
    setToast({ message: editCat ? 'Category updated!' : 'Category created!', type: 'success' });
    setShowCatModal(false);
    fetchCategories();
  };

  // Issue submit
  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bk = books.find((b) => b.id === issueFormData.bookId) || DEFAULT_BOOKS[0];
    const payload = {
      ...issueFormData,
      bookTitle: bk.title,
      returnDate: null,
      status: 'ISSUED',
      fineAmount: 0,
    };
    saveMockItem('mock_library_issues', DEFAULT_BOOK_ISSUES, payload);
    setToast({ message: 'Book issued successfully!', type: 'success' });
    setShowIssueModal(false);
    fetchIssues();
  };

  // Return book action
  const handleReturnBook = (issue: any) => {
    const today = new Date().toISOString().split('T')[0];
    saveMockItem('mock_library_issues', DEFAULT_BOOK_ISSUES, { ...issue, returnDate: today, status: 'RETURNED' });
    setToast({ message: `Book returned successfully!`, type: 'success' });
    fetchIssues();
  };

  // Pay Fine action
  const handlePayFine = (fine: any) => {
    saveMockItem('mock_library_fines', DEFAULT_LIBRARY_FINES, { ...fine, status: 'PAID' });
    setToast({ message: 'Library fine marked as PAID!', type: 'success' });
    fetchFines();
  };

  const bookColumns = [
    { key: 'title', title: 'Book Title & Details', sortable: true, render: (v: string, r: any) => (
      <div>
        <p className="font-semibold text-slate-900 dark:text-white leading-tight">{v}</p>
        <p className="text-xs text-slate-500">ISBN: {r.isbn} | Author: {r.author}</p>
      </div>
    )},
    { key: 'categoryName', title: 'Category', sortable: true, render: (v: string) => (
      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold dark:bg-indigo-950/50 dark:text-indigo-300">
        {v || 'General'}
      </span>
    )},
    { key: 'totalCopies', title: 'Copies', render: (_: any, r: any) => (
      <span className="text-xs font-medium">
        <strong className="text-indigo-600 dark:text-indigo-400">{r.availableCopies}</strong> / {r.totalCopies} Available
      </span>
    )},
    { key: 'rackLocation', title: 'Shelf Location' },
    { key: 'status', title: 'Availability', render: (v: string) => (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${v === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30'}`}>
        {v}
      </span>
    )},
  ];

  const catColumns = [
    { key: 'name', title: 'Category Name', sortable: true, render: (v: string, r: any) => (
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{v}</p>
        <p className="text-xs text-slate-500">{r.description}</p>
      </div>
    )},
    { key: 'code', title: 'Code Tag', render: (v: string) => <span className="font-mono text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">{v}</span> },
    { key: 'bookCount', title: 'Total Books', sortable: true },
  ];

  const issueColumns = [
    { key: 'bookTitle', title: 'Book Title', sortable: true },
    { key: 'borrowerName', title: 'Borrower', render: (_: any, r: any) => (
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{r.borrowerName}</p>
        <p className="text-xs text-slate-500">{r.borrowerId} ({r.borrowerRole})</p>
      </div>
    )},
    { key: 'issueDate', title: 'Issue Date' },
    { key: 'dueDate', title: 'Due Date' },
    { key: 'status', title: 'Status', render: (v: string) => (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${v === 'RETURNED' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' : v === 'OVERDUE' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>
        {v}
      </span>
    )},
    { key: 'actions', title: 'Action', render: (_: any, r: any) => r.status !== 'RETURNED' ? (
      <button onClick={() => handleReturnBook(r)} className="px-3 py-1 bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 text-xs font-medium rounded-lg hover:bg-indigo-100">
        Mark Return
      </button>
    ) : <span className="text-xs text-slate-400">Returned</span> },
  ];

  const fineColumns = [
    { key: 'borrowerName', title: 'Student / Borrower', render: (_: any, r: any) => (
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{r.borrowerName}</p>
        <p className="text-xs text-slate-500">{r.borrowerId}</p>
      </div>
    )},
    { key: 'bookTitle', title: 'Book' },
    { key: 'daysOverdue', title: 'Overdue Days', render: (v: number) => `${v} Days` },
    { key: 'amount', title: 'Fine Amount', render: (v: number) => <strong className="text-red-600 dark:text-red-400">₹{v}</strong> },
    { key: 'status', title: 'Status', render: (v: string) => (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${v === 'PAID' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'}`}>
        {v}
      </span>
    )},
    { key: 'action', title: 'Collect Fine', render: (_: any, r: any) => r.status === 'UNPAID' ? (
      <button onClick={() => handlePayFine(r)} className="px-3 py-1 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700">
        Pay ₹{r.amount}
      </button>
    ) : <span className="text-xs text-slate-400">Cleared</span> },
  ];

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <Breadcrumbs items={[{ label: 'Library Management' }]} />
        <div className="flex items-center gap-3 mt-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md flex-shrink-0">
            <Library className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Library Module</h1>
            <p className="text-sm text-slate-500">Manage catalog, book categories, circulation, issues, returns, and fines</p>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('books')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'books' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <BookOpen className="w-4 h-4" /> Books Catalog
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'categories' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <Layers className="w-4 h-4" /> Categories
        </button>
        <button
          onClick={() => setActiveTab('issues')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'issues' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <BookCheck className="w-4 h-4" /> Issue & Return Books
        </button>
        <button
          onClick={() => setActiveTab('fines')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'fines' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <DollarSign className="w-4 h-4" /> Fine Management
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'books' && (
        <DataTable
          title="Library Books Registry"
          columns={bookColumns}
          data={books}
          totalItems={booksTotal}
          page={booksPage}
          limit={booksLimit}
          isLoading={booksLoading}
          onPageChange={setBooksPage}
          onLimitChange={(l) => { setBooksPage(1); setBooksLimit(l); }}
          onSearch={(s) => { setBooksSearch(s); setBooksPage(1); }}
          onSort={() => {}}
          onAdd={() => { setEditBook(null); setBookFormData({ title: '', isbn: '', author: '', publisher: '', categoryId: '1', totalCopies: 10, availableCopies: 10, rackLocation: 'Rack A-1' }); setShowBookModal(true); }}
          onEdit={(r) => { setEditBook(r); setBookFormData({ title: r.title, isbn: r.isbn, author: r.author, publisher: r.publisher, categoryId: r.categoryId || '1', totalCopies: r.totalCopies, availableCopies: r.availableCopies, rackLocation: r.rackLocation }); setShowBookModal(true); }}
          onDelete={(r) => { deleteMockItem('mock_library_books', DEFAULT_BOOKS, r.id); setToast({ message: 'Book deleted from catalog!', type: 'success' }); fetchBooks(); }}
          onView={(r) => setViewBook(r)}
          addLabel="Add Book"
          searchPlaceholder="Search books by title, author, or ISBN..."
        />
      )}

      {activeTab === 'categories' && (
        <DataTable
          title="Book Categories"
          columns={catColumns}
          data={categories}
          totalItems={catTotal}
          page={catPage}
          limit={catLimit}
          isLoading={catLoading}
          onPageChange={setCatPage}
          onLimitChange={(l) => { setCatPage(1); setCatLimit(l); }}
          onSearch={(s) => { setCatSearch(s); setCatPage(1); }}
          onSort={() => {}}
          onAdd={() => { setEditCat(null); setCatFormData({ name: '', code: '', description: '' }); setShowCatModal(true); }}
          onEdit={(r) => { setEditCat(r); setCatFormData({ name: r.name, code: r.code, description: r.description }); setShowCatModal(true); }}
          onDelete={(r) => { deleteMockItem('mock_library_categories', DEFAULT_BOOK_CATEGORIES, r.id); setToast({ message: 'Category deleted!', type: 'success' }); fetchCategories(); }}
          addLabel="Add Category"
          searchPlaceholder="Search category name or code..."
        />
      )}

      {activeTab === 'issues' && (
        <DataTable
          title="Issued & Returned Books Log"
          columns={issueColumns}
          data={issues}
          totalItems={issuesTotal}
          page={issuesPage}
          limit={issuesLimit}
          isLoading={issuesLoading}
          onPageChange={setIssuesPage}
          onLimitChange={(l) => { setIssuesPage(1); setIssuesLimit(l); }}
          onSearch={(s) => { setIssuesSearch(s); setIssuesPage(1); }}
          onSort={() => {}}
          onAdd={() => { setIssueFormData({ bookId: books[0]?.id || '1', borrowerName: '', borrowerId: '', borrowerRole: 'Student', issueDate: new Date().toISOString().split('T')[0], dueDate: '' }); setShowIssueModal(true); }}
          addLabel="Issue Book"
          searchPlaceholder="Search by book title or borrower..."
        />
      )}

      {activeTab === 'fines' && (
        <DataTable
          title="Overdue Library Fines"
          columns={fineColumns}
          data={fines}
          totalItems={finesTotal}
          page={finesPage}
          limit={finesLimit}
          isLoading={finesLoading}
          onPageChange={setFinesPage}
          onLimitChange={(l) => { setFinesPage(1); setFinesLimit(l); }}
          onSearch={(s) => { setFinesSearch(s); setFinesPage(1); }}
          onSort={() => {}}
          searchPlaceholder="Search fines by borrower or book..."
        />
      )}

      {/* Add / Edit Book Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBookModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editBook ? 'Edit Book Record' : 'Add New Book'}</h3>
              <button onClick={() => setShowBookModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleBookSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Book Title *</label>
                <input value={bookFormData.title} onChange={(e) => setBookFormData({ ...bookFormData, title: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">ISBN *</label>
                  <input value={bookFormData.isbn} onChange={(e) => setBookFormData({ ...bookFormData, isbn: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Author *</label>
                  <input value={bookFormData.author} onChange={(e) => setBookFormData({ ...bookFormData, author: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Publisher</label>
                  <input value={bookFormData.publisher} onChange={(e) => setBookFormData({ ...bookFormData, publisher: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Rack Location</label>
                  <input value={bookFormData.rackLocation} onChange={(e) => setBookFormData({ ...bookFormData, rackLocation: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Total Copies</label>
                  <input type="number" value={bookFormData.totalCopies} onChange={(e) => setBookFormData({ ...bookFormData, totalCopies: Number(e.target.value) })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Available Copies</label>
                  <input type="number" value={bookFormData.availableCopies} onChange={(e) => setBookFormData({ ...bookFormData, availableCopies: Number(e.target.value) })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowBookModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">{editBook ? 'Update' : 'Save Book'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCatModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editCat ? 'Edit Category' : 'Add Book Category'}</h3>
              <button onClick={() => setShowCatModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCatSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Category Name *</label>
                <input value={catFormData.name} onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Category Code *</label>
                <input value={catFormData.code} onChange={(e) => setCatFormData({ ...catFormData, code: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Description</label>
                <textarea value={catFormData.description} onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })} rows={3} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowCatModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue Book Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowIssueModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Issue Book to Borrower</h3>
              <button onClick={() => setShowIssueModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleIssueSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Select Book *</label>
                <select value={issueFormData.bookId} onChange={(e) => setIssueFormData({ ...issueFormData, bookId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0">
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>{b.title} (Available: {b.availableCopies})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Borrower Name *</label>
                  <input value={issueFormData.borrowerName} onChange={(e) => setIssueFormData({ ...issueFormData, borrowerName: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">USN / Employee ID *</label>
                  <input value={issueFormData.borrowerId} onChange={(e) => setIssueFormData({ ...issueFormData, borrowerId: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Issue Date</label>
                  <input type="date" value={issueFormData.issueDate} onChange={(e) => setIssueFormData({ ...issueFormData, issueDate: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Due Date *</label>
                  <input type="date" value={issueFormData.dueDate} onChange={(e) => setIssueFormData({ ...issueFormData, dueDate: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowIssueModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Issue Book</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Book Modal */}
      {viewBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewBook(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Book Profile Details</h3>
              <button onClick={() => setViewBook(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <p><strong className="text-slate-500 text-xs block uppercase">Title</strong> <span className="font-bold text-slate-900 dark:text-white text-base">{viewBook.title}</span></p>
              <div className="grid grid-cols-2 gap-2">
                <p><strong className="text-slate-500 text-xs block uppercase">ISBN</strong> {viewBook.isbn}</p>
                <p><strong className="text-slate-500 text-xs block uppercase">Author</strong> {viewBook.author}</p>
                <p><strong className="text-slate-500 text-xs block uppercase">Publisher</strong> {viewBook.publisher}</p>
                <p><strong className="text-slate-500 text-xs block uppercase">Rack Location</strong> {viewBook.rackLocation}</p>
                <p><strong className="text-slate-500 text-xs block uppercase">Total Copies</strong> {viewBook.totalCopies}</p>
                <p><strong className="text-slate-500 text-xs block uppercase">Available</strong> {viewBook.availableCopies}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
