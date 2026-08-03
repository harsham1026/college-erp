'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard, Download, CheckCircle2, AlertCircle, Clock,
  DollarSign, Receipt, ArrowUpRight, Search, Filter, ShieldCheck, Landmark, Smartphone
} from 'lucide-react';
import { INITIAL_FEES, INITIAL_TRANSACTIONS, FeeItem, PaymentTransaction } from '@/lib/studentMockData';

export default function StudentFeesPage() {
  const [fees, setFees] = useState<FeeItem[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Pay Modal State
  const [payModalItem, setPayModalItem] = useState<FeeItem | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMode, setPayMode] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFees(INITIAL_FEES);
      setTransactions(INITIAL_TRANSACTIONS);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const totalFees = fees.reduce((acc, f) => acc + f.totalAmount, 0);
  const totalPaid = fees.reduce((acc, f) => acc + f.paidAmount, 0);
  const totalPending = fees.reduce((acc, f) => acc + f.pendingAmount, 0);

  const filteredFees = fees.filter(f => {
    const matchesSearch = f.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || f.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleOpenPayModal = (item: FeeItem) => {
    setPayModalItem(item);
    setPayAmount(item.pendingAmount);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payModalItem || payAmount <= 0) return;

    setIsProcessingPay(true);

    setTimeout(() => {
      const updatedFees = fees.map(f => {
        if (f.id === payModalItem.id) {
          const newPaid = f.paidAmount + payAmount;
          const newPending = Math.max(0, f.totalAmount - newPaid);
          const newStatus: FeeItem['status'] = newPending === 0 ? 'PAID' : 'PARTIAL';
          return { ...f, paidAmount: newPaid, pendingAmount: newPending, status: newStatus };
        }
        return f;
      });

      const newTxnRef = 'TXN' + Math.floor(100000000 + Math.random() * 900000000);
      const newRcpRef = 'RCP-2026-' + Math.floor(10000 + Math.random() * 90000);
      const newTxn: PaymentTransaction = {
        id: 'txn-' + Date.now(),
        feeTitle: payModalItem.title,
        amount: payAmount,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        paymentMode: payMode,
        transactionRef: newTxnRef,
        receiptNumber: newRcpRef,
        status: 'SUCCESS',
      };

      setFees(updatedFees);
      setTransactions([newTxn, ...transactions]);
      setIsProcessingPay(false);
      setPayModalItem(null);
      alert(`Payment of ₹${payAmount.toLocaleString('en-IN')} successful! Receipt #${newRcpRef} generated.`);
    }, 1000);
  };

  const handleDownloadReceipt = (txn: PaymentTransaction) => {
    alert(`Downloading Official Payment Receipt #${txn.receiptNumber}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4" /> Finance & Fee Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Fee Structure & Payments</h1>
          <p className="text-emerald-200 text-sm mt-1">Review pending dues, pay online securely, and download receipts</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl text-center">
          <span className="text-xs text-emerald-200 block">Total Pending Dues</span>
          <span className="text-3xl font-extrabold text-amber-300">₹{totalPending.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Academic Fees</p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">₹{totalFees.toLocaleString('en-IN')}</h3>
          <p className="text-xs text-slate-500 mt-2">Academic Year 2025-2026</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Paid Amount</p>
          <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">₹{totalPaid.toLocaleString('en-IN')}</h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">✓ Verified Payments</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155]">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Outstanding Dues</p>
          <h3 className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">₹{totalPending.toLocaleString('en-IN')}</h3>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">Due by Aug 25 & Sep 10</p>
        </div>
      </div>

      {/* Fee Items Table */}
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fee title..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white border-0"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="ALL">All Fee Categories</option>
            <option value="Tuition">Tuition</option>
            <option value="Hostel">Hostel</option>
            <option value="Exam">Exam</option>
            <option value="Bus">Bus Transport</option>
          </select>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500">Loading fee records...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-[#334155]">
                    <th className="px-6 py-4">Fee Head</th>
                    <th className="px-6 py-4">Total Amount</th>
                    <th className="px-6 py-4">Paid</th>
                    <th className="px-6 py-4">Pending</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredFees.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded mr-2">
                            {item.category}
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white text-sm">{item.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">₹{item.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">₹{item.paidAmount.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 text-sm font-medium text-amber-600 dark:text-amber-400">₹{item.pendingAmount.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{item.dueDate}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.status === 'PAID' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          item.status === 'PARTIAL' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                          'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {item.pendingAmount > 0 ? (
                          <button
                            onClick={() => handleOpenPayModal(item)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow hover:opacity-90 transition-all"
                          >
                            Pay Fees (Mock)
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Fully Paid</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Payment History Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Payment Transaction History</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-3">Receipt No.</th>
                <th className="px-4 py-3">Fee Title</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{txn.receiptNumber}</td>
                  <td className="px-4 py-3 text-slate-900 dark:text-white font-medium">{txn.feeTitle}</td>
                  <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">₹{txn.amount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{txn.paymentMode}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{txn.date}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDownloadReceipt(txn)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 ml-auto"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Modal */}
      {payModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleConfirmPayment} className="bg-white dark:bg-[#1e293b] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> CollegePES Checkout
              </h3>
              <button type="button" onClick={() => setPayModalItem(null)} className="p-2 text-slate-400 text-lg">✕</button>
            </div>

            <div>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{payModalItem.category} Fee</p>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{payModalItem.title}</h4>
              <p className="text-xs text-slate-400 mt-1">Pending Amount: ₹{payModalItem.pendingAmount.toLocaleString('en-IN')}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Enter Amount to Pay (₹)
              </label>
              <input
                type="number"
                max={payModalItem.pendingAmount}
                min={1}
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-lg font-bold text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { mode: 'UPI', icon: Smartphone, label: 'UPI / QR' },
                  { mode: 'Card', icon: CreditCard, label: 'Card' },
                  { mode: 'NetBanking', icon: Landmark, label: 'Banking' },
                ].map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPayMode(mode as any)}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      payMode === mode
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button type="button" onClick={() => setPayModalItem(null)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessingPay}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md hover:bg-emerald-700 disabled:opacity-50"
              >
                {isProcessingPay ? 'Processing...' : `Pay ₹${payAmount.toLocaleString('en-IN')}`}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
