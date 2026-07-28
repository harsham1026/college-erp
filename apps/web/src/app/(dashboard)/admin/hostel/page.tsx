'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import {
  getMockCollection, saveMockItem, deleteMockItem,
  DEFAULT_HOSTELS, DEFAULT_HOSTEL_ROOMS, DEFAULT_HOSTEL_ALLOCATIONS, DEFAULT_HOSTEL_COMPLAINTS, DEFAULT_MESS_DETAILS,
} from '@/lib/mockDb';
import { Building, Home, Users, AlertCircle, Utensils, X, CheckCircle } from 'lucide-react';

export default function HostelPage() {
  const [activeTab, setActiveTab] = useState<'hostels' | 'rooms' | 'allocations' | 'complaints' | 'mess'>('hostels');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // --- HOSTELS TAB ---
  const [hostels, setHostels] = useState<any[]>([]);
  const [hostelsTotal, setHostelsTotal] = useState(0);
  const [hostelsPage, setHostelsPage] = useState(1);
  const [hostelsLimit, setHostelsLimit] = useState(10);
  const [hostelsSearch, setHostelsSearch] = useState('');
  const [hostelsLoading, setHostelsLoading] = useState(true);
  const [showHostelModal, setShowHostelModal] = useState(false);
  const [editHostel, setEditHostel] = useState<any>(null);
  const [hostelForm, setHostelForm] = useState({ name: '', code: '', type: 'Boys', totalCapacity: 200, occupied: 0, wardenName: '', contactPhone: '' });

  // --- ROOMS TAB ---
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomsTotal, setRoomsTotal] = useState(0);
  const [roomsPage, setRoomsPage] = useState(1);
  const [roomsLimit, setRoomsLimit] = useState(10);
  const [roomsSearch, setRoomsSearch] = useState('');
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editRoom, setEditRoom] = useState<any>(null);
  const [roomForm, setRoomForm] = useState({ roomNo: '', hostelId: '1', roomType: 'Double Occupancy', totalBeds: 2, occupiedBeds: 0, feePerSemester: 35000 });

  // --- ALLOCATIONS TAB ---
  const [allocations, setAllocations] = useState<any[]>([]);
  const [allocTotal, setAllocTotal] = useState(0);
  const [allocPage, setAllocPage] = useState(1);
  const [allocLimit, setAllocLimit] = useState(10);
  const [allocSearch, setAllocSearch] = useState('');
  const [allocLoading, setAllocLoading] = useState(true);
  const [showAllocModal, setShowAllocModal] = useState(false);
  const [allocForm, setAllocForm] = useState({ studentName: '', enrollmentNo: '', hostelId: '1', roomNo: '', bedNo: 'Bed-1', allocatedDate: new Date().toISOString().split('T')[0] });

  // --- COMPLAINTS TAB ---
  const [complaints, setComplaints] = useState<any[]>([]);
  const [compTotal, setCompTotal] = useState(0);
  const [compPage, setCompPage] = useState(1);
  const [compLimit, setCompLimit] = useState(10);
  const [compSearch, setCompSearch] = useState('');
  const [compLoading, setCompLoading] = useState(true);

  // --- MESS TAB ---
  const [mess, setMess] = useState<any[]>([]);

  // Data Fetchers
  const fetchHostels = useCallback(async () => {
    setHostelsLoading(true);
    try {
      const res: any = await api.get('/hostel/blocks', { page: hostelsPage, limit: hostelsLimit, search: hostelsSearch });
      setHostels(res.data || []);
      setHostelsTotal(res.pagination?.total || 0);
    } catch {
      const res = getMockCollection('mock_hostels', DEFAULT_HOSTELS, {
        page: hostelsPage, limit: hostelsLimit, search: hostelsSearch, searchFields: ['name', 'code', 'wardenName'],
      });
      setHostels(res.data);
      setHostelsTotal(res.pagination.total);
    } fontally: { setHostelsLoading(false); }
  }, [hostelsPage, hostelsLimit, hostelsSearch]);

  const fetchRooms = useCallback(async () => {
    setRoomsLoading(true);
    try {
      const res: any = await api.get('/hostel/rooms', { page: roomsPage, limit: roomsLimit, search: roomsSearch });
      setRooms(res.data || []);
      setRoomsTotal(res.pagination?.total || 0);
    } catch {
      const res = getMockCollection('mock_hostel_rooms', DEFAULT_HOSTEL_ROOMS, {
        page: roomsPage, limit: roomsLimit, search: roomsSearch, searchFields: ['roomNo', 'hostelName', 'roomType'],
      });
      setRooms(res.data);
      setRoomsTotal(res.pagination.total);
    } finally { setRoomsLoading(false); }
  }, [roomsPage, roomsLimit, roomsSearch]);

  const fetchAllocations = useCallback(async () => {
    setAllocLoading(true);
    try {
      const res: any = await api.get('/hostel/allocations', { page: allocPage, limit: allocLimit, search: allocSearch });
      setAllocations(res.data || []);
      setAllocTotal(res.pagination?.total || 0);
    } catch {
      const res = getMockCollection('mock_hostel_allocations', DEFAULT_HOSTEL_ALLOCATIONS, {
        page: allocPage, limit: allocLimit, search: allocSearch, searchFields: ['studentName', 'enrollmentNo', 'roomNo'],
      });
      setAllocations(res.data);
      setAllocTotal(res.pagination.total);
    } finally { setAllocLoading(false); }
  }, [allocPage, allocLimit, allocSearch]);

  const fetchComplaints = useCallback(async () => {
    setCompLoading(true);
    try {
      const res: any = await api.get('/hostel/complaints', { page: compPage, limit: compLimit, search: compSearch });
      setComplaints(res.data || []);
      setCompTotal(res.pagination?.total || 0);
    } catch {
      const res = getMockCollection('mock_hostel_complaints', DEFAULT_HOSTEL_COMPLAINTS, {
        page: compPage, limit: compLimit, search: compSearch, searchFields: ['studentName', 'title', 'category', 'roomNo'],
      });
      setComplaints(res.data);
      setCompTotal(res.pagination.total);
    } finally { setCompLoading(false); }
  }, [compPage, compLimit, compSearch]);

  useEffect(() => {
    if (activeTab === 'hostels') fetchHostels();
    else if (activeTab === 'rooms') fetchRooms();
    else if (activeTab === 'allocations') fetchAllocations();
    else if (activeTab === 'complaints') fetchComplaints();
    else if (activeTab === 'mess') setMess(DEFAULT_MESS_DETAILS);
  }, [activeTab, fetchHostels, fetchRooms, fetchAllocations, fetchComplaints]);

  // Submit Handlers
  const handleHostelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMockItem('mock_hostels', DEFAULT_HOSTELS, { ...(editHostel ? { id: editHostel.id } : {}), ...hostelForm, status: 'Active' });
    setToast({ message: editHostel ? 'Hostel block updated!' : 'Hostel block created!', type: 'success' });
    setShowHostelModal(false);
    fetchHostels();
  };

  const handleRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = hostels.find((x) => x.id === roomForm.hostelId) || DEFAULT_HOSTELS[0];
    const payload = {
      ...roomForm,
      hostelName: h.name,
      status: Number(roomForm.occupiedBeds) >= Number(roomForm.totalBeds) ? 'Full' : 'Available',
    };
    saveMockItem('mock_hostel_rooms', DEFAULT_HOSTEL_ROOMS, { ...(editRoom ? { id: editRoom.id } : {}), ...payload });
    setToast({ message: editRoom ? 'Room details updated!' : 'Room added successfully!', type: 'success' });
    setShowRoomModal(false);
    fetchRooms();
  };

  const handleAllocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = hostels.find((x) => x.id === allocForm.hostelId) || DEFAULT_HOSTELS[0];
    const payload = {
      ...allocForm,
      hostelName: h.name,
      status: 'Active',
    };
    saveMockItem('mock_hostel_allocations', DEFAULT_HOSTEL_ALLOCATIONS, payload);
    setToast({ message: 'Room allocated to student!', type: 'success' });
    setShowAllocModal(false);
    fetchAllocations();
  };

  const handleUpdateComplaint = (complaint: any, newStatus: string) => {
    saveMockItem('mock_hostel_complaints', DEFAULT_HOSTEL_COMPLAINTS, { ...complaint, status: newStatus });
    setToast({ message: `Complaint status changed to ${newStatus}`, type: 'success' });
    fetchComplaints();
  };

  const hostelColumns = [
    { key: 'name', title: 'Hostel Name & Code', sortable: true, render: (v: string, r: any) => (
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{v}</p>
        <p className="text-xs text-slate-500 font-mono">Code: {r.code} | Type: {r.type}</p>
      </div>
    )},
    { key: 'wardenName', title: 'Hostel Warden', render: (v: string, r: any) => (
      <div>
        <p className="font-medium text-slate-800 dark:text-slate-200">{v}</p>
        <p className="text-xs text-slate-500">{r.contactPhone}</p>
      </div>
    )},
    { key: 'occupied', title: 'Occupancy Rate', render: (_: any, r: any) => (
      <div>
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{r.occupied} / {r.totalCapacity} Residents</p>
        <div className="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1 overflow-hidden">
          <div className="bg-indigo-600 h-full" style={{ width: `${Math.min(100, (r.occupied / r.totalCapacity) * 100)}%` }} />
        </div>
      </div>
    )},
    { key: 'status', title: 'Status', render: (v: string) => (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
        {v}
      </span>
    )},
  ];

  const roomColumns = [
    { key: 'roomNo', title: 'Room Number', sortable: true, render: (v: string, r: any) => <strong className="text-indigo-600 dark:text-indigo-400">{v}</strong> },
    { key: 'hostelName', title: 'Hostel Block' },
    { key: 'roomType', title: 'Type' },
    { key: 'occupiedBeds', title: 'Beds Occupied', render: (_: any, r: any) => `${r.occupiedBeds} / ${r.totalBeds} Beds` },
    { key: 'feePerSemester', title: 'Semester Fee', render: (v: number) => `₹${v.toLocaleString()}` },
    { key: 'status', title: 'Availability', render: (v: string) => (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${v === 'Available' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}`}>
        {v}
      </span>
    )},
  ];

  const allocColumns = [
    { key: 'studentName', title: 'Resident Student', sortable: true, render: (v: string, r: any) => (
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{v}</p>
        <p className="text-xs text-slate-500">USN: {r.enrollmentNo}</p>
      </div>
    )},
    { key: 'hostelName', title: 'Hostel' },
    { key: 'roomNo', title: 'Room & Bed', render: (_: any, r: any) => `Room ${r.roomNo} (${r.bedNo})` },
    { key: 'allocatedDate', title: 'Allocated Date' },
    { key: 'status', title: 'Status', render: (v: string) => <span className="px-2 py-0.5 rounded text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950">{v}</span> },
  ];

  const compColumns = [
    { key: 'title', title: 'Complaint Title', sortable: true, render: (v: string, r: any) => (
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{v}</p>
        <p className="text-xs text-slate-500">By: {r.studentName} ({r.roomNo}) | Category: {r.category}</p>
      </div>
    )},
    { key: 'priority', title: 'Priority', render: (v: string) => (
      <span className={`px-2 py-0.5 rounded text-xs font-bold ${v === 'HIGH' ? 'bg-red-100 text-red-700' : v === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
        {v}
      </span>
    )},
    { key: 'date', title: 'Date Reported' },
    { key: 'status', title: 'Resolution Status', render: (v: string) => (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${v === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : v === 'In-Progress' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-800'}`}>
        {v}
      </span>
    )},
    { key: 'action', title: 'Update Status', render: (_: any, r: any) => (
      <div className="flex gap-1">
        {r.status !== 'Resolved' && (
          <button onClick={() => handleUpdateComplaint(r, 'Resolved')} className="px-2 py-1 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-700 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Resolve
          </button>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <Breadcrumbs items={[{ label: 'Hostel Management' }]} />
        <div className="flex items-center gap-3 mt-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md flex-shrink-0">
            <Building className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Hostel Module</h1>
            <p className="text-sm text-slate-500">Manage hostel blocks, room assignments, residents, warden contact details, mess menus & maintenance</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button onClick={() => setActiveTab('hostels')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'hostels' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Building className="w-4 h-4" /> Hostels
        </button>
        <button onClick={() => setActiveTab('rooms')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'rooms' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Home className="w-4 h-4" /> Rooms & Capacity
        </button>
        <button onClick={() => setActiveTab('allocations')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'allocations' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Users className="w-4 h-4" /> Student Allocations
        </button>
        <button onClick={() => setActiveTab('complaints')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'complaints' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <AlertCircle className="w-4 h-4" /> Complaints & Issues
        </button>
        <button onClick={() => setActiveTab('mess')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'mess' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Utensils className="w-4 h-4" /> Mess Schedule
        </button>
      </div>

      {activeTab === 'hostels' && (
        <DataTable
          title="Hostel Blocks Registry"
          columns={hostelColumns}
          data={hostels}
          totalItems={hostelsTotal}
          page={hostelsPage}
          limit={hostelsLimit}
          isLoading={hostelsLoading}
          onPageChange={setHostelsPage}
          onLimitChange={(l) => { setHostelsPage(1); setHostelsLimit(l); }}
          onSearch={(s) => { setHostelsSearch(s); setHostelsPage(1); }}
          onSort={() => {}}
          onAdd={() => { setEditHostel(null); setHostelForm({ name: '', code: '', type: 'Boys', totalCapacity: 200, occupied: 0, wardenName: '', contactPhone: '' }); setShowHostelModal(true); }}
          onEdit={(r) => { setEditHostel(r); setHostelForm({ name: r.name, code: r.code, type: r.type, totalCapacity: r.totalCapacity, occupied: r.occupied, wardenName: r.wardenName, contactPhone: r.contactPhone }); setShowHostelModal(true); }}
          onDelete={(r) => { deleteMockItem('mock_hostels', DEFAULT_HOSTELS, r.id); setToast({ message: 'Hostel block deleted!', type: 'success' }); fetchHostels(); }}
          addLabel="Add Hostel Block"
          searchPlaceholder="Search hostel block or warden..."
        />
      )}

      {activeTab === 'rooms' && (
        <DataTable
          title="Hostel Rooms Catalog"
          columns={roomColumns}
          data={rooms}
          totalItems={roomsTotal}
          page={roomsPage}
          limit={roomsLimit}
          isLoading={roomsLoading}
          onPageChange={setRoomsPage}
          onLimitChange={(l) => { setRoomsPage(1); setRoomsLimit(l); }}
          onSearch={(s) => { setRoomsSearch(s); setRoomsPage(1); }}
          onSort={() => {}}
          onAdd={() => { setEditRoom(null); setRoomForm({ roomNo: '', hostelId: hostels[0]?.id || '1', roomType: 'Double Occupancy', totalBeds: 2, occupiedBeds: 0, feePerSemester: 35000 }); setShowRoomModal(true); }}
          onEdit={(r) => { setEditRoom(r); setRoomForm({ roomNo: r.roomNo, hostelId: r.hostelId || '1', roomType: r.roomType, totalBeds: r.totalBeds, occupiedBeds: r.occupiedBeds, feePerSemester: r.feePerSemester }); setShowRoomModal(true); }}
          onDelete={(r) => { deleteMockItem('mock_hostel_rooms', DEFAULT_HOSTEL_ROOMS, r.id); setToast({ message: 'Room deleted!', type: 'success' }); fetchRooms(); }}
          addLabel="Add Room"
          searchPlaceholder="Search by room number..."
        />
      )}

      {activeTab === 'allocations' && (
        <DataTable
          title="Room Allocation Directory"
          columns={allocColumns}
          data={allocations}
          totalItems={allocTotal}
          page={allocPage}
          limit={allocLimit}
          isLoading={allocLoading}
          onPageChange={setAllocPage}
          onLimitChange={(l) => { setAllocPage(1); setAllocLimit(l); }}
          onSearch={(s) => { setAllocSearch(s); setAllocPage(1); }}
          onSort={() => {}}
          onAdd={() => { setAllocForm({ studentName: '', enrollmentNo: '', hostelId: hostels[0]?.id || '1', roomNo: '', bedNo: 'Bed-1', allocatedDate: new Date().toISOString().split('T')[0] }); setShowAllocModal(true); }}
          onDelete={(r) => { deleteMockItem('mock_hostel_allocations', DEFAULT_HOSTEL_ALLOCATIONS, r.id); setToast({ message: 'Allocation removed!', type: 'success' }); fetchAllocations(); }}
          addLabel="Allocate Room"
          searchPlaceholder="Search by student or USN..."
        />
      )}

      {activeTab === 'complaints' && (
        <DataTable
          title="Student Complaints & Support Tickets"
          columns={compColumns}
          data={complaints}
          totalItems={compTotal}
          page={compPage}
          limit={compLimit}
          isLoading={compLoading}
          onPageChange={setCompPage}
          onLimitChange={(l) => { setCompPage(1); setCompLimit(l); }}
          onSearch={(s) => { setCompSearch(s); setCompPage(1); }}
          onSort={() => {}}
          searchPlaceholder="Search complaints..."
        />
      )}

      {activeTab === 'mess' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mess.map((m) => (
            <div key={m.id} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{m.hostelName}</h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">Mess Timings: {m.timing}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold dark:bg-indigo-950 dark:text-indigo-300">{m.day} Menu</span>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Breakfast</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{m.breakfast}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Lunch</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{m.lunch}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Dinner</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{m.dinner}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hostel Modal */}
      {showHostelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowHostelModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editHostel ? 'Edit Hostel Block' : 'Add Hostel Block'}</h3>
              <button onClick={() => setShowHostelModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleHostelSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Hostel Block Name *</label>
                <input value={hostelForm.name} onChange={(e) => setHostelForm({ ...hostelForm, name: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Code *</label>
                  <input value={hostelForm.code} onChange={(e) => setHostelForm({ ...hostelForm, code: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Type *</label>
                  <select value={hostelForm.type} onChange={(e) => setHostelForm({ ...hostelForm, type: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0">
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                    <option value="Co-Ed">Co-Ed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Warden Name</label>
                  <input value={hostelForm.wardenName} onChange={(e) => setHostelForm({ ...hostelForm, wardenName: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Contact Phone</label>
                  <input value={hostelForm.contactPhone} onChange={(e) => setHostelForm({ ...hostelForm, contactPhone: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowHostelModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Save Hostel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Room Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRoomModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editRoom ? 'Edit Room' : 'Add Room'}</h3>
              <button onClick={() => setShowRoomModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleRoomSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Room Number *</label>
                  <input value={roomForm.roomNo} onChange={(e) => setRoomForm({ ...roomForm, roomNo: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Hostel Block *</label>
                  <select value={roomForm.hostelId} onChange={(e) => setRoomForm({ ...roomForm, hostelId: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0">
                    {hostels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Room Type</label>
                  <select value={roomForm.roomType} onChange={(e) => setRoomForm({ ...roomForm, roomType: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0">
                    <option value="Single Occupancy">Single Occupancy</option>
                    <option value="Double Occupancy">Double Occupancy</option>
                    <option value="Triple Occupancy">Triple Occupancy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Semester Fee (₹)</label>
                  <input type="number" value={roomForm.feePerSemester} onChange={(e) => setRoomForm({ ...roomForm, feePerSemester: Number(e.target.value) })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowRoomModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Save Room</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Allocation Modal */}
      {showAllocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAllocModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Allocate Room to Student</h3>
              <button onClick={() => setShowAllocModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAllocSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Student Name *</label>
                  <input value={allocForm.studentName} onChange={(e) => setAllocForm({ ...allocForm, studentName: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">USN / Enrollment *</label>
                  <input value={allocForm.enrollmentNo} onChange={(e) => setAllocForm({ ...allocForm, enrollmentNo: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Hostel Block *</label>
                  <select value={allocForm.hostelId} onChange={(e) => setAllocForm({ ...allocForm, hostelId: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0">
                    {hostels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Room Number *</label>
                  <input value={allocForm.roomNo} onChange={(e) => setAllocForm({ ...allocForm, roomNo: e.target.value })} placeholder="e.g. A-101" required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowAllocModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Allocate Bed</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
